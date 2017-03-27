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

@Component({
    selector: 'bookings-for-price-product',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/bookings-for-price-product/template/bookings-for-price-product.html',
    providers: [EagerPriceProductsService]
})
export class BookingsForPriceProductComponent extends BaseComponent {
    private format: ReportOutputFormatType;
    private isLoading: boolean = false;

    private _priceProductList: PriceProductDO[];
    private priceProductId: string;

    constructor(private _appContext: AppContext,
        private _pagesService: SettingsReportsPagesService,
        private _eagerPriceProductsService: EagerPriceProductsService) {
        super();
        this._pagesService.bootstrapSelectedTab(ReportGroupType.BookingsForPriceProduct);
    }

    ngOnInit() {
        this.isLoading = true;
        this._priceProductList = [];
        this._eagerPriceProductsService.getActivePriceProducts().subscribe((priceProducts: PriceProductsDO) => {
            this.priceProductList = priceProducts.priceProductList;
            this.isLoading = false;
        }, (error: ThError) => {
            this.isLoading = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public get priceProductList(): PriceProductDO[] {
        return this._priceProductList;
    }
    public set priceProductList(priceProductList: PriceProductDO[]) {
        this._priceProductList = priceProductList;
        if (priceProductList.length > 0) {
            this.priceProductId = priceProductList[0].id;
        }
    }

    public didSelectFormat(format: ReportOutputFormatType) {
        this.format = format;
    }

    public reportCSVUrl(): string {
        let params = {
            reportType: ReportGroupType.BookingsForPriceProduct,
            format: this.format,
            properties: {
                priceProductId: this.priceProductId,
                confirmationStatusList: [BookingConfirmationStatus.Guaranteed, BookingConfirmationStatus.Confirmed]
            }
        }
        var encodedParams = encodeURI(JSON.stringify(params));
        return 'api/reports/report?params=' + encodedParams;
    }
}