import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {PriceProductYieldParam} from '../../../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';
import {PriceProductYieldAction} from '../../../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';

import {ThDateDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateIntervalDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {PriceProductYieldItemVM} from '../../../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';

import {YieldItemStateType} from '../../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/YieldItemStateDO';
import {YieldItemStateDO} from '../../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/YieldItemStateDO';
import {IYieldStateModel} from './IYieldStateModel';

import {YieldManagerDashboardPriceProductsService} from '../../../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';

@Component({
	selector: 'price-product-state',
	templateUrl: 'client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/components/price-product-state/template/price-product-state.html'
})
export class PriceProductStateComponent implements OnInit {
	@Input() model: IYieldStateModel; // State
	@Output() stateChanged = new EventEmitter();

	constructor(private _priceProduct: YieldManagerDashboardPriceProductsService) {
	}

	ngOnInit() {
	}

	public toggleOpenForArrival(){
		if (this.isOpenForArrival()){
			this.changeState(PriceProductYieldAction.CloseForArrival)
		}
		else {
			this.changeState(PriceProductYieldAction.OpenForArrival)
		}
	}

	public toggleOpen(){
		if (this.isOpen()){
			this.changeState(PriceProductYieldAction.Close)
		}
		else {
			this.changeState(PriceProductYieldAction.Open)
		}
	}

	public toggleOpenForDeparture(){
		if (this.isOpenForDeparture()){
			this.changeState(PriceProductYieldAction.CloseForDeparture)
		}
		else {
			this.changeState(PriceProductYieldAction.OpenForDeparture)
		}
		
	}

	public isOpenForArrival(){
		return this.isStateValueOpen(this.state.openForArrival);
	}

	public isOpen(){
		return this.isStateValueOpen(this.state.open);
	}

	public isOpenForDeparture(){
		return this.isStateValueOpen(this.state.openForDeparture);
	}

	private isStateValueOpen(stateValue: YieldItemStateType){
		return (stateValue == YieldItemStateType.Open) ? true : false;
	}

	private changeState(actionType: PriceProductYieldAction){
		var interval = new ThDateIntervalDO();
		interval.start = this.model.date;
		interval.end = this.model.date;
		
		var yieldParams: PriceProductYieldParam = {
			priceProductIdList : [this.model.priceProduct.priceProductYieldItemDO.priceProductId],
			action: actionType,
			forever: false,
			interval : interval
		};
		this._priceProduct.yieldPriceProducts(yieldParams).subscribe(()=>{
			this.stateChanged.emit({});
		})
	}

	private get state():YieldItemStateDO{
		return this.model.priceProduct.priceProductYieldItemDO.stateList[this.model.stateIndex];
	}
	
}