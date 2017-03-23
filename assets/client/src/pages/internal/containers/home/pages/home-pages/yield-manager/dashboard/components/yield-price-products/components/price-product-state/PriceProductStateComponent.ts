import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AppContext } from '../../../../../../../../../../../../common/utils/AppContext';

import { PriceProductYieldParam, PriceProductYieldAction } from '../../../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';

import { ThDateDO } from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { ThDateIntervalDO } from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import { PriceProductYieldItemVM } from '../../../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';

import { YieldItemStateType } from '../../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/YieldItemStateDO';
import { YieldItemStateDO } from '../../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/YieldItemStateDO';
import { IYieldStateModel } from './IYieldStateModel';

import { YieldManagerDashboardPriceProductsService } from '../../../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';

@Component({
	selector: 'price-product-state',
	templateUrl: 'client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/components/price-product-state/template/price-product-state.html'
})
export class PriceProductStateComponent {
	@Input() model: IYieldStateModel; // State
	@Output() stateChanged = new EventEmitter();

	constructor(private _appContext: AppContext,
		private _yieldPriceProductService: YieldManagerDashboardPriceProductsService) {
	}

	public toggleOpenForArrival() {
		if (this.isOpenForArrival()) {
			this.changeState(PriceProductYieldAction.CloseForArrival)
		}
		else {
			this.changeState(PriceProductYieldAction.OpenForArrival)
		}
	}

	public toggleOpen() {
		if (this.isOpen()) {
			this.changeState(PriceProductYieldAction.Close)
		}
		else {
			this.changeState(PriceProductYieldAction.Open)
		}
	}

	public toggleOpenForDeparture() {
		if (this.isOpenForDeparture()) {
			this.changeState(PriceProductYieldAction.CloseForDeparture)
		}
		else {
			this.changeState(PriceProductYieldAction.OpenForDeparture)
		}

	}

	public isOpenForArrival() {
		return this.isStateValueOpen(this.state.openForArrival);
	}

	public isOpen() {
		return this.isStateValueOpen(this.state.open);
	}

	public isOpenForDeparture() {
		return this.isStateValueOpen(this.state.openForDeparture);
	}

	private isStateValueOpen(stateValue: YieldItemStateType) {
		return (stateValue == YieldItemStateType.Open) ? true : false;
	}

	private get arrivalTitle(): string {
		if (this.state.openForArrival === YieldItemStateType.Open) {
			return this._appContext.thTranslation.translate("%priceProduct% is open for arrival on %date%. Click here to close for arrival.", this.getTitleParams());
		}
		return this._appContext.thTranslation.translate("%priceProduct% is closed for arrival on %date%. Click here to open for arrival.", this.getTitleParams());
	}
	private get stayTitle(): string {
		if (this.state.open === YieldItemStateType.Open) {
			return this._appContext.thTranslation.translate("%priceProduct% is open on %date%. Click here to close.", this.getTitleParams());
		}
		return this._appContext.thTranslation.translate("%priceProduct% is closed on %date%. Click here to open.", this.getTitleParams());
	}
	private get departureTitle(): string {
		if (this.state.openForDeparture === YieldItemStateType.Open) {
			return this._appContext.thTranslation.translate("%priceProduct% is open for departure on %date%. Click here to close for departure.", this.getTitleParams());
		}
		return this._appContext.thTranslation.translate("%priceProduct% is closed for departure on %date%. Click here to open for departure.", this.getTitleParams());
	}
	private getTitleParams(): Object {
		return {
			priceProduct: this.model.priceProduct.name,
			date: this.model.date.toString()
		};
	}

	private changeState(actionType: PriceProductYieldAction) {
		if (this.model.priceProduct.lastRoomAvailability) {
			let message = this._appContext.thTranslation.translate("%priceProduct% cannot be yielded because it has the last room availability flag enabled", {
				priceProduct: this.model.priceProduct.name
			});
			this._appContext.toaster.info(message);
			return;
		}

		var interval = new ThDateIntervalDO();
		interval.start = this.model.date;
		interval.end = this.model.date;

		var yieldParams: PriceProductYieldParam = {
			priceProductIdList: [this.model.priceProduct.priceProductYieldItemDO.priceProductId],
			action: actionType,
			forever: false,
			interval: interval
		};

		this._yieldPriceProductService.yieldPriceProducts(yieldParams).subscribe(() => {
			this.logAnalyticsEvent(yieldParams);
			this.stateChanged.emit({});
		})
	}
	private logAnalyticsEvent(yieldParams: PriceProductYieldParam) {
		var eventDescription = "Yielded a Price Product for day " + yieldParams.interval.start.toString() + " with: " + PriceProductYieldAction[yieldParams.action];
		this._appContext.analytics.logEvent("yield-manager", "yield-single-price-product", eventDescription);
	}

	private get state(): YieldItemStateDO {
		return this.model.priceProduct.priceProductYieldItemDO.stateList[this.model.stateIndex];
	}

}