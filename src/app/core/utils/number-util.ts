export class NumberUtil {
    public static round(value: number, factionDigits: number = 0) {
        let floatPointMovingValue = Math.pow(10, factionDigits) * 1.0;
        return Math.round(value * floatPointMovingValue) / floatPointMovingValue;
    }
}