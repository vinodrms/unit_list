import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';
import {AllotmentDO, AllotmentStatus} from '../../../../../../../services/allotments/data-objects/AllotmentDO';
import {TotalCountDO} from '../../../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {InventoryScreenStateType} from '../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {AllotmentsTotalCountService} from '../../../../../../../services/allotments/AllotmentsTotalCountService';

@Component({
	selector: 'settings-allotments',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/allotments/template/settings-allotments.html',
	providers: [AllotmentsTotalCountService]
})
export class SettingsAllotmentsComponent extends BaseComponent implements OnInit, OnDestroy {
	private _totalNoSubscription: Subscription;

	constructor(private _navbarService: SettingsNavbarService,
		private _allotmentsTotalCountService: AllotmentsTotalCountService) {
		super();
		this._navbarService.bootstrap(SettingsPageType.Allotments);
	}
	public ngOnInit() {
		this._totalNoSubscription = this._allotmentsTotalCountService.getTotalCountDO(AllotmentStatus.Active).subscribe((totalCount: TotalCountDO) => {
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
            this._allotmentsTotalCountService.updateTotalCount();
        }
	}
	public didDeleteItem(deletedAllotment: AllotmentDO) {
		this._allotmentsTotalCountService.updateTotalCount();
	}
}