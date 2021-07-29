import axios from 'axios';

export default class CovalentService {
    constructor(covalentConfig) {
        this.covalentApiKey = covalentConfig.covalentApiKey;
        this.networkID = covalentConfig.networkID;
        this.contract = covalentConfig.contract;

        // see https://www.covalenthq.com/docs/api/ for all endpoints
        this.baseUrl = `https://api.covalenthq.com/v1/${this.networkID}/`;
        this.holdersEndpoint = `tokens/${this.contract}/token_holders/?page-size=1&key=${this.covalentApiKey}`
    }

    // get holders from last block, limited to one per page (minimum required amount to fetch).
    // But only the total_count of holders is used and returned
    getTokenHoldersCount() {
        return new Promise(resolve => {
            axios.get(this.baseUrl + this.holdersEndpoint)
                .then(response => {
                    const data = response.data.data;
                    const holders = data.pagination.total_count;
                    resolve(holders);
                })
                .catch(error => {
                    console.error(`Error fetching holders: ${this.baseUrl + this.holdersEndpoint}`);
                    resolve(-1);
                });
        });
    }
}