import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';
import {TestUtils} from '../../helpers/TestUtils';
import {ThDateUtils} from '../../../core/utils/th-dates/ThDateUtils';
import {ISOWeekDayUtils, ISOWeekDay} from '../../../core/utils/th-dates/data-objects/ISOWeekDay';
import {ThDateIntervalDO} from '../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {PriceProductDO} from '../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {CustomerDO} from '../../../core/data-layer/customers/data-objects/CustomerDO';
import {AllotmentDO, AllotmentStatus} from '../../../core/data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentAvailabilityDO} from '../../../core/data-layer/allotments/data-objects/availability/AllotmentAvailabilityDO';
import {AllotmentAvailabilityForDayDO} from '../../../core/data-layer/allotments/data-objects/availability/AllotmentAvailabilityForDayDO';
import {AllotmentConstraintWrapperDO} from '../../../core/data-layer/allotments/data-objects/constraint/AllotmentConstraintWrapperDO';

import moment = require('moment');
import _ = require("underscore");

export interface IAllotmentDataSource {
	getAllotmentList(priceProductList: PriceProductDO[], customerList: CustomerDO[]): AllotmentDO[];
}

export class DefaultAllotmentBuilder implements IAllotmentDataSource {
	private _testUtils = new TestUtils();
	constructor(private _testContext: TestContext) {
	}
	public getAllotmentList(priceProductList: PriceProductDO[], customerList: CustomerDO[]): AllotmentDO[] {
		var allotmentList: AllotmentDO[] = [];
		var customer = this._testUtils.getRandomListElement(customerList);
		var priceProduct = _.find(priceProductList, (innerPriceProduct: PriceProductDO) => {
			return _.contains(customer.priceProductDetails.priceProductIdList, innerPriceProduct.id);
		});
		allotmentList.push(DefaultAllotmentBuilder.buildAllotmentDO(this._testContext, customer, priceProduct));

		var anotherCustomer = this._testUtils.getRandomListElement(customerList);
		var anotherPriceProduct = _.find(priceProductList, (innerPriceProduct: PriceProductDO) => {
			return _.contains(anotherCustomer.priceProductDetails.priceProductIdList, innerPriceProduct.id);
		});
		allotmentList.push(DefaultAllotmentBuilder.buildAllotmentDO(this._testContext, anotherCustomer, anotherPriceProduct));

		return allotmentList;
	}
	public static buildAllotmentDO(testContext: TestContext, customer: CustomerDO, priceProduct: PriceProductDO): AllotmentDO {
		var testUtils = new TestUtils();
		var thDateUtils = new ThDateUtils();

		var allotment = new AllotmentDO();
		allotment.hotelId = testContext.sessionContext.sessionDO.hotel.id;
		allotment.versionId = 0;
		allotment.status = AllotmentStatus.Active;
		allotment.customerId = customer.id;
		allotment.priceProductId = priceProduct.id;
		allotment.roomCategoryId = testUtils.getRandomListElement(priceProduct.roomCategoryIdList);

		var startDate = thDateUtils.convertMomentToThDateDO(moment());
		var endDate = startDate.buildPrototype();
		endDate = thDateUtils.addDaysToThDateDO(endDate, 1);
		allotment.openInterval = ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);

		allotment.availability = new AllotmentAvailabilityDO();
		allotment.availability.availabilityForDayList = [];
		var isoWeekDayList = (new ISOWeekDayUtils()).getISOWeekDayList();
		_.forEach(isoWeekDayList, (isoWeekDay: ISOWeekDay) => {
			var availabilityForDay = new AllotmentAvailabilityForDayDO();
			availabilityForDay.isoWeekDay = isoWeekDay;
			availabilityForDay.availableCount = 10;
			allotment.availability.availabilityForDayList.push(availabilityForDay);
		});
		var expiryDate = thDateUtils.addDaysToThDateDO(allotment.openInterval.getEnd().buildPrototype(), 1);
		allotment.expiryUtcTimestamp = expiryDate.getUtcTimestamp();

		allotment.constraints = new AllotmentConstraintWrapperDO();
		allotment.constraints.constraintList = [];

		allotment.notes = "";
		return allotment;
	}

	public loadAllotments(dataSource: IAllotmentDataSource, priceProductList: PriceProductDO[], customerList: CustomerDO[]): Promise<AllotmentDO[]> {
		return new Promise<AllotmentDO[]>((resolve: { (result: AllotmentDO[]): void }, reject: { (err: ThError): void }) => {
			this.loadAllotmentsCore(resolve, reject, dataSource, priceProductList, customerList);
		});
	}
	private loadAllotmentsCore(resolve: { (result: AllotmentDO[]): void }, reject: { (err: ThError): void },
		dataSource: IAllotmentDataSource, priceProductList: PriceProductDO[], customerList: CustomerDO[]) {

		var allotmentList: AllotmentDO[] = dataSource.getAllotmentList(priceProductList, customerList);
		var allotmentRepository = this._testContext.appContext.getRepositoryFactory().getAllotmentRepository();

		var allPromiseList: Promise<AllotmentDO>[] = [];
		allotmentList.forEach((allotment: AllotmentDO) => {
			allPromiseList.push(allotmentRepository.addAllotment({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, allotment));
		});
		Promise.all(allPromiseList).then((createdAllotmentList: AllotmentDO[]) => {
			resolve(createdAllotmentList);
		}).catch((error: any) => {
			reject(error);
		});
	}
}