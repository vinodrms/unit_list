import { Injectable, ReflectiveInjector } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceProductDiscountModalComponent } from '../PriceProductDiscountModalComponent';
import { PriceProductDiscountModalModule } from '../PriceProductDiscountModalModule';
import { PriceProductDiscountDO } from "../../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";

@Injectable()
export class PriceProductDiscountModalService {
    constructor(private _appContext: AppContext) { }

    public openPriceProductDiscountModal(): Promise<ModalDialogRef<PriceProductDiscountDO>> {
        return this._appContext.modalService.open<any>(PriceProductDiscountModalModule, PriceProductDiscountModalComponent, ReflectiveInjector.resolve([]));
    }
}