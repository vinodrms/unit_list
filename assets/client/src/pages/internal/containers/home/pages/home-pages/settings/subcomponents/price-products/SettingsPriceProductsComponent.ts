import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {PriceProductsComponent} from '../../../../../../common/inventory/price-products/main/PriceProductsComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';
import {PriceProductDO, PriceProductStatus} from '../../../../../../../services/price-products/data-objects/PriceProductDO';
import {TotalCountDO} from '../../../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {InventoryScreenStateType} from '../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {PriceProductsTotalCountService} from '../../../../../../../services/price-products/PriceProductsTotalCountService';

@Component({
	selector: 'settings-price-products',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/price-products/template/settings-price-products.html',
	providers: [PriceProductsTotalCountService],
	directives: [PriceProductsComponent],
	pipes: [TranslationPipe]
})
export class SettingsPriceProductsComponent extends BaseComponent implements OnInit, OnDestroy {
	private _totalNoSubscription: Subscription;

	constructor(private _navbarService: SettingsNavbarService,
		private _priceProductsTotalCountService: PriceProductsTotalCountService) {
		super();
		this._navbarService.bootstrap(SettingsPageType.PriceProducts);
	}
	public ngOnInit() {
		this._totalNoSubscription = this._priceProductsTotalCountService.getTotalCountDO(PriceProductStatus.Active).subscribe((totalCount: TotalCountDO) => {
			this._navbarService.numberOfItems = totalCount.numOfItems;
		});
	}
    public ngOnDestroy() {
        if (this._totalNoSubscription) {
            this._totalNoSubscription.unsubscribe();
        }
    }
	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
        if (screenStateType === InventoryScreenStateType.View) {
            this._priceProductsTotalCountService.updateTotalCount();
        }
	}
	public didDeleteItem(deletedPriceProduct: PriceProductDO) {
		this._priceProductsTotalCountService.updateTotalCount();
	}
}