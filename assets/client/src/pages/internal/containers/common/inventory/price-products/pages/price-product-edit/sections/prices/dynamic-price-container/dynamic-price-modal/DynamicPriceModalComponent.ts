import { Component } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { AppContext } from "../../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { DynamicPriceVM } from "../../utils/DynamicPriceVM";
import { DynamicPriceModalInput } from "./services/utils/DynamicPriceModalInput";
import { PriceProductPriceType } from "../../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";

@Component({
    selector: 'dynamic-price-modal',
    templateUrl: "/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/dynamic-price-container/dynamic-price-modal/template/dynamic-price-modal.html"
})
export class DynamicPriceModalComponent extends BaseComponent implements ICustomModalComponent {
    readonly: boolean;
    dynamicPriceVM: DynamicPriceVM;
    
    buttonLabel: string;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<DynamicPriceVM>,
        modalInput?: DynamicPriceModalInput) {
        super();
        
        if(this._appContext.thUtils.isUndefinedOrNull(modalInput)) {
            this.dynamicPriceVM = new DynamicPriceVM(PriceProductPriceType.PricePerPerson);
            this.buttonLabel = "Add DDR";
            this.readonly = false;
        }
        else {
            this.dynamicPriceVM = modalInput.dynamicPriceVM;
            this.buttonLabel = "Save DDR";
            this.readonly = modalInput.readonly;
        }
        
    }

    public closeDialog() {
        if (!this.readonly) {
            this._modalDialogRef.addResult(this.dynamicPriceVM);
        }
        this._modalDialogRef.closeForced();
    }

    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    private saveDynamicDailyRate() {
        this.closeDialog();
    }
}