import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {NewBookingModalService} from '../../../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';

import {ThButtonComponent} from '../../../../../../../../../../common/utils/components/ThButtonComponent';

import {ArrivalItemComponent} from './components/arrival-item/ArrivalItemComponent';

// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';

declare var $:any;
@Component({
	selector: 'arrivals-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/arrivals-pane/template/arrivals-pane.html',
	providers: [NewBookingModalService],
	directives: [ThButtonComponent, ArrivalItemComponent]
})

export class ArrivalsPaneComponent implements OnInit {
	@Output() dragStarted = new EventEmitter();
	@Output() dragCanceled = new EventEmitter();

	constructor(private _newBookingModalService: NewBookingModalService) {
	}

	ngOnInit() {
	}

	openNewBookingModal() {
		this._newBookingModalService.openNewBookingModal().then((modalDialogInstance: ModalDialogRef<NewBookingResult>) => {
            modalDialogInstance.resultObservable.subscribe((newBookingResult: NewBookingResult) => {

            });
        }).catch((e: any) => { });
	}
}