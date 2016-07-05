import {Observable} from 'rxjs/Observable';
import {BookingStepType} from './BookingStepType';

export interface ILastBookingStepService {
    addBookings(): Observable<boolean>;
    getBookingStepType(): BookingStepType;
}