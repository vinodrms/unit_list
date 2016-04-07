import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {BedsDO} from './data-objects/BedsDO';
import {BedVM} from './view-models/BedVM';
import {HotelAggregatorService} from '../hotel/HotelAggregatorService';

@Injectable()
export class BedsService extends ALazyLoadRequestService<BedVM> {
    
    // constructor(appContext: AppContext,
	// 	private _bedTemplatesService: BedTemplatesService,
	// 	private _hotelAggregatorService: HotelAggregatorService) {
	// 	super(appContext, ThServerApi.AddOnProductsCount, ThServerApi.AddOnProducts);
	// }
    
    protected parsePageDataCore(pageDataObject: Object): Observable<BedVM[]> {
		return null;
	}
	public searchByText(text: string) {
		this.updateSearchCriteria({
			name: text
		});
	}
}