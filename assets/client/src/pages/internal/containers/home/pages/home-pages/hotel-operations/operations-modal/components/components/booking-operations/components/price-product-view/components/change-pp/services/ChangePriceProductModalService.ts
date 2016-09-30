import { Injectable, ReflectiveInjector } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { BookingDO } from '../../../../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { CustomersDO } from '../../../../../../../../../../../../../../services/customers/data-objects/CustomersDO';
import { ChangePriceProductModalComponent } from '../ChangePriceProductModalComponent';
import { ChangePriceProductModalModule } from '../ChangePriceProductModalModule';
import { ChangePriceProductModalInput } from './ChangePriceProductModalInput';

@Injectable()
export class ChangePriceProductModalService {
    constructor(private _appContext: AppContext) { }

    public changeBookingPriceProduct(booking: BookingDO, customersContainer: CustomersDO): Promise<ModalDialogRef<BookingDO>> {
        var modalInput = new ChangePriceProductModalInput(booking, customersContainer);
        return this._appContext.modalService.open<BookingDO>(ChangePriceProductModalModule, ChangePriceProductModalComponent, ReflectiveInjector.resolve([
            { provide: ChangePriceProductModalInput, useValue: modalInput }
        ]));
    }
}