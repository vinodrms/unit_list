import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';

@Injectable()
export class BookingFillDetailsStepService implements IBookingStepService {
	private _stepPath: string[];

	constructor(private _appContext: AppContext) {
		this._stepPath = [this._appContext.thTranslation.translate("Billing Details")];
	}

	public getBookingStepType(): BookingStepType {
		return BookingStepType.FillDetails;
	}
	public canMoveNext(): boolean {
		return false;
	}
	public getStepPath(): string[] {
		return this._stepPath;
	}
	public getErrorString(): string {
		return "";
	}
}