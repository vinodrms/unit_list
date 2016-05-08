import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {RoomsComponent} from '../../../../../../common/inventory/rooms/main/RoomsComponent';
import {SettingsNavbarService} from '../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../navbar/services/utils/SettingsPageType';
import {RoomDO} from '../../../../../../../services/rooms/data-objects/RoomDO';
import {TotalCountDO} from '../../../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {InventoryScreenStateType} from '../../../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {RoomsTotalCountService} from '../../../../../../../services/rooms/RoomsTotalCountService';

@Component({
    selector: 'settings-rooms',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/rooms/template/settings-rooms.html',
    providers: [RoomsTotalCountService],
    directives: [RoomsComponent],
    pipes: [TranslationPipe]
})
export class SettingsRoomsComponent extends BaseComponent implements OnInit, OnDestroy {
    private _totalNoSubscription: Subscription;

    constructor(private _navbarService: SettingsNavbarService,
        private _roomsTotalCountService: RoomsTotalCountService) {
        super();
        this._navbarService.bootstrap(SettingsPageType.Rooms);
    }
    public ngOnInit() {
        this._totalNoSubscription = this._roomsTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
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
            this._roomsTotalCountService.updateTotalCount();
        }
    }
    public didDeleteItem(deletedRoom: RoomDO) {
        this._roomsTotalCountService.updateTotalCount();
    }
}