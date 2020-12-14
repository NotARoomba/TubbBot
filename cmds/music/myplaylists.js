
module.exports = class MyPlaylistsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'my-playlists',
      aliases: ['mps', 'my-queues', 'my-saved-queues', 'playlists', 'mpl', 'mp'],
      group: 'music',
      memberName: 'my-playlists',
      guildOnly: true,
      description: 'List your saved playlists'
    });
  }

  run(message) {

    webhookClient.send(`Command: ${this.name} 
Ran by: ${message.author.tag}
Server: ${message.guild.name}
Date: ${new Date()}
-------------------------------------------------------------------------------------------`)
    // check if user has playlists or user is in the db
    const dbUserFetch = db.get(message.member.id);
    if (!dbUserFetch) {
      message.reply('You have zero saved playlists!');
      return;
    }
    const savedPlaylistsClone = dbUserFetch.savedPlaylists;
    if (savedPlaylistsClone.length == 0) {
      message.reply('You have zero saved playlists!');
      return;
    }
    const playlistsEmbed = new Pagination.FieldsEmbed()
      .setArray(savedPlaylistsClone)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setElementsPerPage(5)
      .formatField('# - Playlist', function (e) {
        return `**${savedPlaylistsClone.indexOf(e) + 1}**: ${e.name}`;
      });

    playlistsEmbed.embed.setColor('#ff7373').setTitle('Saved Playlists');
    playlistsEmbed.build();
  }
};