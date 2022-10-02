const { Client, GatewayIntentBits, MessagePayload } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
  // client.channels.cache.get(process.env.CHANNEL_ID).send({
  //     files: ['package.json']
  // })
  //     .catch(console.error);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'server') {
    await interaction.reply('Server info.');
  } else if (commandName === 'user') {
    await interaction.reply('User info.');
  }
});

/**
 * 
 * @param {File} file the file to save
 * @returns link to saved file
 */
async function saveFile(file) {
  if (client.isReady) {
    console.log(file.name);
    console.log(process.version);
    let msg = await client.channels.cache.get(process.env.CHANNEL_ID).send({
      files: [{
        attachment: file.data,
        name: file.name
      }]
    })
      .catch(console.error);
    let uploaded = await msg.attachments.map(a => a.url);
    return uploaded[0];
  } else {
    console.log("not ready");
  }
}

// Login to Discord with your client's token
client.login(process.env.TOKEN);
module.exports = {
  saveFile
}