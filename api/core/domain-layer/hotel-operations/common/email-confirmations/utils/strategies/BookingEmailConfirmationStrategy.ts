import {AppContext} from '../../../../../../utils/AppContext';
import {SessionContext} from '../../../../../../utils/SessionContext';

import {IValidationStructure} from '../../../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../../../utils/th-validation/rules/StringValidationRule';

import {IEmailConfirmationStrategy} from '../IEmailConfirmationStrategy';
import {BookingConfirmationEmailSender} from '../../../../../bookings/booking-confirmations/BookingConfirmationEmailSender';
import {BookingDataAggregatorQuery} from '../../../../../bookings/aggregators/BookingDataAggregator';
import {EmailConfirmationDO} from '../../EmailConfirmationDO';

export interface BookingConfirmationEmailParameters {
    groupBookingId: string;
    bookingId: string;
}

export class BookingEmailConfirmationStrategy implements IEmailConfirmationStrategy {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "bookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            }
        ]);
    }
    public send(confirmationDO: EmailConfirmationDO): Promise<boolean> {
        var bookingConfirmationParams: BookingConfirmationEmailParameters = confirmationDO.parameters;

        var emailSender: BookingConfirmationEmailSender = new BookingConfirmationEmailSender(this._appContext, this._sessionContext);
        var bookingQuery: BookingDataAggregatorQuery = {
            groupBookingId: bookingConfirmationParams.groupBookingId,
            bookingIdList: [bookingConfirmationParams.bookingId]
        };
        return emailSender.sendBookingConfirmation(bookingQuery, confirmationDO.emailList);
    }
}