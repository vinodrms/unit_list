import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { ReportOutputFormatType } from "../../utils/ReportOutputFormatType";
import { ReportGroupType } from "../../utils/ReportGroupType";
import { AppContext, ThError } from "../../../../../../../../../../../common/utils/AppContext";
import { SettingsReportsPagesService } from "../../main/services/SettingsReportsPagesService";
import { EagerPriceProductsService } from "../../../../../../../../../services/price-products/EagerPriceProductsService";
import { PriceProductsDO } from "../../../../../../../../../services/price-products/data-objects/PriceProductsDO";
import { PriceProductDO } from "../../../../../../../../../services/price-products/data-objects/PriceProductDO";
import { BookingConfirmationStatus } from "../../../../../../../../../services/bookings/data-objects/BookingDO";
import { BookingMeta } from "../../../../../../../../../services/bookings/data-objects/BookingMeta";
import { BookingMetaFactory } from "../../../../../../../../../services/bookings/data-objects/BookingMetaFactory";
import { ThDateDO } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateDO";
import { HotelDetailsDO } from "../../../../../../../../../services/hotel/data-objects/HotelDetailsDO";
import { HotelService } from "../../../../../../../../../services/hotel/HotelService";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'bookings-report',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/bookings-report/template/bookings-report.html',
    providers: [EagerPriceProductsService]
})
export class BookingsReportComponent extends BaseComponent implements OnInit {

    public filterByBookingCreationDate: boolean;
    private format: ReportOutputFormatType;
    private isLoading: boolean = false;

    private _priceProductList: PriceProductDO[];
    private bookingMetaList: BookingMeta[];
    private selectedConfirmationStatuses: { [index: number]: boolean } = {};
    private selectedPriceProducts: { [index: string]: boolean } = {};
    private startDate: ThDateDO;
    private endDate: ThDateDO;
    private bookingCreationStartDate: ThDateDO;
    private bookingCreationEndDate: ThDateDO;

    constructor(private _appContext: AppContext,
        private _pagesService: SettingsReportsPagesService,
        private _eagerPriceProductsService: EagerPriceProductsService,
        private _hotelService: HotelService) {
        super();
        this.filterByBookingCreationDate = false;
        this._pagesService.bootstrapSelectedTab(ReportGroupType.Bookings);
        let factory = new BookingMetaFactory();
        this.bookingMetaList = factory.getBookingMetaList();
        this.setDefaultConfirmationStatuses();

    }

    private setDefaultConfirmationStatuses() {
        this.bookingMetaList.forEach(meta => {
            this.selectedConfirmationStatuses[meta.confirmationStatus] = false;
        });
        this.selectedConfirmationStatuses[BookingConfirmationStatus.Confirmed] = true;
        this.selectedConfirmationStatuses[BookingConfirmationStatus.Guaranteed] = true;
        this.selectedConfirmationStatuses[BookingConfirmationStatus.NoShow] = true;
        this.selectedConfirmationStatuses[BookingConfirmationStatus.NoShowWithPenalty] = true;
        this.selectedConfirmationStatuses[BookingConfirmationStatus.CheckedIn] = true;
    }

    ngOnInit() {
        this.isLoading = true;
        this._priceProductList = [];

		Observable.combineLatest(
        this._eagerPriceProductsService.getActivePriceProducts(),
        this._hotelService.getHotelDetailsDO())
        .subscribe((result: [PriceProductsDO, HotelDetailsDO]) => {
            var priceProducts = result[0];
            var details = result[1];
            this.priceProductList = priceProducts.priceProductList;
            this.setDefaultPriceProducts();
            this.startDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this.endDate = this.startDate.buildPrototype();
			this.endDate.addDays(1);
            this.bookingCreationStartDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this.bookingCreationEndDate = this.startDate.buildPrototype();
            this.isLoading = false;
        }, (error: ThError) => {
            this.isLoading = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public didSelectStartDate(startDate) {
        this.startDate = startDate;
    }

    public didSelectEndDate(endDate) {
        this.endDate = endDate;
    }

    public didSelectBookingCreationStartDate(startDate) {
        this.bookingCreationStartDate = startDate;
    }

    public didSelectBookingCreationEndDate(endDate) {
        this.bookingCreationEndDate = endDate;
    }

    private setDefaultPriceProducts() {
        _.forEach(this.priceProductList, (pp: PriceProductDO) => {
            this.selectedPriceProducts[pp.id] = false;
        });
    }

    public get priceProductList(): PriceProductDO[] {
        return this._priceProductList;
    }
    public set priceProductList(priceProductList: PriceProductDO[]) {
        this._priceProductList = priceProductList;
    }

    public didSelectFormat(format: ReportOutputFormatType) {
        this.format = format;
    }

    public reportCSVUrl(): string {
        var confirmationStringList: string[] = Object.keys(this.selectedConfirmationStatuses);
        var confirmationList: BookingConfirmationStatus[] = [];
        confirmationStringList.forEach(confirmationString => {
            if (this.selectedConfirmationStatuses[confirmationString] === true) {
                confirmationList.push(parseInt(confirmationString));
            }
        });
        var priceProductIdList: string[] = [];
        _.forEach(this._priceProductList, (pp: PriceProductDO) => {
            if (this.selectedPriceProducts[pp.id] === true) {
                priceProductIdList.push(pp.id);
            }
        });
        let params = {
            reportType: ReportGroupType.Bookings,
            format: this.format,
            properties: {
                startDate: this.startDate,
                endDate: this.endDate,
                priceProductIdList: priceProductIdList,
                confirmationStatusList: confirmationList,
            }
        }
        if (this.filterByBookingCreationDate) {
            params.properties["bookingCreationStartDate"] = this.bookingCreationStartDate;
            params.properties["bookingCreationEndDate"] = this.bookingCreationEndDate;
        }
        var encodedParams = encodeURI(JSON.stringify(params));
        return 'api/reports/report?params=' + encodedParams;
    }
}