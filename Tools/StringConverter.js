import moment from 'moment';
import 'moment-timezone';

export default class StringConverter {
    static roundXDecimals(number, count) {
        return number.toFixed(count);
    }

    static formatNumberInternational(number) {
        const format = new Intl.NumberFormat('en-US');

        return format.format(number);
    }

    static getElapsedSeconds(pastTimestamp) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return currentTimestamp - pastTimestamp;
    }

    static convertToTrillion(number) {
        const format = new Intl.NumberFormat('en-US');
        const trillions = number / 1000000000000
        return format.format(trillions.toFixed(1));
    }

    static calcMarketCap(price, supply) {
        const format = new Intl.NumberFormat('en-US');
        const mc = price * supply
        return format.format(Math.round(mc));
    }

    static getUTCTime(timeStamp) {
        const momentTime = moment(timeStamp);
        const utcMoment = momentTime.utcOffset('+0000');
        const utcDate = utcMoment.format('MMM Do - hh:mm');

        return utcDate;
    }
}