import {Component, OnInit} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ThButtonComponent} from '../../../../../../../../common/utils/components/ThButtonComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';
import {NewBookingModalService} from '../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';

@Component({
	selector: 'hotel-operations-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/template/hotel-operations-container.html',
	providers: [NewBookingModalService],
	directives: [ThButtonComponent],
	pipes: [TranslationPipe]
})

export class HotelOperationsContainerComponent extends AHomeContainerComponent implements OnInit {

	constructor(headerPageService: HeaderPageService,
		private _newBookingModalService: NewBookingModalService) {
		super(headerPageService, HeaderPageType.HotelOperations);
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