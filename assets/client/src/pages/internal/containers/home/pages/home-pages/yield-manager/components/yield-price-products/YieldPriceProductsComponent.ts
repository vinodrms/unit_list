import {Component, OnInit } from '@angular/core';
import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../common/utils/directives/CustomScroll';

import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe'
import {IYieldManagerDashboardPriceProducts} from '../../YieldManagerDashboardComponent'

@Component({
	selector: 'yield-price-products',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-price-products/template/yield-price-products.html',
	directives: [CustomScroll],
	pipes: [TranslationPipe]
})
export class YieldPriceProductsComponent implements OnInit {
	private _yieldManager : IYieldManagerDashboardPriceProducts;

	constructor() { }

	ngOnInit() { }
	
	public get yield_manager() : IYieldManagerDashboardPriceProducts {
		return this._yieldManager;
	}

	public set yield_manager(yieldManager : IYieldManagerDashboardPriceProducts) {
		this._yieldManager = yieldManager;
	}
	
}