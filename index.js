import * as fs from 'fs';
import * as path from 'path';
import { Telegraf } from 'telegraf';
import CoinDataService from './CoinDataService/CoinDataService.js';
import StringConverter from './Tools/StringConverter.js';

// import telegram config
const telegramConfig = JSON.parse(fs.readFileSync('./Config/telegram.json'));
// import congecko config
const coingeckoConfig = JSON.parse(fs.readFileSync('./Config/coingecko.json'));
// import covalent config
const covalentConfig = JSON.parse(fs.readFileSync('./Config/covalent.json'));
// ipmort bscscan config
const bscScanConfig = JSON.parse(fs.readFileSync('./Config/bscscan.json'));

// create CoinDataService - this one is fetching all the data from API and functions like a simple cache
const coinDataService = new CoinDataService(coingeckoConfig, covalentConfig, bscScanConfig);

// Setup Telegram bot
const bot = new Telegraf(telegramConfig.telegramApiToken)

// /price command, prints only coin data
bot.command('price', (ctx) => {
    ctx.replyWithMarkdown(`
🚀 [POODL](https://t.me/poodl) 🐩🐩 1M tokens = $${StringConverter.roundXDecimals(coinDataService.pricePerMillion, 5)}

💬 Holders ${StringConverter.formatNumberInternational(coinDataService.currentHolders)}

💴 Market Cap $${StringConverter.calcMarketCap(coinDataService.currentPrice, coinDataService.circulatingSupply)}

💰 Circulating Supply ${StringConverter.convertToTrillion(coinDataService.circulatingSupply)}t+

Updated ${StringConverter.getElapsedSeconds(coinDataService.lastUpdateTime)} seconds ago
    `,
        {
            disable_web_page_preview: true,
            disable_notification: true
        }
    )
});

// /chart command, prints coin data with price chart
bot.command('chart', (ctx) => {
    const priceChartBuffer = coinDataService.priceChartBuffer;
    const caption = `
🚀 [POODL](https://t.me/poodl) 🐩🐩 1M tokens \= $${StringConverter.roundXDecimals(coinDataService.pricePerMillion, 5)}

💬 Holders ${StringConverter.formatNumberInternational(coinDataService.currentHolders)}

💴 Market Cap $${StringConverter.calcMarketCap(coinDataService.currentPrice, coinDataService.circulatingSupply)}

💰 Circulating Supply ${StringConverter.convertToTrillion(coinDataService.circulatingSupply)}t+

Updated ${StringConverter.getElapsedSeconds(coinDataService.lastUpdateTime)} seconds ago
    `;

    if (priceChartBuffer !== null) {
        ctx.replyWithPhoto(
            {
                source: priceChartBuffer,
            },
            {
                caption: caption,
                parse_mode: "Markdown",
                disable_notification: true
            }
        );
    }
});

// /holders command, prints coin data with holders chart
bot.command('holders', (ctx) => {
    //console.log('price wanna');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))