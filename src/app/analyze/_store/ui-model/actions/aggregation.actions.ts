import { Action } from "@ngrx/store";
import { Field, DataSource, AggregationData, MeasureOperator, SimpleAggregationDimension, DateAggregationDimension, AggregationMeasure, DateAggregationDimensionInterval, AggregationFilter } from "@app/analyze/_shared/data-models";

export class Init_Aggregation implements Action {
    public static Type = 'Init_Aggregation [ui-model]';

    public type: string = Init_Aggregation.Type;
}

export class Destroy_Aggregation implements Action {
    public static Type = 'Destroy_Aggregation [ui-model]';

    public type: string = Destroy_Aggregation.Type;
}

export class SetDataSource_Aggregation implements Action {
    public static Type = 'SetDataSource_Aggregation [ui-model]';

    constructor(dataSource: DataSource | undefined) {
        this.dataSource = dataSource;
    }

    public type: string = SetDataSource_Aggregation.Type;
    public dataSource: DataSource | undefined;
}

export class LoadAggregationData_Aggregation implements Action {
    public static Type = 'LoadAggregationData_Aggregation [ui-model]';

    constructor(dataSourceId: string, dimensions: (SimpleAggregationDimension | DateAggregationDimension)[], measures: AggregationMeasure[], filters: AggregationFilter[]) {
        this.dataSourceId = dataSourceId;
        this.dimensions = dimensions;
        this.measures = measures;
        this.filters = filters;
    }

    public type: string = LoadAggregationData_Aggregation.Type;
    public dataSourceId: string;
    public dimensions: (SimpleAggregationDimension | DateAggregationDimension)[];
    public measures: AggregationMeasure[];
    public filters: AggregationFilter[];
}

export class LoadAggregationDataSuccess_Aggregation {
    public static Type = 'LoadAggregationDataSuccess_Aggregation [ui-model]';

    constructor(data: AggregationData) {
        this.data = data
    }

    public type: string = LoadAggregationDataSuccess_Aggregation.Type;
    public data: AggregationData;
}

export class LoadAggregationDataFail_Aggregation {
    public static Type = 'LoadAggregationDataFail_Aggregation [ui-model]';

    constructor(error: any) {
        this.error = error;
    }

    public type: string = LoadAggregationDataFail_Aggregation.Type;
    public error: string[];
}

export class UpdateMeasureOperator_Aggregation {
    public static Type = 'UpdateMeasureOperator_Aggregation [ui-model]';

    constructor(operator: MeasureOperator, measureField: AggregationMeasure) {
        this.operator = operator;
        this.measureField = measureField;
    }

    public type: string = UpdateMeasureOperator_Aggregation.Type;
    public operator: MeasureOperator;
    public measureField: AggregationMeasure
}

export class RemoveDimension_Aggregation implements Action {
    public static Type = 'RemoveDimension_Aggregation [ui-model]';

    constructor(item: (SimpleAggregationDimension | DateAggregationDimension)) {
        this.item = item;
    }

    public type: string = RemoveDimension_Aggregation.Type;
    public item: (SimpleAggregationDimension | DateAggregationDimension);
}

export class RemoveMeasure_Aggregation implements Action {
    public static Type = 'RemoveMeasure_Aggregation [ui-model]';

    constructor(item: AggregationMeasure) {
        this.item = item;
    }

    public type: string = RemoveMeasure_Aggregation.Type;
    public item: AggregationMeasure;
}


export class AddDimension_Aggregation implements Action {
    public static Type = 'AddDimension_Aggregation [ui-model]';

    constructor(field: Field) {
        this.field = field;
    }

    public type: string = AddDimension_Aggregation.Type;
    public field: Field;
}

export class AddMeasure_Aggregation implements Action {
    public static Type = 'AddMeasure_Aggregation [ui-model]';

    constructor(field: Field) {
        this.field = field;
    }

    public type: string = AddMeasure_Aggregation.Type;
    public field: Field;
}

export class UpdateQueryData_Aggregation implements Action {
    public static Type = 'UpdateQueryData_Aggregation [ui-model]';

    constructor(dimensions: (SimpleAggregationDimension | DateAggregationDimension)[], measures: AggregationMeasure[]) {
        this.dimensions = dimensions;
        this.measures = measures;
    }

    public type: string = UpdateQueryData_Aggregation.Type;
    public dimensions: (SimpleAggregationDimension | DateAggregationDimension)[];
    public measures: AggregationMeasure[];
}

export class UpdateDateDimensionInterval_Aggregation implements Action {
    public static Type = 'UpdateDateDimensionInterval_Aggregation [ui-model]';

    constructor(intervalValue: DateAggregationDimensionInterval, dimension: DateAggregationDimension) {
        this.intervalValue = intervalValue;
        this.dimension = dimension;
    }

    public type: string = UpdateDateDimensionInterval_Aggregation.Type;
    public intervalValue: DateAggregationDimensionInterval;
    public dimension: DateAggregationDimension;
}

export class AddFilter_Aggregation implements Action {
    public static Type = 'AddFilter_Aggregation [ui-model]';

    constructor(item: Field | AggregationFilter) {
        this.item = item;
    }

    public type: string = AddFilter_Aggregation.Type;
    public item: Field | AggregationFilter;
}

export class RemoveFilter_Aggregation implements Action {
    public static Type = 'RemoveFilter_Aggregation [ui-model]';

    constructor(item: AggregationFilter | Field) {
        this.item = item;
    }

    public type: string = RemoveFilter_Aggregation.Type;
    public item: AggregationFilter | Field;
}