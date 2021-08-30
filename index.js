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

function coinGeckoMessage() {
    let caption = `
🚀 [POODL](https://t.me/poodl) 🐩🐩 1M tokens = $${StringConverter.roundXDecimals(coinDataService.coinData.coinGecko.pricePerMillion, 5)}
    
💬 Holders: ${(coinDataService.coinData.general.currentHolders > 0) ? StringConverter.formatNumberInternational(coinDataService.coinData.general.currentHolders) : '-----'}
    
💴 Market Cap: $${StringConverter.calcMarketCap(coinDataService.coinData.coinGecko.currentPrice, coinDataService.coinData.general.circulatingSupply)}
    
💰 Circulating Supply: ${StringConverter.convertToTrillion(coinDataService.coinData.general.circulatingSupply)}t+
    
Updated: ${StringConverter.getUTCTime(coinDataService.coinData.lastUpdate)}
        `
    if (coinDataService.coinData.general.currentHolders < 1) {
        caption += `
        
**Note: Holders API is currently not available**`;
    }
    
    return caption;
}

// /price command, prints only coin data
bot.command('price', (ctx) => {
    ctx.replyWithMarkdown(coinGeckoMessage(),
        {
            disable_web_page_preview: true,
            disable_notification: true
        }
    )
});

// /chart command, prints coin data with price chart
bot.command('chart', (ctx) => {
    const priceChartBuffer = coinDataService.coinData.coinGecko.priceChartBuffer;
    const caption = coinGeckoMessage();

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
    } else {
        caption += `
**Note: Price chart is currently not available**`;
        ctx.replyWithMarkdown(caption,
        {
            disable_web_page_preview: true,
            disable_notification: true
        });
    }
});

// /holders command, prints coin data with holders chart
bot.command('holders', (ctx) => {
    const holdersChartBuffer = coinDataService.coinData.general.holdersChartBuffer;
    let caption = coinGeckoMessage();

    if (holdersChartBuffer !== null) {
        ctx.replyWithPhoto(
            {
                source: holdersChartBuffer,
            },
            {
                caption: caption,
                parse_mode: "Markdown",
                disable_notification: true
            }
        );
    } else {
        caption += `
**Note: Holders chart is currently not available**`;
        ctx.replyWithMarkdown(caption,
        {
            disable_web_page_preview: true,
            disable_notification: true
        });
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))