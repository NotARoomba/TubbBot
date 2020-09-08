module.exports = (client) => {
    //const channelId = '750766854360006676' // welcome channel
    //const targetChannelId = '719799889973739560' // rules and info
  
    client.on('guildMemberAdd', member => {
        const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
        if(!channel) return;
    
    const welcomeEmbed = new Discord.MessageEmbed()
        .setColor('#8B0000')
        .setTitle(`Welcome`)
        .setDescription(`Welcome to Corona, ${member}! Once you join, you will be infected with the corona virus. There are 3 stages, diagnosed, recovering, and recovered. Once recovered you will be free just to hang out on this server and play, but until then, you have a hard battle. After you recovered, you will be vaccinated which will make sure you're never infected ever again. The way you level up and get through the virus is simply by just hanging out and "spreading" the word about this server! Please read #rules and #roles. Goodluck and may the odds be ever in your favor.
        (Btw -help)`)
    
    channel.send(welcomeEmbed);
    
    });
  }