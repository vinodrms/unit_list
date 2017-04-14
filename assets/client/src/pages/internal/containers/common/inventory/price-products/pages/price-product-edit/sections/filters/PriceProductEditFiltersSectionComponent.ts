import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductYieldFilterMetaDO} from '../../../../../../../../services/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import {YieldFilterValueVM} from '../../../../../../../../services/price-products/view-models/YieldFilterValueVM';
import {YieldFilterModalService} from '../../../../../modals/yield-filter/services/YieldFilterModalService';
import {YieldFilterDO} from '../../../../../../../../services/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../../../../../../services/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFiltersService} from '../../../../../../../../services/hotel-configurations/YieldFiltersService';
import {YieldFiltersDO} from '../../../../../../../../services/hotel-configurations/data-objects/YieldFiltersDO';

@Component({
	selector: 'price-product-edit-filters-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/filters/template/price-product-edit-filters-section.html',
	providers: [YieldFilterModalService]
})
export class PriceProductEditFiltersSectionComponent extends BaseComponent implements OnInit, IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	yieldFiltersDO: YieldFiltersDO = new YieldFiltersDO();
	didInit: boolean = false;

	private _priceProductYieldFilterMetaList: PriceProductYieldFilterMetaDO[];
	yieldFilterVMValues: YieldFilterValueVM[];

	constructor(private _yieldFiltersService: YieldFiltersService,
		private _yieldFilterModalService: YieldFilterModalService) {
		super();
	}
	public ngOnInit() {
		this._yieldFiltersService.getYieldFiltersDO()
			.map((yieldFiltersDO: YieldFiltersDO) => {
				yieldFiltersDO.yieldFilterList = _.sortBy(yieldFiltersDO.yieldFilterList, (yieldFiler: YieldFilterDO) => {
					return yieldFiler.label;
				});
				return yieldFiltersDO;
			})
			.subscribe((yieldFiltersDO: YieldFiltersDO) => {
				this.yieldFiltersDO = yieldFiltersDO;
				this.updateYieldFilterVMValues();
			});
	}
	private updateYieldFilterVMValues() {
		if (!this.yieldFiltersDO || !this._priceProductYieldFilterMetaList) {
			return;
		}
		this.yieldFilterVMValues = YieldFilterValueVM.buildYieldFilterValueVMList(this.yieldFiltersDO, this._priceProductYieldFilterMetaList);
		this.didInit = true;
	}

	public isValid(): boolean {
		return true;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this.didInit = false;
		this._priceProductYieldFilterMetaList = [];
		if (priceProductVM.priceProduct.yieldFilterList && priceProductVM.priceProduct.yieldFilterList.length > 0) {
			this._priceProductYieldFilterMetaList = this._priceProductYieldFilterMetaList.concat(priceProductVM.priceProduct.yieldFilterList);
		}
		this.updateYieldFilterVMValues();
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.yieldFilterList = this._priceProductYieldFilterMetaList;
		priceProductVM.yieldFilterVMValues = this.yieldFilterVMValues;
	}

	public openSelectFilterModalFor(filterId: string) {
		var yieldFilter: YieldFilterDO = this.yieldFiltersDO.getYieldFilterByFilterId(filterId);
		if (!yieldFilter) {
			return;
		}
		this._yieldFilterModalService.openYieldFilterModal(this._yieldFiltersService, yieldFilter)
			.then((modalDialogRef: ModalDialogRef<YieldFilterValueDO>) => {
				modalDialogRef.resultObservable.subscribe((selectedYFValue: YieldFilterValueDO) => {
					this.didSelectFilterValue(filterId, selectedYFValue);
				})
			}).catch((e: any) => { });
	}
	private didSelectFilterValue(filterId: string, filterValue: YieldFilterValueDO) {
		this._priceProductYieldFilterMetaList = this._priceProductYieldFilterMetaList.filter((meta: PriceProductYieldFilterMetaDO) => { return meta.filterId !== filterId });
		var newMeta = new PriceProductYieldFilterMetaDO();
		newMeta.filterId = filterId;
		newMeta.valueId = filterValue.id;
		this._priceProductYieldFilterMetaList.push(newMeta);
		this.updateYieldFilterVMValues();
	}

    private removeFilter(filterId: string) {
        var yieldFilter: YieldFilterDO = this.yieldFiltersDO.getYieldFilterByFilterId(filterId);
		if (!yieldFilter) {
			return;
		}
        this._priceProductYieldFilterMetaList = this._priceProductYieldFilterMetaList.filter((meta: PriceProductYieldFilterMetaDO) => {
            return meta.filterId != filterId;
        });
        this.updateYieldFilterVMValues();
    }
}