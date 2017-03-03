import { Injectable, ReflectiveInjector } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceVM } from '../../utils/PriceVM';
import { PriceExceptionModalInput } from './utils/PriceExceptionModalInput';
import { PriceExceptionModalComponent } from '../PriceExceptionModalComponent';
import { PriceExceptionModalModule } from '../PriceExceptionModalModule';

@Injectable()
export class PriceExceptionModalService {
    constructor(private _appContext: AppContext) { }

    public openPriceExceptionModal(priceVM: PriceVM, readonly: boolean): Promise<ModalDialogRef<PriceVM>> {
        let input = new PriceExceptionModalInput(priceVM, readonly);
        return this._appContext.modalService.open<any>(PriceExceptionModalModule, PriceExceptionModalComponent, ReflectiveInjector.resolve([
            { provide: PriceExceptionModalInput, useValue: input }
        ]));
    }
}