const Discord = require('discord.js')
const client = new Discord.Client()
 

module.exports = {
    commands: 'unban',
    permissionError: 'You must be an administrator to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: async (message, args) => {
	
        let search = args.join(" ");
        if(!search) return message.channel.send("Please provide a valid ID or name.");
    
        try {
            let bans = await message.guild.fetchBans();
            let id = bans.get(search) || bans.find(u => u.tag.toLowerCase().includes(search.toLowerCase()));
            
            if(!id) return message.channel.send("I could not find a banned user by this ID or name.");
    
            await message.guild.unban(id);
    
            message.channel.send(`${id.tag} has been unbanned.`);
        } catch(e) {
            message.channel.send(`Unban failed`)
        }
    }
}