import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import { ARequestService } from '../../../common/ARequestService';
import { AppContext, ThServerApi } from '../../../../../../common/utils/AppContext';
import { PriceProductYieldFilterMetaDO } from '../../../price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import { PriceProductDO } from '../../../price-products/data-objects/PriceProductDO';
import { PriceProductsDO } from '../../../price-products/data-objects/PriceProductsDO';
import { YieldManagerDashboardFilterService } from '../filter/YieldManagerDashboardFilterService';
import { FilterVMCollection } from '../filter/utils/FilterVMCollection';
import { ColorFilterVM } from '../filter/view-models/ColorFilterVM';
import { TextFilterVM } from '../filter/view-models/TextFilterVM';
import { IFilterVM } from '../filter/view-models/IFilterVM';
import { YieldManagerPeriodParam } from '../common/YieldManagerPeriodParam';
import { PriceProductYieldParam } from '../common/PriceProductYieldParam';
import { PriceProductYieldResultVM } from './view-models/PriceProductYieldResultVM';
import { PriceProductYieldItemVM } from './view-models/PriceProductYieldItemVM';
import { PriceProductYieldResultDO } from './data-objects/PriceProductYieldResultDO';
import { PriceProductYieldItemDO } from './data-objects/PriceProductYieldItemDO';
import { ThDateIntervalDO } from "../../../common/data-objects/th-dates/ThDateIntervalDO";
import { DynamicPriceYieldParam } from "../common/DynamicPriceYieldParam";

import * as _ from 'underscore';

@Injectable()
export class YieldManagerDashboardPriceProductsService extends ARequestService<PriceProductYieldResultVM> {
    private _yieldManagerPeriodParam: YieldManagerPeriodParam;

    constructor(private _appContext: AppContext,
        private _dashboardFilterService: YieldManagerDashboardFilterService) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this._dashboardFilterService.getColorFilterCollections(),
            this._dashboardFilterService.getTextFilterCollections(),
            this._appContext.thHttp.post({
                serverApi: ThServerApi.YieldManagerYieldGetPriceProductItems,
                parameters: {
                    yieldParams: this._yieldManagerPeriodParam
                }
            })
        ).map((result: [FilterVMCollection<ColorFilterVM>[], FilterVMCollection<TextFilterVM>[], Object]) => {
            var yieldResultObject = result[2];
            var yieldResult: PriceProductYieldResultDO = new PriceProductYieldResultDO();
            yieldResult.buildFromObject(yieldResultObject["yieldResult"]);
            return this.convert(result[0], result[1], yieldResult);
        });
    }
    private convert(colorFilterCollectionList: FilterVMCollection<ColorFilterVM>[],
        textFilterCollectionList: FilterVMCollection<TextFilterVM>[],
        priceProductYieldResultDO: PriceProductYieldResultDO): PriceProductYieldResultVM {

        var priceProductYieldResultVM = new PriceProductYieldResultVM();
        priceProductYieldResultVM.dateList = priceProductYieldResultDO.dateList;
        priceProductYieldResultVM.priceProductYieldItemVM = [];
        _.forEach(priceProductYieldResultDO.itemList, (priceProductYieldItem: PriceProductYieldItemDO) => {
            var priceProductYieldItemVM = new PriceProductYieldItemVM();
            priceProductYieldItemVM.priceProductYieldItemDO = priceProductYieldItem;
            _.forEach(priceProductYieldItem.yieldFilterList, (filterMeta: PriceProductYieldFilterMetaDO) => {
                priceProductYieldItemVM.colorFilterList = priceProductYieldItemVM.colorFilterList.concat(<ColorFilterVM[]>this.getFilterList(colorFilterCollectionList, filterMeta));
                priceProductYieldItemVM.textFilterList = priceProductYieldItemVM.textFilterList.concat(<TextFilterVM[]>this.getFilterList(textFilterCollectionList, filterMeta));
            });
            priceProductYieldResultVM.priceProductYieldItemVM.push(priceProductYieldItemVM);
        });

        return priceProductYieldResultVM;
    }
    private getFilterList(filterCollectionList: FilterVMCollection<IFilterVM>[], filterMeta: PriceProductYieldFilterMetaDO): IFilterVM[] {
        var filterList: IFilterVM[] = [];
        _.forEach(filterCollectionList, (filterCollection: FilterVMCollection<IFilterVM>) => {
            var foundFilter: IFilterVM = filterCollection.getFilterVM(filterMeta.filterId, filterMeta.valueId);
            if (!this._appContext.thUtils.isUndefinedOrNull(foundFilter)) {
                filterList.push(foundFilter);
            }
        });
        return filterList;
    }

    protected parseResult(result: Object): PriceProductYieldResultVM {
        return <PriceProductYieldResultVM>result;
    }

    public getPriceProducts(yieldManagerPeriodParam: YieldManagerPeriodParam): Observable<PriceProductYieldResultVM> {
        this._yieldManagerPeriodParam = yieldManagerPeriodParam;
        return this.getServiceObservable();
    }
    public refresh(yieldManagerPeriodParam: YieldManagerPeriodParam) {
        this._yieldManagerPeriodParam = yieldManagerPeriodParam;
        this.updateServiceResult();
    }
    public yieldPriceProducts(yieldParam: PriceProductYieldParam): Observable<PriceProductsDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.YieldManagerYieldPriceProducts,
            parameters: {
                yieldData: yieldParam
            }
        }).map((priceProductsObject: Object) => {
            var priceProducts = new PriceProductsDO();
            priceProducts.buildFromObject(priceProductsObject);
            return priceProducts;
        });
    }
    public openDynamicPrice(yieldParam: DynamicPriceYieldParam): Observable<PriceProductDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.YieldManagerOpenDynamicPrice,
            parameters: { yieldData: yieldParam }
        }).map((priceProductObject: Object) => {
            var priceProduct = new PriceProductDO();
            priceProduct.buildFromObject(priceProductObject);
            return priceProduct;
        });
    }
}