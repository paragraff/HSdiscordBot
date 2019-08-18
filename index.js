const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json');

if (!Reflect.has(config, 'token')) {
  console.log('Please provide the bot\'s token in the "config.json" to connect to the Discord');
  return;
}

main(config);

async function main(config) {

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  // set command handlers
  for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }

  // subscribe to all messages all discord server which allow this bot
  client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/\s+/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  });

  // connect the bot to the discord
  try {
    await client.login(config.token);
  } catch (e) {
    console.log('Something went wrong. Discord login filed with error: ' + e.message)
  }
}