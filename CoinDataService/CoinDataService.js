import BscScanService from "../BscScan/BscScanService.js";
import CoinGeckoService from "../CoinGecko/CoinGeckoService.js";
import CovalentService from "../Covalent/CovalentService.js";
import Chartdrawer from "../Tools/ChartDrawer.js";

export default class CoinDataService {
    constructor(coingeckoConfig, covalentConfig, bscScanConfig) {
        this.dataTicker = null;

        this.currentPrice = 0;
        this.pricePerMillion = 0;
        this.currentHolders = 0;
        this.marketChartData = null; // contains: prices, market_cap, total_volumes
        this.priceChartBuffer = null; // holds the price chart as an image stream
        this.lastUpdateTime = 0; // holds a seconds timestamp
        this.burned = 0;
        this.tokenSupply = 100000000000000;
        this.circulatingSupply = 0;

        this.coinGeckoService = new CoinGeckoService(coingeckoConfig);
        this.covalentService = new CovalentService(covalentConfig);
        this.bscScanService = new BscScanService(bscScanConfig);
        this.chartDrawer = new Chartdrawer();

        this.setupDataTicker();
    }

    // gets executed on by the constructor (so basically on bot startup)
    // executes first data fetch + sets up a ticker to fetch data every 30 seconds
    setupDataTicker() {
        this.fetchCoinData();

        this.dataTicker = setInterval(() => {
            this.fetchCoinData();
        }, 30000);
    }

    // all coin data gets fetched here
    async fetchCoinData() {
        // get simple price
        const pricePromise = this.coinGeckoService.getCoinPrice();
        pricePromise.then(price => {
            this.currentPrice = price;
            this.pricePerMillion = price * 1000000;
        });

        // get holders
        const holdersPromise = this.covalentService.getTokenHoldersCount();
        holdersPromise.then(holders => {
            this.currentHolders = holders;
        });

        // get market chart data from the last 24 hours
        const marketChartDataPromise = this.coinGeckoService.getMarketChartsData();
        marketChartDataPromise.then(marketChartData => {
            this.marketChartData = marketChartData;

            // draw price chart
           const priceChartBufferPromise = this.chartDrawer.renderPriceChart(marketChartData.prices);
           priceChartBufferPromise.then(buffer => {
               this.priceChartBuffer = buffer;
           })
        })

        // get burned amount
        const burnedAmountPromise = this.bscScanService.getBurnAmount();
        burnedAmountPromise.then(burnedAmount => {
            this.burned = burnedAmount;
            this.circulatingSupply = this.tokenSupply - this.burned;
        });

        this.lastUpdateTime = Math.floor(Date.now() / 1000);
    }
}