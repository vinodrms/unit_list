import { Component, Input } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../common/base/BaseComponent";
import { AppContext } from "../../../../../../../../../../common/utils/AppContext";
import { IPriceProductEditSection } from "../utils/IPriceProductEditSection";
import { PriceProductVM } from "../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceProductDiscountDO } from "../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { PriceProductDiscountWrapperDO } from "../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountWrapperDO";
import { PriceProductDiscountContainer } from "./utils/PriceProductDiscountContainer";
import { PriceProductDiscountVM } from "./utils/PriceProductDiscountVM";
import { PriceProductDiscountModalService } from "./discount-modal/services/PriceProductDiscountModalService";
import { ModalDialogRef } from "../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { PriceProductDiscountModalResult } from "./discount-modal/services/utils/PriceProductDiscountModalResult";
import { EagerCustomersService } from "../../../../../../../../services/customers/EagerCustomersService";
import { CustomersDO } from "../../../../../../../../services/customers/data-objects/CustomersDO";
import { CustomerDO } from "../../../../../../../../services/customers/data-objects/CustomerDO";

import * as _ from "underscore";

@Component({
    selector: 'price-product-edit-discounts-section',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/discounts/template/price-product-edit-discounts-section.html',
    providers: [PriceProductDiscountModalService, EagerCustomersService]
})
export class PriceProductEditDiscountsSectionComponent extends BaseComponent implements IPriceProductEditSection {
    public static MaxDiscountsNo = 10;
    readonly: boolean;
    @Input() didSubmit: boolean;

    discountContainer: PriceProductDiscountContainer;
    private customerMap: { [index: string]: CustomerDO };

    constructor(private _appContext: AppContext,
        private _discountModalService: PriceProductDiscountModalService,
        private _eagerCustomersService: EagerCustomersService) {
        super();
        this.discountContainer = new PriceProductDiscountContainer(this._appContext);
        this.customerMap = {};
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
        this.initCustomersFromDiscounts(discountList);
        this.discountContainer.initFromDiscountList(discountList);
    }
    public updateDataOn(priceProductVM: PriceProductVM) {
        if (!priceProductVM.priceProduct.discounts) {
            priceProductVM.priceProduct.discounts = new PriceProductDiscountWrapperDO();
        }
        priceProductVM.priceProduct.discounts.discountList = this.discountContainer.getDiscountDOList();
    }

    private initCustomersFromDiscounts(discountList: PriceProductDiscountDO[]) {
        var customerIdList = [];
        _.forEach(discountList, discount => {
            customerIdList = customerIdList.concat(discount.customerIdList);
        });
        customerIdList = _.uniq(customerIdList);

        this._eagerCustomersService.getCustomersById(customerIdList).subscribe((customers: CustomersDO) => {
            this.updateDiscountCustomers(customers.customerList);
        });
    }
    private updateDiscountCustomers(customerList: CustomerDO[]) {
        this.updateCustomerMap(customerList);
        _.forEach(this.discountContainer.discountVMList, discountVM => {
            discountVM.updateCustomersLabel(this.customerMap);
        });
    }
    private updateCustomerMap(customerList: CustomerDO[]) {
        _.forEach(customerList, customer => {
            this.customerMap[customer.id] = customer;
        });
    }

    private removeDiscount(discountVM: PriceProductDiscountVM) {
        this.discountContainer.removeDiscount(discountVM);
    }

    private openDiscountsModal() {
        if (this.discountContainer.discountVMList.length > PriceProductEditDiscountsSectionComponent.MaxDiscountsNo) {
            let errorMessage = this._appContext.thTranslation.translate("You cannot add more than 10 discounts on the same price product");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        this._discountModalService.openPriceProductDiscountModal()
            .then((modalDialogInstance: ModalDialogRef<PriceProductDiscountModalResult>) => {
                modalDialogInstance.resultObservable.subscribe((result: PriceProductDiscountModalResult) => {
                    this.discountContainer.addDiscount(result.discount);
                    this.updateDiscountCustomers(result.customerList);
                });
            }).catch((e: any) => { });
    }
}