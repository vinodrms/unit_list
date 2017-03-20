import {Observable} from 'rxjs/Observable';
import { BookingStepType } from './BookingStepType';
import { BookingDO } from "../../../../../../../../services/bookings/data-objects/BookingDO";

export interface ILastBookingStepService {
    addBookings(): Observable<BookingDO[]>;
    getBookingStepType(): BookingStepType;
}