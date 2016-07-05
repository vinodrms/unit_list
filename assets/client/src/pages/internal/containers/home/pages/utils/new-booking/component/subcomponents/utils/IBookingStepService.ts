import {BookingStepType} from './BookingStepType';

export interface IBookingStepService {
	getBookingStepType(): BookingStepType;
	canMoveNext(): boolean;
	getStepPath(): string[];
	getErrorString(): string;
	didAppear();
}