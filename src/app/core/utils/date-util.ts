import * as moment from 'moment';
import { StringUtil } from './string-util';

export class DateUtil {
    public static format(value: string | number | Date, format: string = 'DD/MM/YYYY'): string {
        return DateUtil.moment(value).format(format);
    }

    public static parseDate(value: string | number | Date): Date {
        if (value instanceof Date) return value;
        return DateUtil.moment(value).toDate();
    }

    public static addMonth(value: string | number | Date, monthValue: number): Date {
        return DateUtil.moment(value).add(monthValue, "month").toDate();
    }

    public static moment(value: string | number | Date): moment.Moment {
        if (typeof (value) == 'string' && StringUtil.isInt(value)) {
            value = parseInt(value);
        }
        return moment(value);
    }
}