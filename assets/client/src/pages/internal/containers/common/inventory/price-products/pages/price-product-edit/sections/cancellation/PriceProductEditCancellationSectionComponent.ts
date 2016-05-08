import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThHourPipe} from '../../../../../../../../../../common/utils/pipes/ThHourPipe';
import {ThHourSelectComponent} from '../../../../../../../../../../common/utils/components/th-hour-select/ThHourSelectComponent';
import {PercentageInputNumberComponent} from '../../../../../../../../../../common/utils/components/PercentageInputNumberComponent';
import {ThHourDO} from '../../../../../../../../services/common/data-objects/th-dates/ThHourDO';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {IPriceProductCancellationPolicy, CancellationPolicyMeta, PriceProductCancellationPolicyType} from '../../../../../../../../services/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPolicyFactory} from '../../../../../../../../services/price-products/data-objects/conditions/cancellation/PriceProductCancellationPolicyFactory';
import {CanCancelBeforeTimeOnDayOfArrivalPolicyDO} from '../../../../../../../../services/price-products/data-objects/conditions/cancellation/CanCancelBeforeTimeOnDayOfArrivalPolicyDO';
import {CanCancelDaysBeforePolicyDO} from '../../../../../../../../services/price-products/data-objects/conditions/cancellation/CanCancelDaysBeforePolicyDO';
import {PriceProductConditionsDO} from '../../../../../../../../services/price-products/data-objects/conditions/PriceProductConditionsDO';
import {IPriceProductCancellationPenalty, CancellationPenaltyMeta, PriceProductCancellationPenaltyType} from '../../../../../../../../services/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import {PercentageFromBookingCancellationPenaltyDO} from '../../../../../../../../services/price-products/data-objects/conditions/penalty/PercentageFromBookingCancellationPenaltyDO';
import {PriceProductCancellationPenaltyFactory} from '../../../../../../../../services/price-products/data-objects/conditions/penalty/PriceProductCancellationPenaltyFactory';

@Component({
	selector: 'price-product-edit-cancellation-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/cancellation/template/price-product-edit-cancellation-section.html',
	pipes: [TranslationPipe, ThHourPipe],
	directives: [ThHourSelectComponent, PercentageInputNumberComponent]
})
export class PriceProductEditCancellationSectionComponent extends BaseComponent implements IPriceProductEditSection {
	cancellationHour: ThHourDO;
	
	readonly: boolean;
	@Input() didSubmit: boolean;

	cancellationPolicyMetaList: CancellationPolicyMeta[];
	private _cancellationPolicyFactory: PriceProductCancellationPolicyFactory;

	private _cancellationPenaltyMetaList: CancellationPenaltyMeta[];
	filteredCancellationPenaltyMetaList: CancellationPenaltyMeta[];
	private _cancellationPenaltyFactory: PriceProductCancellationPenaltyFactory;

	didInit: boolean = false;
	conditions: PriceProductConditionsDO;

	constructor() {
		super();
		this._cancellationPolicyFactory = new PriceProductCancellationPolicyFactory();
		this.cancellationPolicyMetaList = this._cancellationPolicyFactory.getCancellationPolicyMetaList();
		this._cancellationPenaltyFactory = new PriceProductCancellationPenaltyFactory();
		this._cancellationPenaltyMetaList = this._cancellationPenaltyFactory.getCancellationPenaltyMetaList();
	}

	public isValid(): boolean {
		return this.conditions.isValid();
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		if (!priceProductVM.priceProduct.conditions) {
			this.conditions = PriceProductConditionsDO.buildDefault();
		}
		else {
			this.conditions = priceProductVM.priceProduct.conditions.prototypeConditions();
		}
		this.filterCancellationPolicies();
		this.didInit = true;
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.conditions = this.conditions;
	}

	public didChangePolicyType(policyTypeStr: string) {
		var policyType: PriceProductCancellationPolicyType = parseInt(policyTypeStr);
		if (policyType === this.conditions.policyType) {
			return;
		}
		this.conditions.policy = this._cancellationPolicyFactory.getCancellationPolicyByPolicyType(policyType);
		this.conditions.policyType = policyType;

		this.updatePenaltyUsingCurrentPolicy();
		this.filterCancellationPolicies();
	}
	private updatePenaltyUsingCurrentPolicy() {
		if (!this.conditions.policy.hasCancellationPolicy() && this.conditions.penalty.hasCancellationPenalty()) {
			var newPenalty = this._cancellationPenaltyFactory.getDefaultPenaltyWithoutConditions();
			this.conditions.penalty = newPenalty.penalty;
			this.conditions.penaltyType = newPenalty.penaltyType;
		}
		else if (this.conditions.policy.hasCancellationPolicy() && !this.conditions.penalty.hasCancellationPenalty()) {
			var newPenalty = this._cancellationPenaltyFactory.getDefaultPenaltyWithConditions();
			this.conditions.penalty = newPenalty.penalty;
			this.conditions.penaltyType = newPenalty.penaltyType;
		}
	}
	public filterCancellationPolicies() {
		this.filteredCancellationPenaltyMetaList = _.filter(this._cancellationPenaltyMetaList, (meta: CancellationPenaltyMeta) => { return _.contains(meta.usedWithPolicyTypeList, this.conditions.policyType) });
	}


	public isCancelBeforeTimeOnDayOfArrivalPolicy(): boolean {
		return this.conditions.policyType === PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival;
	}
	public diChangeTimeOnDayOfArrival(thHour: ThHourDO) {
		if (!this.isCancelBeforeTimeOnDayOfArrivalPolicy()) { return };
		(<CanCancelBeforeTimeOnDayOfArrivalPolicyDO>this.conditions.policy).timeOfArrival = thHour;
	}
	public isCanCancelDaysBeforePolicy(): boolean {
		return this.conditions.policyType === PriceProductCancellationPolicyType.CanCancelDaysBefore;
	}

	public didChangePenaltyType(penaltyTypeStr: string) {
		var penaltyType: PriceProductCancellationPenaltyType = parseInt(penaltyTypeStr);
		if (penaltyType === this.conditions.penaltyType) {
			return;
		}
		this.conditions.penaltyType = penaltyType;
		this.conditions.penalty = this._cancellationPenaltyFactory.getCancellationPenaltyByPenaltyType(penaltyType);
	}

	public isPercentageFromBookingCancellationPenalty(): boolean {
		return this.conditions.penaltyType === PriceProductCancellationPenaltyType.PercentageFromBooking;
	}
	public didSetPercentageFromBooking(percentageFromBooking: number) {
		if (this.isPercentageFromBookingCancellationPenalty()) {
			(<PercentageFromBookingCancellationPenaltyDO>this.conditions.penalty).percentage = percentageFromBooking;
			if (percentageFromBooking == null) {
				delete (<PercentageFromBookingCancellationPenaltyDO>this.conditions.penalty).percentage;
			}
		}
	}
}