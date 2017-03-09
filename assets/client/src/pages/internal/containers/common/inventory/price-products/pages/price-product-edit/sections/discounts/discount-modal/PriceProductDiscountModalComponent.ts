import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceProductDiscountDO } from "../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { PriceProductConstraintWrapperDO } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintWrapperDO";
import { PriceProductConstraintFactory } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintFactory";

@Component({
    selector: 'price-product-discount-modal',
    templateUrl: "/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/discounts/discount-modal/template/price-product-discount-modal.html"
})
export class PriceProductDiscountModalComponent extends BaseComponent implements ICustomModalComponent {
    public static MaxDiscountsNo = 10;
    private _constraintFactory: PriceProductConstraintFactory;

    discount: PriceProductDiscountDO;
    discountIdList: number[] = [];

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<PriceProductDiscountDO>) {
        super();
        this._constraintFactory = new PriceProductConstraintFactory();
        this.discount = new PriceProductDiscountDO();
        this.discount.constraints = new PriceProductConstraintWrapperDO();
        this.discount.constraints.constraintList = [];
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

    public createNewConstraint() {
        if (this.discountIdList.length > PriceProductDiscountModalComponent.MaxDiscountsNo) {
            let errorMessage = this._appContext.thTranslation.translate("You cannot add more than 10 constraints on the same discount");
            this._appContext.toaster.error(errorMessage);
            return;
        }
        this.discountIdList.push(this.discountIdList.length);
        let dummyConstraint = this._constraintFactory.getDefaultConstraintDO();
        this.discount.constraints.constraintList.push(dummyConstraint);
    }
    public removeConstraintAtIndex(index: number) {
        this.discountIdList.splice(index, 1);
        this.discount.constraints.constraintList.splice(index, 1);
    }

    public addDiscount() {
        if (!this.discount.isValid()) {
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
        this._modalDialogRef.addResult(this.discount);
        this.closeDialog();
    }
}