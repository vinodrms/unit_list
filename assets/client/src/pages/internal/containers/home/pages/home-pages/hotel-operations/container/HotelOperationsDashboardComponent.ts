import {Component, OnInit} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ThButtonComponent} from '../../../../../../../../common/utils/components/ThButtonComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';
import {NewBookingModalService} from '../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';

declare var $:any;

@Component({
	selector: 'hotel-operations-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/template/hotel-operations-dashboard.html',
	providers: [NewBookingModalService],
	directives: [ThButtonComponent],
	pipes: [TranslationPipe]
})

export class HotelOperationsDashboardComponent extends AHomeContainerComponent implements OnInit {
	private roomVMList: any;
	constructor(headerPageService: HeaderPageService,
		private _newBookingModalService: NewBookingModalService) {
		super(headerPageService, HeaderPageType.HotelOperations);
	}

	ngOnInit() {
		this.roomVMList = [
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "501",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16",
					}
				}
			}
			,
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "502",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}
		]
	}

	ngAfterViewInit() {
		$(".arrival-item").draggable(
            {
                revert:     'invalid', 
                helper:     'clone', 
                zIndex:     100
            }			
		);

		$(".room-card").droppable(
            {
				accept: '.arrival-item',
				drop: (event : Event, ui : Object) => {
					alert("Room card -> dropped")
				}
            }			
		);
	}

	openNewBookingModal() {
		this._newBookingModalService.openNewBookingModal().then((modalDialogInstance: ModalDialogRef<NewBookingResult>) => {
            modalDialogInstance.resultObservable.subscribe((newBookingResult: NewBookingResult) => {

            });
        }).catch((e: any) => { });
	}
}