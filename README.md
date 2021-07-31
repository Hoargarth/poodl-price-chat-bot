# POODL Price Chat Bot

All API-endpoints used are free!

### APIs Used
[BSCScan](https://bscscan.com/apis)
-- get burn wallet balance -- [endpoint](https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xe9e7cea3dedca5984780bafc599bd69add087d56&address=0x89e73303049ee32919903c09e8de5629b84f59eb&tag=latest&apikey=YourApiKeyToken)

[CoinGecko](https://www.coingecko.com/api/documentations/v3) - using node library [coingecko-api-v3](https://www.npmjs.com/package/coingecko-api-v3)
-- get current price -- [endpoint](https://api.coingecko.com/api/v3/simple/price?ids=poodle&vs_currencies=usd)
-- get market data -- [endpoint]('https://api.coingecko.com/api/v3/coins/poodl/market_chart?vs_currency=usd&days=1&interval=hourly)

[CovalentHQ](https://www.covalenthq.com/docs/api/)
-- get current holders -- [endpoint](https://api.covalenthq.com/v1/56/tokens/0x4a68c250486a116dc8d6a0c5b0677de07cc09c5d/token_holders/?&key=API_KEY)

### Configuration files (in ./Config/ folder)
**bscscan.json**
-- bscscanApiKey - You can get it by registering for the [BSCScan API](https://bscscan.com/apis)
-- contract - The tokens contract address
-- burnAddress - The burn address from the token
-- contractBurn - Fixed amount burned from the contract

**coingecko.json**
-- coinID - CoinGeckos internal ID for a token (eg. poodle)
-- vsCurrency - Currency to compare the token agains (eg. usd)

**covalent.json**
covalentApiKey - You can get it by registering for the [CovalentHQ API](https://www.covalenthq.com/platform/#/auth/register/)
networkID - 56 for Binance Smart Chain
contract - The tokens contract address

**telegram.json**
-- telegramApiToken - Talk with the BotFather to get you API key