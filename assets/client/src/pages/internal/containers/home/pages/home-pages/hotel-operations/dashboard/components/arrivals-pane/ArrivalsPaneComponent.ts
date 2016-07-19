import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {NewBookingModalService} from '../../../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';

import {ThButtonComponent} from '../../../../../../../../../../common/utils/components/ThButtonComponent';

import {ArrivalItemComponent} from './components/arrival-item/ArrivalItemComponent';

// import {HotelOperationsDashboardServiceDeprecated} from '../../services/HotelOperationsDashboardService';
import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';

import {IHotelOperationsDashboardArrivalsPaneMediator} from '../../HotelOperationsDashboardComponent';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

declare var _ : any;

@Component({
	selector: 'arrivals-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/arrivals-pane/template/arrivals-pane.html',
	providers: [NewBookingModalService],
	directives: [ThButtonComponent, ArrivalItemComponent]
})

export class ArrivalsPaneComponent implements OnInit {
	public arrivalItemsVMList;

	@Input() hotelOperationsDashboard: IHotelOperationsDashboardArrivalsPaneMediator;
	@Output() dragStarted = new EventEmitter();
	@Output() dragCanceled = new EventEmitter();

	constructor(
		private _newBookingModalService: NewBookingModalService, 
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _appContext:AppContext) {
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerArrivalsPane(this);
		this.refresh();
	}

	public refresh(){
		var date = this.hotelOperationsDashboard.getDate(); 
		this._hotelOperationsDashboardService.getArrivalItems()
		.subscribe((arrivals: any) => {
			debugger;
			this.arrivalItemsVMList = arrivals;
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
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

	public stoppedDragging(arrivalItemVM){
		this.hotelOperationsDashboard.stoppedDragging(arrivalItemVM);
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