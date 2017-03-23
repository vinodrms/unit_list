import { Component } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { AppContext, ThError } from "../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { PriceProductDO } from "../../../../../../../../../services/price-products/data-objects/PriceProductDO";
import { YieldDynamicPriceModalInput } from "./services/utils/YieldDynamicPriceModalInput";
import { PriceProductYieldItemVM } from "../../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM";
import { DynamicPriceYieldItemDO } from "../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/DynamicPriceYieldItemDO";
import { ThDateIntervalDO } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO";
import { YieldManagerDashboardPriceProductsService } from "../../../../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService";
import { YieldManagerDashboardFilterService } from "../../../../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService";
import { YieldFiltersService } from "../../../../../../../../../services/hotel-configurations/YieldFiltersService";

@Component({
    selector: 'yield-dynamic-price-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/yield-dynamic-price-modal/template/yield-dynamic-price-modal.html',
    providers: [YieldFiltersService, YieldManagerDashboardFilterService, YieldManagerDashboardPriceProductsService]
})
export class YieldDynamicPriceModalComponent extends BaseComponent implements ICustomModalComponent {
    private ppYieldItemVM: PriceProductYieldItemVM;
    private dynamicPriceYieldItem: DynamicPriceYieldItemDO;
    private interval: ThDateIntervalDO;
    private isLoading = false;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<PriceProductDO>,
        modalInput: YieldDynamicPriceModalInput,
        private _yieldPriceProductsService: YieldManagerDashboardPriceProductsService) {
        super();
        this.ppYieldItemVM = modalInput.ppYieldItemVM;
        this.dynamicPriceYieldItem = modalInput.dynamicPriceYieldItem;

        let endDate = modalInput.startDate.buildPrototype();
        endDate.addDays(1);
        this.interval = ThDateIntervalDO.buildThDateIntervalDO(modalInput.startDate.buildPrototype(), endDate);
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public openDynamicPrice() {
        if (this.isLoading) { return; }
        this.isLoading = true;

        this._yieldPriceProductsService.openDynamicPrice({
            priceProductId: this.ppYieldItemVM.priceProductYieldItemDO.priceProductId,
            dynamicPriceId: this.dynamicPriceYieldItem.dynamicPriceId,
            interval: this.interval
        }).subscribe((priceProduct: PriceProductDO) => {
            this._modalDialogRef.addResult(priceProduct);

            var eventDescription = "Opened a Dynamic Price for an interval " + this.interval.toString();
            this._appContext.analytics.logEvent("yield-manager", "yield-dynamic-price", eventDescription);

            let message = this._appContext.thTranslation.translate("%rateName% was opened succesfully for the period %period%", {
                rateName: this.dynamicPriceYieldItem.name,
                period: this.interval.toString()
            })
            this._appContext.toaster.success(message);
            this.isLoading = false;
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
            this.isLoading = false;
        });
    }
}