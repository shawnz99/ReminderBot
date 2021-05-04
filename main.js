//  ~ Nodes native file system module
const fs = require('fs');
//   ~ Require includes modules like import or include
const Discord  = require('discord.js');
const schedule = require('node-schedule');
const { PREFIX, TOKEN } = require('./config.js');

//   ~ Creates a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

//fs.readdirsync() returns an array of all the file names in that directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for ( const file of commandFiles )
{
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

//   ~ Array (List) to store the reminders in to then print later
var reminders = [];
var j ;

//   ~ When a message is sent on the server
client.on('message', message => {

    
    //   ~ Getting the channel data to send a message to
    const remindersChannel = client.channels.cache.find(channel => channel.name === "reminders");
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    //   ~ If the message was prefaced with the command '!reminder'
    if ( command === "add")
    {
        // ~ Clears the schedule so it does not set a new job every time
        if ( j !== undefined)
        {
            j.cancel();
        }
        client.commands.get('add').execute(message,args, reminders, j, remindersChannel, schedule);
        
        if ( reminders.length != 0 )
        {
            
            /*
                .scheduleJob(' * * * * * * ' , function )
                *    *    *    *    *    *
                ┬    ┬    ┬    ┬    ┬    ┬
                │    │    │    │    │    │
                │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
                │    │    │    │    └───── month (1 - 12)
                │    │    │    └────────── day of month (1 - 31)
                │    │    └─────────────── hour (0 - 23)
                │    └──────────────────── minute (0 - 59)
                └───────────────────────── second (0 - 59, OPTIONAL)
            */

            j = schedule.scheduleJob( ' 0 0 13 * * * ', function() {remindersChannel.send(reminders); });
        }
    }
    else if ( command === "delete" )
    {
        client.commands.get('delete').execute(message, args, reminders);
    }

});


/*
    - TO DO

    ~ Fix the indexing
    ~ copy this to to-dos / combine to-dos & reminders

*/
client.on('ready', () => {

    console.info(`Bot Logged In As ${client.user.tag}`);
    
});

//   ~ Keep at end of file. Logs into discord with this apps token
client.login(TOKEN);
