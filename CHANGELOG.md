# POODL Price Bot - Changelog

### v1.0.0
- add CoinGecko price (per 1M tokens) + command /price
- add CoinGecko price history chart (past 24 hours) + command /chart
- add current holders
- add marcet cap (based on CoinGecko price)
- add circulating supply

### v1.1.0
- add Holders chart for last 3 month
- add note in case holders API does not work
- add note in case one of the charts is not working
- fix price showing 0 value when coingecko response is bad
- performance boost
- split API refreshes into live / 5 seconds / 30 minutes to reduce API calls