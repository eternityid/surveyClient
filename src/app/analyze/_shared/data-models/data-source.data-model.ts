import { BaseDataModel } from "@app/core/abstract";
import { DateUtil } from "@app/core/utils";


export class DataSource extends BaseDataModel {
    public title: string;
    public fields: Field[] | undefined;
}

export class Field {
    public static toFieldTypeValue(value: any, fieldType?: FieldType): number | Date | string | null {
        if (value == null) return null;

        if (fieldType == FieldType.Numeric) {
            let resultNumeric = parseFloat(value);
            return isNaN(resultNumeric) ? 0 : resultNumeric;
        }
        if (fieldType == FieldType.Date) {
            return DateUtil.parseDate(value);
        }
        return value;
    }

    public static isDimensionOnly(item: Field) {
        return !Field.canBeMeasure(item);
    }

    public static canBeDimension(item: Field) {
        return item.name != fieldNameResponseId;
    }

    public static canBeMeasure(item: Field) {
        return item.type == FieldType.Numeric;
    }

    constructor(name: string, title: { [index: string]: string }, type: FieldType) {
        this.name = name;
        this.title = title;
        this.type = type;
    }

    public name: string;
    public title: { [index: string]: string };
    public type: FieldType;

    public toString() {
        return `${this.name}`;
    }
}

export const FieldTypes = {
    String: 'String',
    Numeric: 'Numeric',
    Date: 'Date',
    StringArray: 'StringArray'
}

export enum FieldType {
    String = 'String',
    Numeric = 'Numeric',
    Date = 'Date',
    StringArray = 'StringArray'
}

export class FieldLegalValue {
    public title: { [index: string]: string };
    public value: string;
}

export const fieldNameResponseId = '_responseId';