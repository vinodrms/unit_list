import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {PriceProductDO} from '../../../../../../../../../../../services/price-products/data-objects/PriceProductDO';

@Component({
    selector: 'booking-price-product-viewer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/price-product-view/template/booking-price-product-viewer.html',
    pipes: [TranslationPipe]
})
export class BookingPriceProductViewerComponent implements OnInit {
    private _bookingOperationsPageData: BookingOperationsPageData;
    public get bookingOperationsPageData(): BookingOperationsPageData {
        return this._bookingOperationsPageData;
    }
    @Input()
    public set bookingOperationsPageData(bookingOperationsPageData: BookingOperationsPageData) {
        this._bookingOperationsPageData = bookingOperationsPageData;
        this.loadDependentData();
    }

    private _didInit: boolean = false;

    conditionsString: string = "";
    constraintsString: string = "";

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.conditionsString = this.priceProductDO.conditions.getCancellationConditionsString(this._appContext.thTranslation);
        this.constraintsString = this.priceProductDO.constraints.getBriefValueDisplayString(this._appContext.thTranslation);
    }

    public get priceProductDO(): PriceProductDO {
        return this._bookingOperationsPageData.bookingDO.priceProductSnapshot;
    }
    public get currencySymbolString(): string {
        return this._bookingOperationsPageData.ccy.nativeSymbol;
    }
    public get totalPrice(): number {
        return this._bookingOperationsPageData.bookingDO.price.totalPrice;
    }
    public get isPenaltyPrice(): boolean {
        return this._bookingOperationsPageData.bookingDO.price.isPenalty();
    }
}