import { Component } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { DynamicPriceVM } from "../utils/DynamicPriceVM";
import { DynamicPriceModalInput } from "./services/utils/DynamicPriceModalInput";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";

@Component({
    selector: 'dynamic-price-modal',
    templateUrl: "/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/dynamic-price-modal/template/dynamic-price-modal.html"
})
export class DynamicPriceModalComponent extends BaseComponent implements ICustomModalComponent {
    dynamicPriceVM: DynamicPriceVM;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<DynamicPriceVM>,
        private _modalInput?: DynamicPriceModalInput) {
        super();
        
        this.dynamicPriceVM = this.newDynamicPrice? 
            new DynamicPriceVM(PriceProductPriceType.PricePerPerson): 
            this._modalInput.dynamicPriceVM;   
    }

    public get newDynamicPrice(): boolean {
        return this._appContext.thUtils.isUndefinedOrNull(this._modalInput.dynamicPriceVM);
    }

    public get readonly(): boolean {
        return this._modalInput.readOnly;
    }

    public get isValid(): boolean {
        return this.textNotNullOrEmpty(this.dynamicPriceVM.name);
    }

    private textNotNullOrEmpty(text: string): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(text) && text.length > 0 && text.trim() != '';
    }

    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public removeDynamicPrice() {
        let title = this._appContext.thTranslation.translate("Warning");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove this dynamic daily rate?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this._modalDialogRef.addResult(null);
                this.closeDialog();
            }, () => { 
                this.closeDialog();
            });
    }
    
    public submitChanges() {
        this._modalDialogRef.addResult(this.dynamicPriceVM);
        this.closeDialog();
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    
}