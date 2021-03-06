import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceProductDiscountDO } from "../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { PriceProductConstraintWrapperDO } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintWrapperDO";
import { PriceProductConstraintFactory } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintFactory";
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";
import { PriceProductDiscountModalResult } from "./services/utils/PriceProductDiscountModalResult";
import { ThDateIntervalDO } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO";
import { ThDateUtils } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils";
import { PriceProductDiscountIntervalWrapperDO } from "../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountIntervalWrapperDO";

import * as _ from "underscore";

@Component({
    selector: 'price-product-discount-modal',
    templateUrl: "/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/discounts/discount-modal/template/price-product-discount-modal.html",
})
export class PriceProductDiscountModalComponent extends BaseComponent implements ICustomModalComponent {
    public static MaxCustomers = 10;
    public static MaxConstraints = 10;
    public static MaxIntervals = 10;
    private _constraintFactory: PriceProductConstraintFactory;

    discount: PriceProductDiscountDO;
    customerMap: { [index: string]: CustomerDO };
    constraintIdList: number[] = [];

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<PriceProductDiscountModalResult>) {
        super();
        this._constraintFactory = new PriceProductConstraintFactory();
        this.discount = new PriceProductDiscountDO();
        this.discount.constraints = new PriceProductConstraintWrapperDO();
        this.discount.constraints.constraintList = [];
        this.discount.intervals = new PriceProductDiscountIntervalWrapperDO();
        this.discount.intervals.intervalList = [];
        this.discount.customerIdList = [];
        this.customerMap = {};
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
    public get maxCustomers(): number {
        return PriceProductDiscountModalComponent.MaxCustomers;
    }
    public isPublic() {
        return this.discount.isPublic();
    }
    public getNameForCustomer(customerId: string): string {
        return this.customerMap[customerId].customerNameAndEmailString;
    }
    public didAddCustomer(customer: CustomerDO) {

        this.discount.customerIdList.push(customer.id);
        this.customerMap[customer.id] = customer;
        
        this.discount.customerIdList = _.uniq(this.discount.customerIdList);
    }
    public didRemoveCustomer(customer: CustomerDO) {
        this.discount.customerIdList = _.filter(this.discount.customerIdList, existingId => { return existingId != customer.id; });
        delete this.customerMap[customer.id];
    }

    public createNewConstraint() {
        if (this.constraintIdList.length > PriceProductDiscountModalComponent.MaxConstraints) {
            let errorMessage = this._appContext.thTranslation.translate("You cannot add more than 10 constraints on the same discount");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        this.constraintIdList.push(this.constraintIdList.length);
        let dummyConstraint = this._constraintFactory.getDefaultConstraintDO();
        this.discount.constraints.constraintList.push(dummyConstraint);
    }
    public removeConstraintAtIndex(index: number) {
        this.constraintIdList.splice(index, 1);
        this.discount.constraints.constraintList.splice(index, 1);
    }

    public createNewInterval() {
        console.log("create new interval");
        if (this.discount.intervals.intervalList.length > PriceProductDiscountModalComponent.MaxIntervals) {
            let errorMessage = this._appContext.thTranslation.translate("You cannot add more than 10 intervals on the same discount");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        this.discount.intervals.intervalList.push(this.getDefaultInterval());
    }
    private getDefaultInterval(): ThDateIntervalDO {
        let dateUtils = new ThDateUtils();
        return dateUtils.getTodayToTomorrowInterval();
    }
    public didSelectInterval(interval: ThDateIntervalDO, index: number) {
        this.discount.intervals.intervalList[index] = interval;
	}
    public removeIntervalAtIndex(index: number) {
        this.discount.intervals.intervalList.splice(index, 1);
    }

    public addDiscount() {
        if (!this.discount.isValid()) {
            return;
        }
        if (this.discount.customerIdList.length >= PriceProductDiscountModalComponent.MaxCustomers) {
            let errMessage = this._appContext.thTranslation.translate("You cannot add more than %custNo% customers on a discount", {
                custNo: PriceProductDiscountModalComponent.MaxCustomers
            });
            this._appContext.toaster.error(errMessage);
            return;
        }
        if (this.discount.constraints.constraintList.length > 0) {
            this.sendDiscount();
            return;
        }
        let title = this._appContext.thTranslation.translate("Warning");
        var content = this._appContext.thTranslation.translate("A discount with no constraints will be applied on all future bookings with this price product. Are you sure you want to add it?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.sendDiscount();
            }, () => { });
    }

    private sendDiscount() {
        this._modalDialogRef.addResult({
            discount: this.discount,
            customerList: this.getCustomerList()
        });
        this.closeDialog();
    }
    private getCustomerList(): CustomerDO[] {
        var customerList: CustomerDO[] = [];
        Object.keys(this.customerMap).forEach(customerId => {
            customerList.push(this.customerMap[customerId]);
        });
        return customerList;
    }
}