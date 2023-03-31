require('dotenv').config();
const Telegraf = require('telegraf');
const { read } = require('fs');
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
  try {
    await characterAI.authenticateWithToken(process.env.ACCOUNT_TOKEN);
    console.log('Successfully authenticated with Character AI');

    const characterId = process.env.CHARACTER_ID;
    console.log(`Using Character ID: ${characterId}`);

    const chat = await characterAI.createOrContinueChat(characterId);
    console.log('Successfully created/continued chat with Character AI');

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless().addArguments('--disable-dev-shm-usage'))
      .build();

    bot.start((ctx) => {
      ctx.reply('Welcome ' + ctx.from.first_name);
    });

    bot.on('text', async (ctx) => {
      try {
        console.log(`Received message: "${ctx.message.text}" from ${ctx.from.first_name}`);

        await driver.get('https://example.com');
        await driver.findElement(By.name('q')).sendKeys(ctx.message.text, Key.RETURN);
        await driver.wait(until.elementLocated(By.id('search')));
        const response = await driver.findElement(By.id('search')).getText();
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

