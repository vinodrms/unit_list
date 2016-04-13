import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThHourSelectComponent} from '../../../../../../../../../../common/utils/components/th-hour-select/ThHourSelectComponent';
import {ThHourDO} from '../../../../../../../../services/common/data-objects/th-dates/ThHourDO';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {IPriceProductCancellationPolicy, CancellationPolicyMeta, PriceProductCancellationPolicyType} from '../../../../../../../../services/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPolicyFactory} from '../../../../../../../../services/price-products/data-objects/conditions/cancellation/PriceProductCancellationPolicyFactory';
import {PriceProductConditionsDO} from '../../../../../../../../services/price-products/data-objects/conditions/PriceProductConditionsDO';
import {IPriceProductCancellationPenalty, CancellationPenaltyMeta} from '../../../../../../../../services/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import {PriceProductCancellationPenaltyFactory} from '../../../../../../../../services/price-products/data-objects/conditions/penalty/PriceProductCancellationPenaltyFactory';

@Component({
	selector: 'price-product-edit-cancellation-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/cancellation/template/price-product-edit-cancellation-section.html',
	pipes: [TranslationPipe],
	directives: [ThHourSelectComponent]
})
export class PriceProductEditCancellationSectionComponent extends BaseComponent implements IPriceProductEditSection {
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
		return true;
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
		
		console.log(this.conditions);
		console.log(this.filteredCancellationPenaltyMetaList);
		
		// percentage
		// 
	}
	
	public isCancelBeforeTimeOnDayOfArrivalPolicy(): boolean {
		return this.conditions.policyType === PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival; 
	}
	public diChangeTimeOnDayOfArrival(thHour: ThHourDO) {
		console.log(thHour);
	}
}