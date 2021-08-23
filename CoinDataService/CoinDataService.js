import BscScanService from "../BscScan/BscScanService.js";
import CoinGeckoService from "../CoinGecko/CoinGeckoService.js";
import CovalentService from "../Covalent/CovalentService.js";
import Chartdrawer from "../Tools/ChartDrawer.js";

export default class CoinDataService {
    constructor(coingeckoConfig, covalentConfig, bscScanConfig) {
        this.dataTickerLive = null;
        this.dataTickerHalfMinute = null;
        this.dataTickerHour = null;

        this.coinData = {
            lastUpdate: 0,
            general: {
                burned: 0,
                circulatingSupply: 0,
                currentHolders: 0,
                tokenSupply: 100000000000000,
            },
            coinGecko: {
                currentPrice: 0,
                pricePerMillion: 0,
                marketChartData: null,
                priceChartBuffer: null,
            }
        }

        this.coinGeckoService = new CoinGeckoService(coingeckoConfig);
        this.covalentService = new CovalentService(covalentConfig);
        this.bscScanService = new BscScanService(bscScanConfig);
        this.chartDrawer = new Chartdrawer();

        this.setupDataTicker();
    }

    // gets executed on by the constructor (so basically on bot startup)
    // executes first data fetch + sets up a ticker to fetch data every 30 seconds
    setupDataTicker() {
        this.fetchCoinDataLive();
        this.fetchCoinDataHalfMinute();
        this.fetchCoinDataHour();

        // ticker for live data
        this.dataTickerLive = setInterval(() => {
            try {
                this.fetchCoinDataLive();
            }
            catch (e) {
                console.log(e);
            }
        }, 5000);

        // ticker for data not needed live but frequently
        this.dataTickerHalfMinute = setInterval(() => {
            try {
                this.fetchCoinDataHalfMinute();
            }
            catch (e) {
                console.log(e);
            }
        }, 30000);

        // ticker for non critical data
        this.dataTickerHour = setInterval(() => {
            try {
                this.fetchCoinDataHour();
            }
            catch (e) {
                console.log(e);
            }
        }, 1800000);
    }

    async fetchCoinDataLive() {
        // get simple price
        const pricePromise = this.coinGeckoService.getCoinPrice();
        pricePromise.then(price => {
            this.coinData.coinGecko.currentPrice = price;
            this.coinData.coinGecko.pricePerMillion = price * 1000000;
        })
        .catch(e => {
            console.log(e);
        });

        this.coinData.lastUpdate = Date.now();
    }

    // all coin data gets fetched here
    async fetchCoinDataHalfMinute() {
        // get holders
        const holdersPromise = this.covalentService.getTokenHoldersCount();
        holdersPromise.then(holders => {
            this.coinData.general.currentHolders = holders;
        })
        .catch(e => {
            console.log(e);
        });

        // get market chart data from the last 24 hours
        const marketChartDataPromise = this.coinGeckoService.getMarketChartsData();
        marketChartDataPromise.then(marketChartData => {
            this.coinData.coinGecko.marketChartData = marketChartData;

            // draw price chart
           const priceChartBufferPromise = this.chartDrawer.renderPriceChart(marketChartData.prices);
           priceChartBufferPromise.then(buffer => {
            this.coinData.coinGecko.priceChartBuffer = buffer;
           })
           .catch(e => {
                console.log(e);
            });
        })
        .catch(e => {
            console.log(e);
        });

        this.coinData.lastUpdate = Date.now();
    }

    async fetchCoinDataHour() {
        // get burned amount
        const burnedAmountPromise = this.bscScanService.getBurnAmount();
        burnedAmountPromise.then(burnedAmount => {
            this.coinData.general.burned = burnedAmount;
            this.coinData.general.circulatingSupply = this.coinData.general.tokenSupply - this.coinData.general.burned;
        })
        .catch(e => {
            console.log(e);
        });

        this.coinData.lastUpdate = Date.now();
    }
}