import { fieldNameResponseId, Field, FieldType } from "./data-source.data-model";
import { DateUtil, ArrayUtil } from "@app/core/utils";

export enum MeasureOperator {
    Sum = "Sum",
    Average = "Average",
    Count = "Count",
    CountDistinct = "CountDistinct",
    Minimum = "Minimum",
    Maximum = "Maximum",
    Percentiles = "Percentiles",
    StandardDeviation = "StandardDeviation",
    Variance = "Variance"
}

export function getMeasureOperatorTranslateKey(operator: MeasureOperator | string) {
    switch (operator) {
        case MeasureOperator.Sum: return 'WORDS.SUM';
        case MeasureOperator.Average: return 'WORDS.AVERAGE';
        case MeasureOperator.Count: return 'WORDS.COUNT';
        case MeasureOperator.CountDistinct: return 'WORDS.COUNT_DISTINCT';
        case MeasureOperator.Minimum: return 'WORDS.MINIMUM';
        case MeasureOperator.Maximum: return 'WORDS.MAXIMUM';
        case MeasureOperator.Percentiles: return 'WORDS.PERCENTILE';
        case MeasureOperator.StandardDeviation: return 'WORDS.STANDARD_DEVIATION';
        case MeasureOperator.Variance: return 'WORDS.VARIANCE';

        default: return '';
    }
}

export class AggregationMeasure {
    public static defaultNotResponseIdOperator = MeasureOperator.Average;
    public static defaultResponseIdOperator = MeasureOperator.Count;
    public static responseIdOperators = [MeasureOperator.Count];
    public static notResponseIdOperators = [
        MeasureOperator.Sum,
        MeasureOperator.Average,
        MeasureOperator.Minimum,
        MeasureOperator.Maximum,
        MeasureOperator.StandardDeviation,
        MeasureOperator.Variance
    ];

    public static createByField(fieldValue: Field, notResponseIdFieldAvailableOperators?: MeasureOperator[]): AggregationMeasure | null {
        if (notResponseIdFieldAvailableOperators != undefined &&
            notResponseIdFieldAvailableOperators.length == 0 &&
            fieldValue.name != fieldNameResponseId) return null;

        if (fieldValue.name == fieldNameResponseId) {
            return new AggregationMeasure(fieldValue.name, AggregationMeasure.defaultResponseIdOperator);
        } else if (notResponseIdFieldAvailableOperators != undefined) {
            if (notResponseIdFieldAvailableOperators.length == 0) return null;

            let operator = notResponseIdFieldAvailableOperators.includes(AggregationMeasure.defaultNotResponseIdOperator)
                ? AggregationMeasure.defaultNotResponseIdOperator
                : notResponseIdFieldAvailableOperators[0];
            return new AggregationMeasure(fieldValue.name, operator);
        } else {
            return new AggregationMeasure(fieldValue.name, AggregationMeasure.defaultNotResponseIdOperator);
        }
    }

    constructor(fieldName: string, operator: MeasureOperator) {
        this.fieldName = fieldName;
        this.operator = operator;
    }
    fieldName: string;
    operator: MeasureOperator;

    public toString() {
        return `${this.fieldName}:${this.operator}`;
    }
}

export class AggregationData {
    public static maxDimensionLength = 2;
    public static maxMeasureLength = 20;
    public static maxMeasureLengthOnMaxDimensionLength = 1;

    public static isQueryDataValid(dimensions: (SimpleAggregationDimension | DateAggregationDimension)[], measures: AggregationMeasure[]) {
        let dimensionsLength = dimensions.length;
        let measuresLength = measures.length;
        if (dimensionsLength == 0 || measuresLength == 0 || dimensionsLength > AggregationData.maxDimensionLength || measuresLength > AggregationData.maxMeasureLength) return false;
        if (dimensionsLength == AggregationData.maxDimensionLength && measuresLength > 1) return false;
        return true;
    }

    constructor(data: AggregationData) {
        this.dataSourceId = data.dataSourceId;
        this.fieldAnswersDictionary = data.fieldAnswersDictionary;
        this.fieldsDictionary = data.fieldsDictionary;
        this.dimensions = data.dimensions.map(item => {
            if (item.type == AggregationDimensionType.Date) {
                let dateItem = <DateAggregationDimension>item;
                return new DateAggregationDimension(dateItem.fieldName, dateItem.interval);
            }
            return new SimpleAggregationDimension(item.fieldName);
        });
        this.measures = data.measures.map(item => new AggregationMeasure(item.fieldName, item.operator));
        this.filters = data.filters.map(item => new AggregationFilter(item.fieldName, item.type, item.value));
        this.documents = data.documents;
    }

    dataSourceId: string;
    fieldAnswersDictionary: Dictionary<Dictionary<Dictionary<string>>>;
    fieldsDictionary: Dictionary<Dictionary<string>>;
    dimensions: (SimpleAggregationDimension | DateAggregationDimension)[];
    measures: AggregationMeasure[];
    filters: AggregationFilter[];
    documents: Dictionary<string | number>[];
}

export enum AggregationFilterType {
    LessThan = "LessThan",
    LessThanOrEqualTo = "LessThanOrEqualTo",
    Equal = "Equal",
    NotEqual = "NotEqual",
    GreaterThanOrEqualTo = "GreaterThanOrEqualTo",
    GreaterThan = "GreaterThan",
    Between = "Between"
}

export const AggregationFilterTypes = {
    LessThan: AggregationFilterType.LessThan,
    LessThanOrEqualTo: AggregationFilterType.LessThanOrEqualTo,
    Equal: AggregationFilterType.Equal,
    NotEqual: AggregationFilterType.NotEqual,
    GreaterThanOrEqualTo: AggregationFilterType.GreaterThanOrEqualTo,
    GreaterThan: AggregationFilterType.GreaterThan,
    Between: AggregationFilterType.Between
}

export class AggregationFilter {
    public static createByField(field: Field) {
        switch (field.type) {
            case FieldType.String:
            case FieldType.StringArray:
                return new AggregationFilter(field.name, AggregationFilterType.NotEqual, AggregationFilter.getDefaultFilterValue(AggregationFilterType.NotEqual, field.type));
            default: {
                return new AggregationFilter(field.name, AggregationFilterType.GreaterThanOrEqualTo, AggregationFilter.getDefaultFilterValue(AggregationFilterType.GreaterThanOrEqualTo, field.type));
            }
        }
    }
    public static isValueValidForType(value: any, aggregationFilterType: AggregationFilterType, fieldType?: FieldType): boolean {
        if (fieldType != undefined) {
            switch (fieldType) {
                case FieldType.String:
                case FieldType.StringArray:
                    {
                        if (AggregationFilter.isSingleValue(aggregationFilterType)) {
                            return typeof value == "string";
                        } else {
                            return value instanceof Array && ArrayUtil.all(value, x => typeof x == "string");
                        }
                    }
                case FieldType.Numeric: {
                    if (AggregationFilter.isSingleValue(aggregationFilterType)) {
                        return typeof value == "number";
                    } else {
                        return value instanceof Array && ArrayUtil.all(value, x => typeof x == "number");
                    }
                }

                default: {
                    if (AggregationFilter.isSingleValue(aggregationFilterType)) {
                        return value instanceof Date;
                    } else {
                        return value instanceof Array && ArrayUtil.all(value, x => x instanceof Date);
                    }
                }
            }
        } else {
            if (AggregationFilter.isSingleValue(aggregationFilterType))
                return !(value instanceof Array);
            return value instanceof Array;
        }
    }

    public static getDefaultFilterValue(aggregationFilterType: AggregationFilterType, fieldType?: FieldType, previousFilterValue?: any): string | number | Date | string[] | number[] | Date[] {
        let tenYearsBefore = new Date(DateUtil.moment(new Date()).year() - 10, 1, 1);
        let defaultBetweenNumericFilterValue = [0, 10];
        let defaultBetweenDateFilterValue = [tenYearsBefore, new Date()];

        if (fieldType != null) {
            switch (fieldType) {
                case FieldType.String:
                case FieldType.StringArray:
                    {
                        if (AggregationFilter.isSingleValue(aggregationFilterType))
                            return "";
                        return [];
                    }
                case FieldType.Numeric: {
                    if (AggregationFilter.isSingleValue(aggregationFilterType))
                        return 0;
                    if (aggregationFilterType == AggregationFilterType.Between)
                        return defaultBetweenNumericFilterValue;
                    return [];
                }

                default: {
                    if (AggregationFilter.isSingleValue(aggregationFilterType))
                        return tenYearsBefore
                    if (aggregationFilterType == AggregationFilterType.Between)
                        return defaultBetweenDateFilterValue;
                    return [];
                }
            }
        } else if (previousFilterValue != null) {
            let previousFilterSingleExampleValue = previousFilterValue instanceof Array && previousFilterValue.length > 0 ? previousFilterValue[0] : previousFilterValue;
            if (AggregationFilter.isSingleValue(aggregationFilterType)) {
                switch (typeof previousFilterSingleExampleValue) {
                    case "string": return "";
                    case "number": return 0;
                    default: return tenYearsBefore;
                }
            }
            if (aggregationFilterType == AggregationFilterType.Between) {
                switch (typeof previousFilterSingleExampleValue) {
                    case "string": return [];
                    case "number": return defaultBetweenNumericFilterValue;
                    default: return defaultBetweenDateFilterValue;
                }
            }
            return [];
        }

        return AggregationFilter.isSingleValue(aggregationFilterType) ? "" : [];
    }

    public static getAvailableFilterTypes(item: Field): AggregationFilterType[] {
        switch (item.type) {
            case FieldType.String:
            case FieldType.StringArray:
                return [
                    AggregationFilterType.Equal,
                    AggregationFilterType.NotEqual
                ];

            default:
                return [
                    AggregationFilterType.Equal,
                    AggregationFilterType.NotEqual,
                    AggregationFilterType.LessThan,
                    AggregationFilterType.LessThanOrEqualTo,
                    AggregationFilterType.GreaterThan,
                    AggregationFilterType.GreaterThanOrEqualTo,
                    AggregationFilterType.Between
                ];
        }
    }

    public static isSingleValue(type: AggregationFilterType) {
        switch (type) {
            case AggregationFilterType.Equal:
            case AggregationFilterType.NotEqual:
            case AggregationFilterType.GreaterThan:
            case AggregationFilterType.GreaterThanOrEqualTo:
            case AggregationFilterType.LessThan:
            case AggregationFilterType.LessThanOrEqualTo:
                return true;

            default:
                return false;
        }
    }

    constructor(fieldName: string, type: AggregationFilterType, value: string | number | Date | (string | null)[] | number[] | (Date | null)[] | null) {
        this.fieldName = fieldName;
        this.type = type;
        this.value = value;
    }

    public fieldName: string;
    private _type: AggregationFilterType;
    public get type(): AggregationFilterType {
        return this._type;
    }
    public set type(value) {
        this._type = value;
        if (!AggregationFilter.isValueValidForType(this.value, this.type)) {
            this.value = AggregationFilter.getDefaultFilterValue(this.type, undefined, this.value);
        }
    }
    public value: string | number | Date | (string | null)[] | number[] | (Date | null)[] | null;
    public get isValid(): boolean {
        return AggregationFilter.isValueValidForType(this.value, this.type);
    }

    public toString() {
        return this.fieldName;
    }

    public isSingleValue() {
        return AggregationFilter.isSingleValue(this._type);
    }
}

export class AggregationQuery {
    dataSourceId: string;
    dimensions: (SimpleAggregationDimension | DateAggregationDimension)[];
    measures: AggregationMeasure[];
    filters: AggregationFilter[];
}

export abstract class AggregationDimension {
    public static createAggregationDimension(fieldValue: Field, dateAggregationDimensionInterval?: DateAggregationDimensionInterval): SimpleAggregationDimension | DateAggregationDimension {
        if (fieldValue.type == FieldType.Date) return new DateAggregationDimension(fieldValue.name, dateAggregationDimensionInterval);
        return new SimpleAggregationDimension(fieldValue.name);
    }

    public type: AggregationDimensionType;
    public fieldName: string;
}

export class SimpleAggregationDimension extends AggregationDimension {
    constructor(fieldName: string) {
        super();
        this.type = AggregationDimensionType.Simple;
        this.fieldName = fieldName;
    }

    public toString() {
        return `${this.fieldName}:${this.type}`;
    }
}

export enum DateAggregationDimensionInterval {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Quarter = 'Quarter',
    Year = 'Year'
}

export function getDateDimensionIntervalTranslateKey(interval: DateAggregationDimensionInterval) {
    switch (interval) {
        case DateAggregationDimensionInterval.Day: return 'WORDS.DAY';
        case DateAggregationDimensionInterval.Week: return 'WORDS.WEEK';
        case DateAggregationDimensionInterval.Month: return 'WORDS.MONTH';
        case DateAggregationDimensionInterval.Year: return 'WORDS.YEAR';
        case DateAggregationDimensionInterval.Quarter: return 'WORDS.QUARTER';

        default: return '';
    }
}

export class DateAggregationDimension extends AggregationDimension {
    public static defaultInterval = DateAggregationDimensionInterval.Month;

    constructor(fieldName: string, interval?: DateAggregationDimensionInterval) {
        super();
        this.type = AggregationDimensionType.Date;
        this.fieldName = fieldName;
        this.interval = interval ? interval : DateAggregationDimension.defaultInterval;
    }

    public interval: DateAggregationDimensionInterval;
    public toString() {
        return `${this.fieldName}:${this.type}:${this.interval}`;
    }
}

export enum AggregationDimensionType {
    Simple = "Simple",
    Date = "Date"
}