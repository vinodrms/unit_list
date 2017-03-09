import { Component, Input } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../common/base/BaseComponent";
import { AppContext } from "../../../../../../../../../../common/utils/AppContext";
import { IPriceProductEditSection } from "../utils/IPriceProductEditSection";
import { PriceProductVM } from "../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceProductDiscountDO } from "../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { PriceProductDiscountWrapperDO } from "../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountWrapperDO";
import { PriceProductDiscountContainer } from "./utils/PriceProductDiscountContainer";
import { PriceProductDiscountVM } from "./utils/PriceProductDiscountVM";

@Component({
    selector: 'price-product-edit-discounts-section',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/discounts/template/price-product-edit-discounts-section.html'
})
export class PriceProductEditDiscountsSectionComponent extends BaseComponent implements IPriceProductEditSection {
    readonly: boolean;
    @Input() didSubmit: boolean;

    discountContainer: PriceProductDiscountContainer;

    constructor(private _appContext: AppContext) {
        super();
        this.discountContainer = new PriceProductDiscountContainer(this._appContext);
    }

    public isValid(): boolean {
        return true;
    }
    public initializeFrom(priceProductVM: PriceProductVM) {
        var discountList: PriceProductDiscountDO[] = [];
        if (priceProductVM.priceProduct.discounts) {
            var ppDiscountList = priceProductVM.priceProduct.discounts.discountList;
            if (ppDiscountList && ppDiscountList.length > 0) {
                discountList = discountList.concat(ppDiscountList);
            }
        }
        this.discountContainer.initFromDiscountList(discountList);
    }
    public updateDataOn(priceProductVM: PriceProductVM) {
        if (!priceProductVM.priceProduct.discounts) {
            priceProductVM.priceProduct.discounts = new PriceProductDiscountWrapperDO();
        }
        priceProductVM.priceProduct.discounts.discountList = this.discountContainer.getDiscountDOList();
    }
    public removeDiscount(discountVM: PriceProductDiscountVM) {
        this.discountContainer.removeDiscount(discountVM);
    }

    // TODO: implement discounts modal
    public openDiscountsModal() {

    }
}