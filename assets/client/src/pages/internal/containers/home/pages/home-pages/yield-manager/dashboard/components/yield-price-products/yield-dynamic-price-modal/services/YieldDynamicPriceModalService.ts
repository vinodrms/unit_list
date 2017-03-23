import { Injectable, ReflectiveInjector } from '@angular/core';
import { PriceProductYieldItemVM } from "../../../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM";
import { DynamicPriceYieldItemDO } from "../../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/DynamicPriceYieldItemDO";
import { ModalDialogRef } from "../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { PriceProductDO } from "../../../../../../../../../../services/price-products/data-objects/PriceProductDO";
import { YieldDynamicPriceModalInput } from "./utils/YieldDynamicPriceModalInput";
import { ThDateDO } from "../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO";
import { AppContext } from "../../../../../../../../../../../../common/utils/AppContext";
import { YieldDynamicPriceModalComponent } from "../YieldDynamicPriceModalComponent";
import { YieldDynamicPriceModalModule } from "../YieldDynamicPriceModalModule";

@Injectable()
export class YieldDynamicPriceModalService {

    constructor(private _appContext: AppContext) { }

    public openDynamicPriceYieldModal(priceProductItem: PriceProductYieldItemVM,
        dynamicPrice: DynamicPriceYieldItemDO, startDate: ThDateDO): Promise<ModalDialogRef<PriceProductDO>> {

        var modalInput = new YieldDynamicPriceModalInput();
        modalInput.ppYieldItemVM = priceProductItem;
        modalInput.dynamicPriceYieldItem = dynamicPrice;
        modalInput.startDate = startDate;

        return this._appContext.modalService.open<any>(YieldDynamicPriceModalModule, YieldDynamicPriceModalComponent, ReflectiveInjector.resolve([
            { provide: YieldDynamicPriceModalInput, useValue: modalInput }
        ]));
    }

}