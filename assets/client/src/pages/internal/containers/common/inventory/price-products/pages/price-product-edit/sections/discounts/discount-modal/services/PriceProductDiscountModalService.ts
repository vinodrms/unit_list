import { Injectable, ReflectiveInjector } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceProductDiscountModalComponent } from '../PriceProductDiscountModalComponent';
import { PriceProductDiscountModalModule } from '../PriceProductDiscountModalModule';
import { PriceProductDiscountDO } from "../../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { CustomerDO } from "../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { PriceProductDiscountModalResult } from "./utils/PriceProductDiscountModalResult";

@Injectable()
export class PriceProductDiscountModalService {
    constructor(private _appContext: AppContext) { }

    public openPriceProductDiscountModal(): Promise<ModalDialogRef<PriceProductDiscountModalResult>> {
        return this._appContext.modalService.open<any>(PriceProductDiscountModalModule, PriceProductDiscountModalComponent, ReflectiveInjector.resolve([]));
    }
}