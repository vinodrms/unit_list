import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {NewBookingModalService} from '../../../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';

import {ThButtonComponent} from '../../../../../../../../../../common/utils/components/ThButtonComponent';

import {ArrivalItemComponent} from './components/arrival-item/ArrivalItemComponent';

import {IHotelOperationsDashboardArrivalsPaneMediator} from '../../HotelOperationsDashboardComponent';

declare var _ : any;

@Component({
	selector: 'arrivals-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/arrivals-pane/template/arrivals-pane.html',
	providers: [NewBookingModalService],
	directives: [ThButtonComponent, ArrivalItemComponent]
})

export class ArrivalsPaneComponent implements OnInit {
	public arrivalItemsVMList;

	@Input() hotelOperationsDashboard: IHotelOperationsDashboardArrivalsPaneMediator;
	@Output() dragStarted = new EventEmitter();
	@Output() dragCanceled = new EventEmitter();

	constructor(private _newBookingModalService: NewBookingModalService) {
	}

	ngOnInit() {
		this.arrivalItemsVMList = [
			{
				ClientName: "Robert Paulsen",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "John Snow",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},		
			{
				ClientName: "Erika Einstein",
				NumberOfPeople: 2,
				NumberOfNights: 6,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 19.02.16",
			},
			{
				ClientName: "Dragos Pricope",
				NumberOfPeople: 1,
				NumberOfNights: 3,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 16.02.16",
			}
		]
		this.hotelOperationsDashboard.registerArrivalsPane(this);
	}

	openNewBookingModal() {
		this._newBookingModalService.openNewBookingModal().then((modalDialogInstance: ModalDialogRef<NewBookingResult>) => {
            modalDialogInstance.resultObservable.subscribe((newBookingResult: NewBookingResult) => {

            });
        }).catch((e: any) => { });
	}

	public startedDragging(arrivalItemVM){
		this.hotelOperationsDashboard.startedDragging(arrivalItemVM);
	}

	public removeArrivalItem(arrivalItemVM){
		var index = _.findIndex(this.arrivalItemsVMList, arrivalItemVM);

		if (index > - 1){
			this.arrivalItemsVMList.splice(index, 1);
		}
	}

	public isArrivalItemSelected(arrivalItemVM){
		var currentSelection = this.hotelOperationsDashboard.getSelectedArrivalItem();
		return currentSelection == arrivalItemVM;
	}

	public selectArrivalItem(arrivalItemVM){
		this.hotelOperationsDashboard.clickedArrivalItem(arrivalItemVM);
	}
}