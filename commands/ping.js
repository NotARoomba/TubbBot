module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args){
        then((resultMessage) => {
            message.reply(`Your ping is ${Date.now() - message.createdTimestamp} ms`)
            target=_blank
        })
    }
};
