import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';
import {StringOccurenciesIndexer} from '../../../../../../../../../../../common/utils/indexers/StringOccurenciesIndexer';
import {RoomCategoryDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {PriceProductValidationRuleDataDO, PriceProductValidationRuleResult} from '../../../../../../../../../services/price-products/data-objects/constraint/validation/IPriceProductValidationRule';
import {BookingItemVM} from '../../../../services/search/view-models/BookingItemVM';
import {BookingCartService} from '../../../../services/search/BookingCartService';

@Injectable()
export class BookingSearchStepService implements IBookingStepService {
	private _stepPath: string[];

	private _canGoToNextStep: boolean = false;
	private _errorString: string = "";

	constructor(private _appContext: AppContext) {
		this._stepPath = [this._appContext.thTranslation.translate("Search")];
	}

	public getBookingStepType(): BookingStepType {
		return BookingStepType.Search;
	}
	public canMoveNext(): boolean {
		return this._canGoToNextStep;
	}
	public getStepPath(): string[] {
		return this._stepPath;
	}
	public getErrorString(): string {
		return this._errorString;
	}

	public checkBookingCartValidity(bookingCartService: BookingCartService, roomCategoryList: RoomCategoryDO[]) {
		var indexedNumberOfRoomCategories: StringOccurenciesIndexer = this.getRoomCategoryIdOccurenciesStringIndexer(bookingCartService);

		var bookingCartIsValid: boolean = true;
		var bookingCartMessage: string = "";
		_.forEach(bookingCartService.bookingItemVMList, (bookingItem: BookingItemVM) => {
			var validationResult: PriceProductValidationRuleResult = bookingItem.priceProduct.constraints.appliesOn({
				thTranslation: this._appContext.thTranslation,
				roomCategoryList: roomCategoryList,
				indexedNumberOfRoomCategories: indexedNumberOfRoomCategories,
				roomCategoryIdListFromPriceProduct: bookingItem.priceProduct.roomCategoryIdList
			});
			if (!validationResult.valid) {
				bookingCartIsValid = false;
				bookingCartMessage = validationResult.errorMessage;
			}
		});
		this._canGoToNextStep = bookingCartIsValid;
		this._errorString = bookingCartMessage;
	}
	private getRoomCategoryIdOccurenciesStringIndexer(bookingCartService: BookingCartService): StringOccurenciesIndexer {
		var roomCategoryIdList: string[] = _.map(bookingCartService.bookingItemVMList, (bookingItem: BookingItemVM) => {
			return bookingItem.transientBookingItem.roomCategoryId;
		});
		return new StringOccurenciesIndexer(roomCategoryIdList);
	}
}