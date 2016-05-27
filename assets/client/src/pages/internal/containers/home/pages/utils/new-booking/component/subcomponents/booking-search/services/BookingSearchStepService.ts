import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';

@Injectable()
export class BookingSearchStepService implements IBookingStepService {
	private _stepPath: string[];

	constructor(private _appContext: AppContext) {
		this._stepPath = [this._appContext.thTranslation.translate("Search")];
	}

	public getBookingStepType(): BookingStepType {
		return BookingStepType.Search;
	}
	public canMoveNext(): boolean {
		return true;
	}
	public getStepPath(): string[] {
		return this._stepPath;
	}
	public getErrorString(): string {
		return "";
	}
}