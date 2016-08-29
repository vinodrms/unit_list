import {Component, AfterViewInit, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../common/utils/components/LoadingComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {PriceSelectionTableMetaBuilderService} from './services/PriceSelectionTableMetaBuilderService';
import {HotelOperationsBookingService} from '../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {PriceSelectionService, PriceSelectionType} from './services/PriceSelectionService';
import {PriceSelectionVM} from './services/view-models/PriceSelectionVM';

@Component({
    selector: 'price-selection',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/assign-room/components/price-selection/template/price-selection.html',
    providers: [HotelOperationsBookingService, PriceSelectionService, PriceSelectionTableMetaBuilderService],
    directives: [LoadingComponent, LazyLoadingTableComponent],
    pipes: [TranslationPipe]
})
export class PriceSelectionComponent implements AfterViewInit, OnInit {
    @Output() onPriceSelection = new EventEmitter<PriceSelectionVM>();

    didInit: boolean = false;
    pageMessage: string = "";

    @ViewChild(LazyLoadingTableComponent) private _pricesTableComponent: LazyLoadingTableComponent<PriceSelectionVM>;

    constructor(private _appContext: AppContext,
        private _priceSelectionService: PriceSelectionService,
        private _tableMetaBuilder: PriceSelectionTableMetaBuilderService) { }

    public ngOnInit() {
        this._appContext.analytics.logPageView("/operations/assign-room/price-selection");
    }
    public ngAfterViewInit() {
        this.bootstrapTable();
        this._priceSelectionService.buildPossiblePrices().subscribe((priceSelectionVMList: PriceSelectionVM[]) => {
            this.buildPageMessage();
            var defaultPriceSelection = _.find(priceSelectionVMList, (priceSelectionVM: PriceSelectionVM) => {
                return priceSelectionVM.roomCategoryStats.roomCategory.id === this._priceSelectionService.bookingDO.roomCategoryId;
            });
            if (defaultPriceSelection) {
                this.didSelectPriceSelection(defaultPriceSelection);
            }
            this._priceSelectionService.refreshData();

            this.didInit = true;
        });
    }
    private bootstrapTable() {
        this._pricesTableComponent.bootstrap(this._priceSelectionService, this._tableMetaBuilder.buildLazyLoadTableMeta());
    }

    private buildPageMessage() {
        switch (this._priceSelectionService.priceSelectionType) {
            case PriceSelectionType.RoomHasSameRoomCategoryLikeTheBooking:
                this.pageMessage = "You chose a room with the same category like the booking. The price will remain unchanged.";
                break;
            case PriceSelectionType.RoomHasRoomCategoryInPriceProduct:
                this.pageMessage = "You chose a room category that is priced differently in the booking's Price Product. Select the desired price of the booking (you can leave it unchanged).";
                break;
            case PriceSelectionType.RoomDoesNotHaveRoomCategoryInPriceProduct:
                this.pageMessage = "You chose a room category that does not have a price defined in the booking's Price Product. Select the desired price of the booking (you can leave it unchanged).";
                break;
        }
    }

    public didSelectPriceSelection(priceSelection: PriceSelectionVM) {
        if (priceSelection.roomCategoryStats.roomCategory.id === this._priceSelectionService.bookingDO.roomCategoryId) {
            this.didSelectPriceSelectionCore(priceSelection);
            return;
        }
        var title = this._appContext.thTranslation.translate("Change Price");
        var content = this._appContext.thTranslation.translate("Are you sure you want to change the price for this booking?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.didSelectPriceSelectionCore(priceSelection);
            }, () => { });
    }
    private didSelectPriceSelectionCore(priceSelection: PriceSelectionVM) {
        this._pricesTableComponent.selectItem(priceSelection);
        this.onPriceSelection.next(priceSelection);
    }
}