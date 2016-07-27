import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {NewBookingModalService} from '../../../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';

import {ThButtonComponent} from '../../../../../../../../../../common/utils/components/ThButtonComponent';

import {ArrivalItemComponent} from './components/arrival-item/ArrivalItemComponent';
import {ArrivalItemInfoVM} from '../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';

import {IHotelOperationsDashboardArrivalsPaneMediator} from '../../HotelOperationsDashboardComponent';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
declare var _: any;

@Component({
	selector: 'arrivals-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/arrivals-pane/template/arrivals-pane.html',
	providers: [NewBookingModalService],
	directives: [ThButtonComponent, ArrivalItemComponent]
})

export class ArrivalsPaneComponent implements OnInit {
	public arrivalItemsVMList: ArrivalItemInfoVM[];
	public filteredArrivalsVMList: ArrivalItemInfoVM[];
	public selectedDate: ThDateDO;
	public searchText: string = "";

	@Input() hotelOperationsDashboard: IHotelOperationsDashboardArrivalsPaneMediator;
	@Output() dragStarted = new EventEmitter();
	@Output() dragCanceled = new EventEmitter();

	constructor(
		private _newBookingModalService: NewBookingModalService,
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _appContext: AppContext) {
		this.selectedDate = ThDateDO.buildThDateDO(2016, 6, 30);
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerArrivalsPane(this);
		this._hotelOperationsDashboardService.getArrivalItems(this.selectedDate)
			.subscribe((arrivals: ArrivalItemInfoVM[]) => {
				this.arrivalItemsVMList = arrivals;
				this.updateFilterArrivals();
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
	}

	private updateFilterArrivals(){
		if (this.searchText == ""){
			this.filteredArrivalsVMList = this.arrivalItemsVMList;
		}
		else {
			this.filteredArrivalsVMList = _.filter(this.arrivalItemsVMList, (item: ArrivalItemInfoVM) => {
				return (item.customerName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
			});
		}
	}

	public searchTextChangeHandler(value){
		this.searchText = value;
		this.updateFilterArrivals();
	}
	
	public nextDay() {
		this.selectedDate.addDays(1);
		this.refresh();
	}

	public previousDay() {
		this.selectedDate.addDays(-1);
		this.refresh();
	}

	public getDateShortString() {
		return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	}

	public refresh() {
		//TODO: FIX THIS
		if (!this.selectedDate) {
			this.selectedDate = ThDateDO.buildThDateDO(2016, 6, 18);
		}
		this._hotelOperationsDashboardService.refreshArrivals(this.selectedDate);
	}

	openNewBookingModal() {
		this._newBookingModalService.openNewBookingModal().then((modalDialogInstance: ModalDialogRef<NewBookingResult>) => {
            modalDialogInstance.resultObservable.subscribe((newBookingResult: NewBookingResult) => {

            });
        }).catch((e: any) => { });
	}

	public startedDragging(arrivalItemVM) {
		this.hotelOperationsDashboard.startedDragging(arrivalItemVM);
	}

	public stoppedDragging(arrivalItemVM) {
		this.hotelOperationsDashboard.stoppedDragging(arrivalItemVM);
	}

	public removeArrivalItem(arrivalItemVM) {
		var index = _.findIndex(this.arrivalItemsVMList, arrivalItemVM);

		if (index > - 1) {
			this.arrivalItemsVMList.splice(index, 1);
		}
	}

	public isArrivalItemSelected(arrivalItemVM) {
		var currentSelection = this.hotelOperationsDashboard.getSelectedArrivalItem();
		return currentSelection == arrivalItemVM;
	}

	public selectArrivalItem(arrivalItemVM) {
		this.hotelOperationsDashboard.clickedArrivalItem(arrivalItemVM);
	}
}