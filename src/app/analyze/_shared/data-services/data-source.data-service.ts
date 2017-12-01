import { Observable, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { DataSource, Field, AggregationFilter } from "@app/analyze/_shared/data-models";
import { BaseDataService, DataServiceConfig } from "@app/core/abstract";
import { MeasureOperator, AggregationMeasure, AggregationData, AggregationQuery, SimpleAggregationDimension, DateAggregationDimension, FieldType } from "@app/analyze/_shared/data-models";
import { HttpClient } from "@angular/common/http";
import { ObjectUtil } from '@app/core/utils';

@Injectable()
export class DataSourceDataService extends BaseDataService<DataSource>{
  constructor(config: DataServiceConfig, http: HttpClient) {
    super(config, http);
  }

  protected resourceName: string = 'dataSources';

  public getAll() {
    return super.getAll();
  }

  public getFields(dataSourceId: string): Observable<Field[]> {
    return this.httpGet(`${this.baseResourceUrl}/${dataSourceId}/fields`)
      .map((data: Field[]) => {
        return data.map(item => new Field(item.name, item.title, item.type));
      });
  }

  public getAggregationData(dataSourceId: string, dimensions: (SimpleAggregationDimension | DateAggregationDimension)[], measures: AggregationMeasure[], filters: AggregationFilter[]): Observable<AggregationData> {
    let aggregationQueryModel: AggregationQuery = {
      dataSourceId: dataSourceId,
      dimensions: dimensions,
      measures: measures,
      filters: filters
    };

    return this.httpPost(`${this.baseResourceUrl}:aggregate`, aggregationQueryModel)
      .map((data: AggregationData) => {
        return new AggregationData(data);
      });
  }
}

