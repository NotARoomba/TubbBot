const { validYTURL, validSPURL, validGDURL, validGDFolderURL, validYTPlaylistURL, validSCURL, addYTURL } = require("../../function.js");
module.exports = {
    name: 'pla2y',
    aliases: ['p2'],
    description: 'Plays music!',
    async execute(message, args) {
        try {
            if (validYTPlaylistURL(args)) result = await addYTPlaylist(message, args);
            else if (validYTURL(args)) result = await addYTURL(message, args);
            else if (validSPURL(args)) result = await addSPURL(message, args);
            else if (validSCURL(args)) result = await addSCURL(message, args);
            else if (validGDFolderURL(args)) result = await addGDFolderURL(message, args);
            else if (validGDURL(args)) result = await addGDURL(message, args);
            else if (message.attachments.size > 0) result = await addAttachment(message);
            else result = await search(message, args);
        } catch (err) {
            console.log(err)
        }

    },
}
