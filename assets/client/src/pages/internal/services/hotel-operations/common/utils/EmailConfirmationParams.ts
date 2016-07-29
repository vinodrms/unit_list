export enum EmailConfirmationType {
    Booking,
    Invoice
}

export class EmailConfirmationParams {
    type: EmailConfirmationType;
    emailList: string[];
    parameters: any;
}