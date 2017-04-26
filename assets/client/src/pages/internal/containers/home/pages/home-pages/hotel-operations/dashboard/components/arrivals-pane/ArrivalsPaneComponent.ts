import {Component, ViewChild, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {NewBookingModalService} from '../../../../../utils/new-booking/modal/services/NewBookingModalService';
import {NewBookingResult} from '../../../../../utils/new-booking/modal/services/utils/NewBookingResult';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {ArrivalItemInfoVM} from '../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';
import {IHotelOperationsDashboardArrivalsPaneMediator} from '../../HotelOperationsDashboardComponent';
import {HotelService} from '../../../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDatePickerComponent} from '../../../../../../../../../../common/utils/components/ThDatePickerComponent';

@Component({
	selector: 'arrivals-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/arrivals-pane/template/arrivals-pane.html',
	providers: [NewBookingModalService]
})
export class ArrivalsPaneComponent implements OnInit {

	@ViewChild(ThDatePickerComponent) thDatePickerComponent: ThDatePickerComponent;
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
		private _hotelService: HotelService,
		private _appContext: AppContext) {
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerArrivalsPane(this);
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
			this.selectedDate = details.currentThTimestamp.thDateDO.buildPrototype();

			this._hotelOperationsDashboardService.getArrivalItems(this.selectedDate)
				.subscribe((arrivals: ArrivalItemInfoVM[]) => {
					this.arrivalItemsVMList = arrivals;
					this.updateFilterArrivals();
				}, (error: ThError) => {
					this._appContext.toaster.error(error.message);
				});
		})
	}

	private sortByName(arrivalItemsVMList: ArrivalItemInfoVM[]) {
		var sortedItems = arrivalItemsVMList.sort((a: ArrivalItemInfoVM, b: ArrivalItemInfoVM) => {
			return a.customerName.localeCompare(b.customerName);
		})
		return sortedItems;
	}

	private updateFilterArrivals() {
		if (this.searchText == "") {
			this.filteredArrivalsVMList = this.sortByName(this.arrivalItemsVMList);
		}
		else {
			var filteredItems = _.filter(this.arrivalItemsVMList, (item: ArrivalItemInfoVM) => {
				return (item.customerName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
			});
			this.filteredArrivalsVMList = this.sortByName(filteredItems);
		}
	}

	public searchTextChangeHandler(value) {
		this.searchText = value;
		this.updateFilterArrivals();
	}

	public nextDay() {
		this.selectedDate.addDays(1);
		this.thDatePickerComponent.selectedThDate = this.selectedDate;
		this.refresh();
	}

	public previousDay() {
		this.selectedDate.addDays(-1);
		this.thDatePickerComponent.selectedThDate = this.selectedDate;
		this.refresh();
	}

	public getDateShortString() {
		return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	}

	public refresh() {
		this._hotelOperationsDashboardService.refreshArrivals(this.selectedDate);
	}

	public openNewBookingModal() {
		this._newBookingModalService.openNewBookingModal().then((modalDialogInstance: ModalDialogRef<NewBookingResult>) => {
            modalDialogInstance.resultObservable.subscribe((newBookingResult: NewBookingResult) => {
				this.refresh();
            });
        }).catch((e: any) => {
			this._appContext.toaster.error(e.message);
		});
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

	public didSelectArrivalDate(date: ThDateDO) {
		this.selectedDate = date;
		this.refresh();
	}
}