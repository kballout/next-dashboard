const { Client, GatewayIntentBits } = require("discord.js");
let bot;

module.exports = async function getBot() {
  if (!bot || !bot.isReady()) {
    console.log('create new bot');
    bot = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    });
    bot.once("ready", () => {
      console.log("Ready!");
    });
    await bot.login(process.env.TOKEN);    
  }
  return bot;
}
