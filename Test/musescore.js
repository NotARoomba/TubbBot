const rp = require("request-promise-native");
const ytdl = require("ytdl-core");
const requestYTDLStream = (url, opts) => {
    const timeoutMS = opts.timeout && !isNaN(parseInt(opts.timeout)) ? parseInt(opts.timeout) : 30000;
    const timeout = new Promise((_resolve, reject) => setTimeout(() => reject(new Error(`YTDL video download timeout after ${timeoutMS}ms`)), timeoutMS));
    const getStream = new Promise((resolve, reject) => {
        const stream = ytdl(url, opts);
        stream.on("finish", () => resolve(stream)).on("error", err => reject(err));
    });
    return Promise.race([timeout, getStream]);
};
const { validMSURL, findValueByPrefix, streamToString, requestStream } = require("@util/function.js");
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const PNGtoPDF = (doc, url) => new Promise(async (resolve, reject) => {
    const rs = require("request-stream");
    rs.get(url, {}, (err, res) => {
        if (err) return reject(err);
        const chunks = [];
        res.on("data", chunk => chunks.push(chunk));
        res.on("end", () => {
            try {
                doc.image(Buffer.concat(chunks), 0, 0, { width: doc.page.width, height: doc.page.height });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
});

module.exports = class MusescoreCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'musescore',
            aliases: ['muse'],
            group: 'util',
            memberName: 'musescore',
            description: 'Get information of a MuseScore link, or search the site.',
            args: [
                {
                    key: 'args',
                    prompt: 'What link or keywords do you want to search for?',
                    type: 'string',
                }
            ],
        });
    }
    async run(message, { args }) {
        const cmdname = this.name;
        if (!validMSURL(args)) return await MusescoreCommand.search(message, args, cmdname);
        var message = await message.channel.send("Loading score...");
        try {
            const response = await rp({ uri: args, resolveWithFullResponse: true });
            if (Math.floor(response.statusCode / 100) !== 2) return message.channel.send(`Received HTTP status code ${response.statusCode} when fetching data.`);
            var data = MusescoreCommand.parseBody(response.body);
        } catch (err) {
            return message.reply("there was an error trying to fetch data of the score!");
        }
        const em = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle(data.title)
            .setURL(data.url)
            .setThumbnail(data.thumbnail)
            .setDescription(`Description: **${data.description}**\n\nClick 📥 to download MP3 and PDF`)
            .addField("ID", data.id, true)
            .addField("Author", data.user.name, true)
            .addField("Duration", data.duration, true)
            .addField("Page Count", data.pageCount, true)
            .addField("Date Created", new Date(data.created * 1000).toLocaleString(), true)
            .addField("Date Updated", new Date(data.updated * 1000).toLocaleString(), true)
            .addField(`Tags [${data.tags.length}]`, data.tags.length > 0 ? (data.tags.join(", ").length > 1024 ? (data.tags.join(" ").slice(0, 1020) + "...") : data.tags.join(" ")) : "None")
            .addField(`Parts [${data.parts.length}]`, data.parts.length > 0 ? (data.parts.join(", ").length > 1024 ? (data.parts.join(" ").slice(0, 1020) + "...") : data.parts.join(" ")) : "None")
            .setTimestamp()
            .setFooter("Have a nice day! :)");
        var message = await message.edit({ content: "", embed: em });
        await message.react("📥");
        const collected = await message.awaitReactions((reaction, user) => user.id !== message.author.id && (reaction.emoji.name == "📥"), { max: 1, idle: 30000 });
        message.reactions.removeAll();
        if (collected.first().emoji.name == "📥") {
            console.log(`Downloading ${args} in server ${message.guild.name}...`);
            try {
                try {
                    var mesg = await message.channel.send("Generating MP3...");
                    let mp3 = MusescoreCommand.getMP3(args);
                    mp3.then(function (result) {
                        console.log(result) // "Some User token"
                    })
                    try {
                        if (mp3.error) throw new Error(mp3.message);
                        console.log(mp3)
                        if (mp3.url.startsWith("https://www.youtube.com/embed/")) {
                            const ytid = mp3.url.split("/").slice(-1)[0].split("?")[0];
                            var res = await requestYTDLStream(`https://www.youtube.com/watch?v=${ytid}`, { highWaterMark: 1 << 25, filter: "audioonly", dlChunkSize: 0, requestOptions: { headers: { cookie: process.env.COOKIE, 'x-youtube-identity-token': process.env.YOUTUBE_API } } });
                        } else var res = await requestStream(mp3.url);
                        const att = new Discord.MessageAttachment(res, `${data.title}.mp3`);
                        if (!res) throw new Error("Failed to get Readable Stream");
                        else if (res.statusCode && res.statusCode != 200) throw new Error("Received HTTP Status Code: " + res.statusCode);
                        else await message.channel.send(att);
                        await mesg.delete();
                    } catch (err) {
                        await mesg.edit(`Failed to generate MP3! \`${err.message}\``);
                    }
                    mesg = await message.channel.send("Generating PDF...");
                    const { doc, hasPDF, err } = await MusescoreCommand.getPDF(args, data);
                    try {
                        if (!hasPDF) throw new Error(err ? err : "No PDF available");
                        const att = new Discord.MessageAttachment(doc, `${data.title}.pdf`);
                        await message.channel.send(att);
                        await mesg.delete();
                    } catch (err) {
                        await mesg.edit(`Failed to generate PDF! \`${err.message}\``);
                    }
                    console.log(`Completed download ${args} in server ${message.guild.name}`);
                } catch (err) {
                    console.log(`Failed download ${args} in server ${message.guild.name}`);
                    await message.say("there was an error trying to send the files!");
                }
            } catch (err) {
                console.log(err, `Failed download ${args} in server ${message.guild.name}`);
                await message.channel.send("Failed to generate files!");
            }
        }
    };
    static parseBody(body) {
        const $ = cheerio.load(body);
        const meta = $('meta[property="og:image"]')[0];
        const image = meta.attribs.content;
        const firstPage = image.split("@")[0];
        const stores = Array.from($('div[class^="js-"]'));
        const found = stores.find(x => x.attribs && x.attribs.class && x.attribs.class.match(/^js-\w+$/) && findValueByPrefix(x.attribs, "data-"));
        const store = findValueByPrefix(found.attribs, "data-");
        const data = JSON.parse(store).store.page.data;
        const id = data.score.id;
        const title = data.score.title;
        const thumbnail = data.score.thumbnails.large;
        const parts = data.score.parts_names;
        const url = data.score.share.publicUrl;
        const user = data.score.user;
        const duration = data.score.duration;
        const pageCount = data.score.pages_count;
        const created = data.score.date_created;
        const updated = data.score.date_updated;
        const description = data.score.truncated_description;
        const tags = data.score.tags;
        return { id, title, thumbnail, parts, url, user, duration, pageCount, created, updated, description, tags, firstPage };
    };
    static async search(message, args, cmdname) {
        try {
            const response = await rp({ uri: `https://musescore.com/sheetmusic?text=${encodeURIComponent(args)}`, resolveWithFullResponse: true });
            if (Math.floor(response.statusCode / 100) !== 2) return message.channel.send(`Received HTTP status code ${response.statusCode} when fetching data.`);
            var body = response.body;
        } catch (err) {
            return message.reply("there was an error trying to search for scores!");
        }
        var message = await message.channel.send("Loading scores...");
        message.channel.startTyping();
        var $ = cheerio.load(body);
        const stores = Array.from($('div[class^="js-"]'));
        const store = findValueByPrefix(stores.find(x => x.attribs && x.attribs.class && x.attribs.class.match(/^js-\w+$/)).attribs, "data-");
        var data = JSON.parse(store);
        const allEmbeds = [];
        const importants = [];
        var num = 0;
        var scores = data.store.page.data.scores;
        for (const score of scores) {
            try {
                const response = await rp({ uri: score.share.publicUrl, resolveWithFullResponse: true });
                if (Math.floor(response.statusCode / 100) !== 2) return message.channel.send(`Received HTTP status code ${response.statusCode} when fetching data.`);
                body = response.body;
            } catch (err) {
                await message.delete();
                return message.reply("there was an error trying to fetch data of the score!");
            }
            data = MusescoreCommand.parseBody(body);
            const em = new Discord.MessageEmbed()
                .setColor('#000000')
                .setTitle(data.title)
                .setURL(data.url)
                .setThumbnail(data.thumbnail)
                .setDescription(`Description: **${data.description}**\n\nTo download, please copy the URL and use \`${message.guild.commandPrefix}${cmdname} <link>\``)
                .addField("ID", data.id, true)
                .addField("Author", data.user.name, true)
                .addField("Duration", data.duration, true)
                .addField("Page Count", data.pageCount, true)
                .addField("Date Created", new Date(data.created * 1000).toLocaleString(), true)
                .addField("Date Updated", new Date(data.updated * 1000).toLocaleString(), true)
                .addField(`Tags [${data.tags.length}]`, data.tags.length > 0 ? data.tags.join(", ") : "None")
                .addField(`Parts [${data.parts.length}]`, data.parts.length > 0 ? data.parts.join(", ") : "None")
                .setTimestamp()
                .setFooter(`Currently on page ${++num}/${scores.length}`, message.client.user.displayAvatarURL());
            allEmbeds.push(em);
            importants.push({ important: data.important, pages: data.pageCount, url: score.share.publicUrl, title: data.title, id: data.id });
        }
        if (allEmbeds.length < 1) return message.channel.send("No score was found!");

        var s = 0;
        await message.delete();
        var message = await message.channel.send(allEmbeds[0]);
        await message.react("⏮");
        await message.react("◀");
        await message.react("▶");
        await message.react("⏭");
        await message.react("⏹");
        message.channel.stopTyping(true);
        const filter = (reaction, user) => user.id !== message.author.id
        var collector = message.createReactionCollector(
            filter,
            { idle: 60000, errors: ["time"] }
        );

        collector.on("collect", (reaction, user) => {
            //reaction.users.remove(user.id);
            switch (reaction.emoji.name) {
                case "⏮":
                    reaction.users.remove(user).catch(console.error);
                    s = 0;
                    message.edit(allEmbeds[s]);
                    break;
                case "◀":
                    reaction.users.remove(user).catch(console.error);
                    s -= 1;
                    if (s < 0) s = allEmbeds.length - 1;
                    message.edit(allEmbeds[s]);
                    break;
                case "▶":
                    reaction.users.remove(user).catch(console.error);
                    s += 1;
                    if (s > allEmbeds.length - 1) s = 0;
                    message.edit(allEmbeds[s]);
                    break;
                case "⏭":
                    reaction.users.remove(user).catch(console.error);
                    s = allEmbeds.length - 1;
                    message.edit(allEmbeds[s]);
                    break;
                case "⏹":
                    collector.emit("end");
                    break;
            }
        });
        collector.on("end", function () {
            message.reactions.removeAll().catch(() => { });
        });
    }
    static async getMP3(url) { await (Object.getPrototypeOf(async function () { }).constructor())(url) }
    static async getPDF(url, data) {
        if (!data) {
            const res = await rp({ uri: url, resolveWithFullResponse: true });
            data = MusescoreCommand.parseBody(res.body);
        }
        var result = { doc: null, hasPDF: false };
        var score = data.firstPage.replace(/png$/, "svg");
        var fetched = await fetch(score);
        if (!fetched.ok) {
            score = data.firstPage;
            var fetched = await fetch(score);
            if (!fetched.ok) {
                result.err = "Received Non-200 HTTP Status Code";
                return result;
            }
        }
        var pdf = [score];
        if (data.pageCount > 1) {
            const pdfapi = await (Object.getPrototypeOf(async function () { }).constructor("url", "cheerio", "firstPage", "pageCount"))(url, cheerio, score, data.pageCount);
            if (pdfapi.error) return { doc: undefined, hasPDF: false };
            pdf = pdfapi.pdf;
        }
        const doc = new PDFDocument();
        var hasPDF = true;
        for (let i = 0; i < pdf.length; i++) {
            const page = pdf[i];
            try {
                const ext = page.split("?")[0].split(".").slice(-1)[0];
                if (ext === "svg") try {
                    SVGtoPDF(doc, await streamToString(await requestStream(page)), 0, 0, { preserveAspectRatio: "xMinYMin meet" });
                } catch (err) {
                    SVGtoPDF(doc, await fetch(page).then(res => res.text()), 0, 0, { preserveAspectRatio: "xMinYMin meet" });
                }
                else await PNGtoPDF(doc, page);
                if (i + 1 < data.pageCount) doc.addPage();
            } catch (err) {
                result.err = err.message;
                hasPDF = false;
                break;
            }
        }
        doc.end();
        return { doc: doc, hasPDF: hasPDF };
    }
    static getStr(pool, id) {
        new Promise(async (resolve, reject) => {
            try {
                var [results] = await pool.query("SELECT string FROM functions WHERE id = " + id);
                if (results.length < 1 || !results[0].string) return reject(new Error("Not found"));
                resolve(results[0].string);
            } catch (err) {
                reject(err);
            }
        })
    }
}