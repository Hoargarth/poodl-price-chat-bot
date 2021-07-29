import { CoinGeckoClient } from 'coingecko-api-v3';

export default class CoinGeckoService {
    constructor(coingeckoConfig) {
        this.coinGeckoConfig = coingeckoConfig;

        this.client = new CoinGeckoClient({
            timeout: 10000,
            autoRetry: true
        })

        this.coinID = this.coinGeckoConfig.coinID;
        this.vsCurrency = this.coinGeckoConfig.vsCurrency;
    }

    // gets the simple price for a specified coin, EG POODL / USD
    async getCoinPrice() {
        return new Promise(resolve => {
            const simplePriceResponse = this.client.simplePrice({
                ids: [this.coinID],
                vs_currencies: [this.vsCurrency]
            });

            simplePriceResponse.then(simplePriceData => {
                const simplePrice = simplePriceData[this.coinID][this.vsCurrency];
                resolve(simplePrice);
            });
        });
    }

    // gets market charts data
    async getMarketChartsData() {
        return new Promise(resolve => {
            const marketChartDataResponse = this.client.coinIdMarketChart({
                id: this.coinID,
                vs_currency: this.vsCurrency,
                days: 1,
                interval: "minutely"
            });

            marketChartDataResponse.then(chartData => {
                resolve(chartData);
            });
        });
    }
}