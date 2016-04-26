import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {BedsComponent} from '../../../../../../common/inventory/beds/main/BedsComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';
import {BedDO} from '../../../../../../../services/beds/data-objects/BedDO';
import {BedsTotalCountService} from '../../../../../../../services/beds/BedsTotalCountService';
import {InventoryScreenStateType} from '../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {TotalCountDO} from '../../../../../../../services/common/data-objects/lazy-load/TotalCountDO';

@Component({
	selector: 'settings-beds',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/beds/template/settings-beds.html',
	providers: [BedsTotalCountService],
    directives: [BedsComponent],
	pipes: [TranslationPipe]
})
export class SettingsBedsComponent extends BaseComponent implements OnInit, OnDestroy {
	private _totalNoSubscription: Subscription;

	constructor(private _navbarService: SettingsNavbarService,
		private _bedsTotalCountService: BedsTotalCountService) {
		super();
		this._navbarService.bootstrap(SettingsPageType.Beds);
	}
	public ngOnInit() {
		this._totalNoSubscription = this._bedsTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
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
			this._bedsTotalCountService.updateTotalCount();
		}
	}
	public didDeleteItem(deletedBed: BedDO) {
		this._bedsTotalCountService.updateTotalCount();
	}
}