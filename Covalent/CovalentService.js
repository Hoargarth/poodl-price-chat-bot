import axios from 'axios';

export default class CovalentService {
    constructor(covalentConfig) {
        this.covalentApiKey = covalentConfig.covalentApiKey;
        this.networkID = covalentConfig.networkID;
        this.contract = covalentConfig.contract;

        // see https://www.covalenthq.com/docs/api/ for all endpoints
        this.baseUrl = `https://api.covalenthq.com/v1/${this.networkID}/`;
        this.holdersEndpoint = `tokens/${this.contract}/token_holders/?page-size=1&key=${this.covalentApiKey}`;
        this.blockEndpoint = `block_v2/{{block_height}}/?&key=${this.covalentApiKey}`
    }

    // get holders from last block, limited to one per page (minimum required amount to fetch).
    // But only the total_count of holders is used and returned
    getTokenHoldersCount(height = null) {
        return new Promise(resolve => {

            let endpointAddress = this.baseUrl + this.holdersEndpoint;

            if (height) {
                endpointAddress += `&block-height=${height}`;
            }

            axios.get(endpointAddress)
                .then(response => {
                    const data = response.data.data;
                    resolve(data);
                })
                .catch(error => {
                    console.error(`Error fetching holders: ${endpointAddress}`);
                    resolve(-1);
                });
        });
    }

    // get info for a single block
    getBlockInfo(height) {
        return new Promise(resolve => {
            const endpointAddress = this.baseUrl + this.blockEndpoint.replace('{{block_height}}', height);
            
            axios.get(endpointAddress)
                .then(response => {
                    const data = response.data.data;
                    
                    if (!response.data.error) {
                        resolve(data);
                    } else {
                        resolve(-1);
                    }
                })
                .catch(error => {
                    resolve(-1);
                })
        })
    }
}