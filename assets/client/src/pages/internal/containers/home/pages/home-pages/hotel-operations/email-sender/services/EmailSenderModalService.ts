import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerDO} from '../../../../../../../services/customers/data-objects/CustomerDO';
import {EmailConfirmationParams, EmailConfirmationType} from '../../../../../../../services/hotel-operations/common/utils/EmailConfirmationParams';
import {EmailSenderModalInput} from './utils/EmailSenderModalInput';
import {EmailSenderModalComponent} from '../EmailSenderModalComponent';

@Injectable()
export class EmailSenderModalService {
    constructor(private _appContext: AppContext) { }

    public sendBookingConfirmation(customerList: CustomerDO[], groupBookingId: string, bookingId: string): Promise<ModalDialogRef<boolean>> {
        var emailConfirmationParams = new EmailConfirmationParams();
        emailConfirmationParams.type = EmailConfirmationType.Booking;
        emailConfirmationParams.parameters = {
            groupBookingId: groupBookingId,
            bookingId: bookingId
        }
        return this.sendConfirmation(customerList, emailConfirmationParams);
    }

    private sendConfirmation(customerList: CustomerDO[], emailConfirmationParams: EmailConfirmationParams): Promise<ModalDialogRef<boolean>> {
        var emailSenderModalInput = new EmailSenderModalInput(customerList, emailConfirmationParams);
        return this._appContext.modalService.open<any>(<any>EmailSenderModalComponent, ReflectiveInjector.resolve([
            provide(EmailSenderModalInput, { useValue: emailSenderModalInput })
        ]));
    }
}