import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';
import {AddOnProductDO} from '../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {TotalCountDO} from '../../../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {InventoryScreenStateType} from '../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {AddOnProductsTotalCountService} from '../../../../../../../services/add-on-products/AddOnProductsTotalCountService';

@Component({
    selector: 'settings-breakfast',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/breakfast/template/settings-breakfast.html',
    providers: [AddOnProductsTotalCountService]
})
export class SettingsBreakfastComponent extends BaseComponent implements OnInit, OnDestroy {
    private _totalNoSubscription: Subscription;
    constructor(private _navbarService: SettingsNavbarService,
        private _addOnProductsTotalCountService: AddOnProductsTotalCountService) {
        super();
        this._navbarService.bootstrap(SettingsPageType.Breakfast);
    }
    public ngOnInit() {
        this._totalNoSubscription = this._addOnProductsTotalCountService.getTotalCountDO({ filterBreakfastCategory: true }).subscribe((totalCount: TotalCountDO) => {
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
            this._addOnProductsTotalCountService.updateTotalCount();
        }
    }
    public didDeleteItem(deletedAddOnProduct: AddOnProductDO) {
        this._addOnProductsTotalCountService.updateTotalCount();
    }
}