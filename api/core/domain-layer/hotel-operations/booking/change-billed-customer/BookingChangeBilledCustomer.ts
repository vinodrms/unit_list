import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { BookingChangeBilledCustomerDO } from "./BookingChangeBilledCustomerDO";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ValidationResultParser } from "../../../common/ValidationResultParser";
import { BookingWithDependenciesLoader } from "../utils/BookingWithDependenciesLoader";

import _ = require('underscore');

export class BookingChangeBilledCustomer {
    private _changeBilledCustomerDO: BookingChangeBilledCustomerDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        
    }

    public changeBilledCustomer(changeBilledCustomerDO: BookingChangeBilledCustomerDO): Promise<BookingDO> {
        this._changeBilledCustomerDO = changeBilledCustomerDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeBilledCustomerCore(resolve, reject);
        });
    }

    private changeBilledCustomerCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeBilledCustomerDO.getValidationStructure().validateStructure(this._changeBilledCustomerDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._changeBilledCustomerDO);
            parser.logAndReject("Error validating change billed customer fields", reject);
            return;
        }

        var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
    }
}