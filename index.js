require('dotenv').config();
const Telegraf = require('telegraf');
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
  try {
    await characterAI.authenticateWithToken(process.env.ACCOUNT_TOKEN);
    console.log('Successfully authenticated with Character AI');

    const characterId = process.env.CHARACTER_ID;
    console.log(`Using Character ID: ${characterId}`);

    const chat = await characterAI.createOrContinueChat(characterId);
    console.log('Successfully created/continued chat with Character AI');

    bot.start((ctx) => {
      ctx.reply('Welcome ' + ctx.from.first_name);
    });

    bot.on('text', async (ctx) => {
      try {
        console.log(`Received message: "${ctx.message.text}" from ${ctx.from.first_name}`);

        const response = await chat.sendAndAwaitResponse(ctx.message.text, true);
        console.log(`Response from Character AI: "${response}"`);

        ctx.reply(response);
      } catch (error) {
        console.error('Error while processing message', error);
      }
    });

    bot.launch();
    console.log('Bot launched');
  } catch (error) {
    console.error('Error while launching bot', error);
  }
})();

