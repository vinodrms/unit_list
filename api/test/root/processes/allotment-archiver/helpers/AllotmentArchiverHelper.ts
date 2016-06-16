import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {ThDateUtils} from '../../../../../core/utils/th-dates/ThDateUtils';
import {ThTimestampDO} from '../../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {ThDateIntervalDO} from '../../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {IAllotmentDataSource, DefaultAllotmentBuilder} from '../../../../db-initializers/builders/DefaultAllotmentBuilder';
import {PriceProductDO} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {CustomerDO} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {AllotmentDO} from '../../../../../core/data-layer/allotments/data-objects/AllotmentDO';

import moment = require('moment');
import _ = require('underscore');

export class AllotmentArchiverHelper implements IAllotmentDataSource {
	private _testUtils: TestUtils;

	constructor(private _testContext: TestContext, private _thDateUtils: ThDateUtils) {
		this._testUtils = new TestUtils
	}

	public getAllotmentList(priceProductList: PriceProductDO[], customerList: CustomerDO[]): AllotmentDO[] {
		var customer = this._testUtils.getRandomListElement(customerList);
		var priceProduct = _.find(priceProductList, (innerPriceProduct: PriceProductDO) => {
			return _.contains(customer.priceProductDetails.priceProductIdList, innerPriceProduct.id);
		});
		var allotment = DefaultAllotmentBuilder.buildAllotmentDO(this._testContext, customer, priceProduct);

		var startDate = this._thDateUtils.convertMomentToThDateDO(moment());
		startDate = this._thDateUtils.addDaysToThDateDO(startDate, -2);
		var endDate = startDate.buildPrototype();
		endDate = this._thDateUtils.addDaysToThDateDO(endDate, 1);
		allotment.openInterval = ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);

		var expiryDate = this._thDateUtils.addDaysToThDateDO(allotment.openInterval.getEnd().buildPrototype(), 1);
		allotment.expiryUtcTimestamp = expiryDate.getUtcTimestamp();

		return [allotment];
	}

	public getTimestampThatShouldNotArchive(dataBuilder: DefaultDataBuilder): ThTimestampDO {
		return this.getTimestamp(dataBuilder, -1);
	}
	public getTimestampThatShouldArchive(dataBuilder: DefaultDataBuilder): ThTimestampDO {
		return this.getTimestamp(dataBuilder, 0);
	}

	private getTimestamp(dataBuilder: DefaultDataBuilder, dayOffset: number): ThTimestampDO {
		var timestamp = ThTimestampDO.buildThTimestampForTimezone(dataBuilder.defaultTimezone);
		timestamp.thDateDO = this._thDateUtils.convertMomentToThDateDO(moment());
		timestamp.thDateDO = this._thDateUtils.addDaysToThDateDO(timestamp.thDateDO, dayOffset);
		timestamp.thHourDO.hour = 0;
		timestamp.thHourDO.minute = 0;
		return timestamp;
	}

	public getAllotmentIdList(allotmentList: AllotmentDO[]): string[] {
		return _.map(allotmentList, (allotment: AllotmentDO) => {
			return allotment.id;
		});
	}
}