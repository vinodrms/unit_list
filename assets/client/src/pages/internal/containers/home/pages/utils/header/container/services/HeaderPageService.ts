import { Injectable } from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {HeaderPage} from './HeaderPage';
import {HeaderPageType} from './HeaderPageType';

import * as _ from "underscore";

@Injectable()
export class HeaderPageService {
	private static NavigationBasePath = "/";
	private _headerPageList: HeaderPage[];

	constructor(private _appContext: AppContext) {
		this.initializeHeaderPageList();
	}
	private initializeHeaderPageList() {
		this._headerPageList = [
			new HeaderPage(HeaderPageType.HotelOperations, "operations", "Hotel Operations", "E"),
			new HeaderPage(HeaderPageType.YieldManager, "yield-manager", "Yield Manager", "F"),
			new HeaderPage(HeaderPageType.BookingHistory, "bookings", "Booking History", "D"),
			new HeaderPage(HeaderPageType.InvoiceHistory, "invoices", "Invoice History", "L")
		]
	}

	public markCurrentPage(headerPageType: HeaderPageType) {
		this.deselectAll();
		if (headerPageType !== HeaderPageType.None) {
			var headerPage = this.getHeaderPageWithType(headerPageType);
			headerPage.selected = true;
		}
	}

	public goToPage(headerPageType: HeaderPageType) {
		this.deselectAll();
		if (headerPageType !== HeaderPageType.None) {
			var headerPage = this.getHeaderPageWithType(headerPageType);
			this.markCurrentPage(headerPageType);
			this._appContext.routerNavigator.navigateTo(HeaderPageService.NavigationBasePath + headerPage.componentPath);
		}
	}

	private deselectAll() {
		_.forEach(this._headerPageList, (headerPage: HeaderPage) => { headerPage.selected = false; });
	}
	private getHeaderPageWithType(headerPageType: HeaderPageType): HeaderPage {
		return _.find(this._headerPageList, (headerPage: HeaderPage) => { return headerPage.headerPageType === headerPageType; });
	}

	public get headerPageList(): HeaderPage[] {
		return this._headerPageList;
	}
	public set headerPageList(headerPageList: HeaderPage[]) {
		this._headerPageList = headerPageList;
	}
}