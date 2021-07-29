import axios from 'axios';

export default class BscScanService {
    constructor(bscScanConfig) {
        this.bscScanConfig = bscScanConfig;
        this.baseUrl = 'https://api.bscscan.com/api';
        this.burnAddressEndpoint = `?module=account&action=tokenbalance&contractaddress=${this.bscScanConfig.contract}&address=${this.bscScanConfig.burnAddress}&tag=latest&apikey=${this.bscScanConfig.bscscanApiKey}`;
    }

    async getBurnAmount() {
        return new Promise(resolve => {
            axios.get(this.baseUrl + this.burnAddressEndpoint)
                .then(response => {
                    const burnedAddress = parseInt(response.data.result);
                    const burnedSum = burnedAddress + parseInt(this.bscScanConfig.contractBurn);
                    const burnedConverted = burnedSum / 1000000000;

                    resolve(burnedConverted);
                })
                .catch(error => {
                    console.error(`Error fetching burn: ${this.baseUrl + this.burnAddressEndpoint}`);
                    resolve(-1);
                });
        });
    }
}