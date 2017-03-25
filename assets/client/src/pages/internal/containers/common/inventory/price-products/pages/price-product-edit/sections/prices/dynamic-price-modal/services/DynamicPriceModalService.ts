import { Injectable, ReflectiveInjector } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { DynamicPriceVM } from "../../utils/DynamicPriceVM";
import { DynamicPriceModalInput } from "./utils/DynamicPriceModalInput";
import { DynamicPriceModalModule } from "../DynamicPriceModalModule";
import { DynamicPriceModalComponent } from "../DynamicPriceModalComponent";
import { PriceProductPriceType } from "../../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";

@Injectable()
export class DynamicPriceModalService {
    constructor(private _appContext: AppContext) { }

    public openEditDynamicPriceModal(dynamicPriceVM: DynamicPriceVM, readonly: boolean): Promise<ModalDialogRef<DynamicPriceVM>> {
        let input = new DynamicPriceModalInput(dynamicPriceVM, null, readonly);
        return this._appContext.modalService.open<any>(DynamicPriceModalModule, DynamicPriceModalComponent, ReflectiveInjector.resolve([
            { provide: DynamicPriceModalInput, useValue: input }
        ]));
    }

    public openNewDynamicPriceModal(priceType: PriceProductPriceType) {
        let input = new DynamicPriceModalInput(null, priceType);
        return this._appContext.modalService.open<any>(DynamicPriceModalModule, DynamicPriceModalComponent, ReflectiveInjector.resolve([
            { provide: DynamicPriceModalInput, useValue: input }
        ]));
    }
}