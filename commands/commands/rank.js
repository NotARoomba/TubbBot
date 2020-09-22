const { MessageAttachment } = require("discord.js");


module.exports = {
    commands: 'rank',
    description: 'I wanna be the best...',
    callback: async (client, message, args) => {

        let user =
        message.mentions.users.first() ||
        client.users.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild) ||
        message.author;
    
      let level = client.db.get(`level_${user.id}`) || 0;
      level = level.toString();
      let exp = client.db.get(`xp_${user.id}`) || 0;
      let neededXP = Math.floor(Math.pow(level / 0.1, 2));
    
      let every = client.db
        .all()
        .filter(i => i.ID.startsWith("xp_"))
        .sort((a, b) => b.data - a.data);
      let rank = every.map(x => x.ID).indexOf(`xp_${user.id}`) + 1;
      rank = rank.toString();
      let img = await client.canvas.rank({
        username: user.username,
        discrim: user.discriminator,
        currentXP: exp.toString(),
        neededXP: neededXP.toString(),
        rank,
        level,
        avatarURL: user.displayAvatarURL({ format: "jpg" }),
        background: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimage4.uhdpaper.com%2Fwallpaper%2Fspace-stars-black-hole-uhdpaper.com-4K-4.758.jpg&imgrefurl=https%3A%2F%2Fwww.uhdpaper.com%2F2019%2F09%2Fspace-stars-black-hole-4k-4758.html&tbnid=h2wHxntS160tVM&vet=12ahUKEwjn9OC82fzrAhUPX60KHYpaD4AQMygLegUIARDhAQ..i&docid=RyV4V0NmQ9Q-wM&w=3840&h=2160&q=space%20pictures%204k&ved=2ahUKEwjn9OC82fzrAhUPX60KHYpaD4AQMygLegUIARDhAQ"
      });
      return message.channel.send(new MessageAttachment(img, "rank.png"));
    
    
    function match(msg, i) {
      if (!msg) return undefined;
      if (!i) return undefined;
      let user = i.members.cache.find(
        m =>
          m.user.username.toLowerCase().startsWith(msg) ||
          m.user.username.toLowerCase() === msg ||
          m.user.username.toLowerCase().includes(msg) ||
          m.displayName.toLowerCase().startsWith(msg) ||
          m.displayName.toLowerCase() === msg ||
          m.displayName.toLowerCase().includes(msg)
      );
      if (!user) return undefined;
      return user.user;
    }
    }
}