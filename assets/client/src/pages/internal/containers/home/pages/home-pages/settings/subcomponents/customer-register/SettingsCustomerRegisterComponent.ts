import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {CustomerRegisterComponent} from '../../../../../../common/inventory/customer-register/main/CustomerRegisterComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';
import {InventoryScreenStateType} from '../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {CustomersTotalCountService} from '../../../../../../../services/customers/CustomersTotalCountService';
import {TotalCountDO} from '../../../../../../../services/common/data-objects/lazy-load/TotalCountDO';

@Component({
	selector: 'settings-customer-register',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/customer-register/template/settings-customer-register.html',
	providers: [CustomersTotalCountService],
	directives: [CustomerRegisterComponent],
	pipes: [TranslationPipe]
})
export class SettingsCustomerRegisterComponent extends BaseComponent implements OnInit, OnDestroy {
	private _totalNoSubscription: Subscription;

	constructor(private _navbarService: SettingsNavbarService,
		private _customersTotalCountService: CustomersTotalCountService) {
		super();
		this._navbarService.bootstrap(SettingsPageType.CustomerRegister);
	}
	public ngOnInit() {
		this._totalNoSubscription = this._customersTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
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
            this._customersTotalCountService.updateTotalCount();
        }
	}
}