import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {TaxListModalService} from '../../../../../../basic-info/payments-policies/modal/services/TaxListModalService';
import {TaxService} from '../../../../../../../../services/taxes/TaxService';
import {TaxContainerDO} from '../../../../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxDO, TaxType} from '../../../../../../../../services/taxes/data-objects/TaxDO';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';

import * as _ from "underscore";

@Component({
	selector: 'price-product-edit-taxes-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/taxes/template/price-product-edit-taxes-section.html',
	providers: [TaxListModalService]
})
export class PriceProductEditTaxesSectionComponent extends BaseComponent implements OnInit, IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	ccy: CurrencyDO;
	noVatTaxId: string = "-1";
	vatTaxList: TaxDO[];

	vatTaxId: string;
	otherTaxList: TaxDO[];

	constructor(private _taxListModalService: TaxListModalService, private _taxService: TaxService) {
		super();
	}
	public ngOnInit() {
		this._taxService.getTaxContainerDO().subscribe((taxContainer: TaxContainerDO) => {
			this.vatTaxList = taxContainer.vatList;
		});
	}

	public isValid(): boolean {
		return true;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this.vatTaxId = this.noVatTaxId;
		if (priceProductVM.vatTax) {
			this.vatTaxId = priceProductVM.vatTax.id;
		}
		this.otherTaxList = [];
		if (priceProductVM.otherTaxList && priceProductVM.otherTaxList.length > 0) {
			this.otherTaxList = priceProductVM.otherTaxList;
		}
		this.ccy = priceProductVM.ccy;
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.taxIdList = [];
		if (this.vatTaxId && this.vatTaxId !== this.noVatTaxId) {
			priceProductVM.vatTax = _.find(this.vatTaxList, (tax: TaxDO) => { return tax.id === this.vatTaxId });
			priceProductVM.priceProduct.taxIdList.push(this.vatTaxId);
		}
		priceProductVM.otherTaxList = this.otherTaxList;
		priceProductVM.priceProduct.taxIdList = priceProductVM.priceProduct.taxIdList.concat(_.map(this.otherTaxList, (tax: TaxDO) => { return tax.id }));
	}

	public didSelectVatTaxId(vatTaxId: string) {
		this.vatTaxId = vatTaxId;
	}
	public openOtherTaxSelectModal() {
		this._taxListModalService.openTaxListModal(TaxType.OtherTax).then((modalDialogInstance: ModalDialogRef<TaxDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedTaxList: TaxDO[]) => {
				_.forEach(selectedTaxList, (selectedTax: TaxDO) => {
					this.addOtherTaxIfNotExists(selectedTax);
				});
			});
		}).catch((e: any) => { });
	}
	private addOtherTaxIfNotExists(taxToAdd: TaxDO) {
		var foundOtherTax = _.find(this.otherTaxList, (tax: TaxDO) => { return tax.id === taxToAdd.id });
		if (!foundOtherTax) {
			this.otherTaxList.push(taxToAdd);
		}
	}
	public removeOtherTax(tax: TaxDO) {
		this.otherTaxList = _.filter(this.otherTaxList, (innerTax: TaxDO) => { return innerTax.id !== tax.id });
	}
}