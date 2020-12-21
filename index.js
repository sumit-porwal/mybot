//imports
const Discord = require('discord.js');
const auth = require('./auth.json');
const audio = require('./music.js');

//global variables
var prefix = "!";
var dispatcher = {};
var dummyConnection;
const queue = new audio.queue();
//play function;
const play = async (connection, message) => {
    //calling audio.play in aduio module in musing.js
    dispatcher = await audio.play(queue.front(), connection);
    //listning for starting event
    dispatcher.on('start', () => {
        message.channel.send('playing ' + queue.front())

    })

    dispatcher.on('finish', () => {
        queue.dequeue();
        if (queue.isEmpty()) {
            //leaving VC with message
            message.channel.send('nothing to play leaving VC');
            message.member.voice.channel.leave();
        } else {
            //playing song on top of the queue
            play(connection, message);
            //sending message about song
            message.channel.send('playing ' + queue.front());
        }
    });


}
//intiating bot
const bot = new Discord.Client()

//ready event trigger when bot is ready to roll 
bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setActivity('!help', {
            type: 'WATCHING'
        })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

//here the fun begin message hadling start from here
bot.on('message', async message => {
    //checking for prefix before hadling command
    if (message.content.substring(0, 1) == prefix) {
        var args = message.content.substring(1).split(' ');

        var cmd = args[0];
        var substr = args.splice(1).join(' ');

        // switch case for various primary commads
        switch (cmd) {
            case 'help':
                //help message
                message.channel.send(
                    "Sumit's bot help menu ``` avatar: to show your avatar \n\n ping: to check awailability \n\n play[args]: to play song \n\n valume[args]: set volume \n\n pause: pause stream \n\n resume: resume stream  \n\n stop: stop stream ```"
                )
                break;
            case 'ping':
                //for checking the connection
                message.channel.send('pong');
                break;
            case 'avatar':
                //show the avatar of profile pitcher of auther
                message.reply(message.author.displayAvatarURL());
                break;

                //these cases are for music commands
            case 'play':
                //cheecking if messagee if DM or in guild
                if (!message.guild) return;
                //checking if user in VC or not
                if (message.member.voice.channel) {
                    //connecting ot VC
                    const connection = await message.member.voice.channel.join();
                    dummyConnection = connection;
                    //cheking if queue is empty or not
                    if (queue.isEmpty()) {

                        queue.enqueue(substr);

                        play(connection, message);

                    } else {

                        queue.enqueue(substr);
                        message.channel.send(substr + " queued.");
                    }

                } else {
                    message.reply('You need to join a voice channel first!');
                }
                break;
            case 'stop':
                if (dispatcher) {
                    dispatcher.destroy();
                    message.member.voice.channel.leave();
                } else {

                    message.channel.send('no songs playing bitch');
                }
                break;
            case 'pause':
                dispatcher.pause();
                break;
            case 'resume':
                dispatcher.resume();
                break;
            case 'volume':
                dispatcher.setVolume(args[1]);
                break;
            case 'test':
                message.channel.send(substr)
                break;
            case 'skip':
                if (message.member.voice.channel) {
                    if (queue.isEmpty()) {

                        message.channel.send('nothing to play');

                    } else {

                        queue.dequeue();
                        play(dummyConnection, message);
                        message.channel.send('skipped song');
                    }

                }
                break;
            case 'queue':
                message.channel.send(queue.printQueue());
                break;


            default:
                message.channel.send('invalid commad');
                break;

        }
    }

});
bot.login(auth.token); //bot login using token in auth;