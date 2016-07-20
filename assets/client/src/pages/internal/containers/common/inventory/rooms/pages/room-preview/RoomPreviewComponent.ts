import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ConfigCapacityComponent} from '../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {BedSelectorComponent} from '../room-edit/components/bed-selector/BedSelectorComponent';

@Component({
    selector: 'room-preview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-preview/template/room-preview.html',
    directives: [ConfigCapacityComponent, BedSelectorComponent],
    pipes: [TranslationPipe]
})
export class RoomPreviewComponent implements OnInit {
    private _didInit: boolean = false;

    @Input() bedVMList: BedVM[];

    private _roomVM: RoomVM;
    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    @Input()
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
        this.loadDependentData();
    }

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._roomVM) || this._appContext.thUtils.isUndefinedOrNull(this.bedVMList)) { return };
        // TODO: load other stuff
    }
}