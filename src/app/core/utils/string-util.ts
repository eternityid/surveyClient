export class StringUtil {
    public static isInt(value: string): boolean {
        if (value == null) return false;
        return (/^-?[0-9]\d*(\.\d+)?$/).test(value);
    }

    public static replaceUnderscoreProp(jsonString: string) {
        return jsonString.replace(/(\"_[a-z|A-Z]+\"\:\")/g, (subString: string) => {
            return '"' + subString.substr(2);
        });
    }
}