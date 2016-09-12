import {Component, OnInit, Input} from '@angular/core';

import {IHotelOperationsDashboardDeparturesMediator} from '../../HotelOperationsDashboardComponent';
import {DepartureItemInfoVM} from '../../../../../../../../services/hotel-operations/dashboard/departures/view-models/DepartureItemInfoVM';

import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';
import {HotelService} from '../../../../../../../../services/hotel/HotelService';

import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';

declare var $: any;
@Component({
	selector: 'departures-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/template/departures-pane.html'
})
export class DeparturesPaneComponent implements OnInit {
	public departureItemsVMList: DepartureItemInfoVM[];
	public filteredDeparturesVMList: DepartureItemInfoVM[];
	public selectedDepartureItem: DepartureItemInfoVM;
	public selectedDate: ThDateDO;
	public searchText: string = "";

	@Input() hotelOperationsDashboard: IHotelOperationsDashboardDeparturesMediator;

	constructor(
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _hotelService: HotelService,
		private _appContext: AppContext) {
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerDeparturesPane(this);
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
			this.selectedDate = details.currentThTimestamp.thDateDO.buildPrototype();

			this._hotelOperationsDashboardService.getDepartureItems(this.selectedDate)
				.subscribe((departures: DepartureItemInfoVM[]) => {
					this.departureItemsVMList = departures;
					this.updateFilterDepartures();
				}, (error: ThError) => {
					this._appContext.toaster.error(error.message);
				});

		});
	}

	private sortArrivalItems(arrivalItemsVMList: DepartureItemInfoVM[]) {
		var sortedItems = arrivalItemsVMList.sort((a: DepartureItemInfoVM, b: DepartureItemInfoVM) => {
			if (a.hasAttachedRoom && !b.hasAttachedRoom) {
				return -1;
			}
			if (!a.hasAttachedRoom && b.hasAttachedRoom) {
				return 1;
			}
			if (a.hasBooking && !b.hasBooking) {
				return -1;
			}
			if (!a.hasBooking && b.hasBooking) {
				return 1;
			}
			if (a.hasBooking && b.hasBooking) {
				if (!this._appContext.thUtils.isUndefinedOrNull(a.departureItemDO.roomId) && this._appContext.thUtils.isUndefinedOrNull(b.departureItemDO.roomId)) {
					return -1;
				}
				if (this._appContext.thUtils.isUndefinedOrNull(a.departureItemDO.roomId) && !this._appContext.thUtils.isUndefinedOrNull(b.departureItemDO.roomId)) {
					return 1;
				}
			}
			return a.customerName.localeCompare(b.customerName);
		})
		return sortedItems;
	}

	private updateFilterDepartures() {
		if (this.searchText == "") {
			this.filteredDeparturesVMList = this.sortArrivalItems(this.departureItemsVMList);
		}
		else {
			var filteredItems = _.filter(this.departureItemsVMList, (item: DepartureItemInfoVM) => {
				return (item.customerName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
			});

			this.filteredDeparturesVMList = this.sortArrivalItems(filteredItems);
		}
	}

	public searchTextChangeHandler(value) {
		this.searchText = value;
		this.updateFilterDepartures();
	}

	public nextDay() {
		this.selectedDate.addDays(1);
		this.refresh();
	}

	public previousDay() {
		this.selectedDate.addDays(-1);
		this.refresh();
	}

	public refresh() {
		this._hotelOperationsDashboardService.refreshDepartures(this.selectedDate);
	}

	public isDepartureItemSelected(departureItemVM: DepartureItemInfoVM) {
		return this.selectedDepartureItem == departureItemVM;
	}

	public selectDepartureItem(departureItemVM) {
		this.selectedDepartureItem = departureItemVM;
	}

	public getDateShortString() {
		return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	}

	ngAfterViewInit() {
	}
}