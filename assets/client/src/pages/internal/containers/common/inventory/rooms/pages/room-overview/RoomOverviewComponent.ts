import { Component, Input, Output, EventEmitter } from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';

@Component({
    selector: 'room-overview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-overview/template/room-overview.html',
    pipes: [TranslationPipe],
	directives: [CustomScroll]
})
export class RoomOverviewComponent extends BaseComponent {
    constructor() { 
        super();
    }
    
    private _roomVM: RoomVM;
	public get roomVM(): RoomVM {
		return this._roomVM;
	}
    
	@Input()
	public set roomVM(roomVM: RoomVM) {
		this._roomVM = roomVM;
	}
    
    @Output() onEdit = new EventEmitter();
	public editRoom() {
		this.onEdit.next(this._roomVM);
	}

}