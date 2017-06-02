import { EmailDistributionDO } from "../../../../containers/home/pages/utils/new-booking/services/data-objects/AddBookingItemsDO";

export enum EmailConfirmationType {
    Booking,
    Invoice
}

export class EmailConfirmationParams {
    type: EmailConfirmationType;
    emailList: EmailDistributionDO[];
    parameters: any;
}