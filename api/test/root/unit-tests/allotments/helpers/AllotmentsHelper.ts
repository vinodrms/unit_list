import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';
import {CustomerDO} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {PriceProductDO} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO, ThMonth} from '../../../../../core/utils/th-dates/data-objects/ThDateDO';
import {ISOWeekDayUtils, ISOWeekDay} from '../../../../../core/utils/th-dates/data-objects/ISOWeekDay';
import {ThDateUtils} from '../../../../../core/utils/th-dates/ThDateUtils';
import {SaveAllotmentItemDO} from '../../../../../core/domain-layer/allotments/SaveAllotmentItemDO';
import {AllotmentStatus} from '../../../../../core/data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentAvailabilityDO} from '../../../../../core/data-layer/allotments/data-objects/availability/AllotmentAvailabilityDO';
import {AllotmentAvailabilityForDayDO} from '../../../../../core/data-layer/allotments/data-objects/availability/AllotmentAvailabilityForDayDO';
import {AllotmentConstraintWrapperDO} from '../../../../../core/data-layer/allotments/data-objects/constraint/AllotmentConstraintWrapperDO';
import {AllotmentConstraintDO} from '../../../../../core/data-layer/allotments/data-objects/constraint/AllotmentConstraintDO';
import {AllotmentConstraintType} from '../../../../../core/data-layer/allotments/data-objects/constraint/IAllotmentConstraint';
import {ReleaseTimeInDaysConstraintDO} from '../../../../../core/data-layer/allotments/data-objects/constraint/constraints/ReleaseTimeInDaysConstraintDO';

import moment = require("moment");
import _ = require("underscore");

export class AllotmentsHelper {
	public static IntervalNumberOfDays: number = 300;

	private _thDateUtils: ThDateUtils;
	private _testUtils: TestUtils;

	constructor(private _dataBuilder: DefaultDataBuilder, private _testContext: TestContext) {
		this._testUtils = new TestUtils();
		this._thDateUtils = new ThDateUtils();
	}

	getSaveAllotmentItemDO(customer: CustomerDO, priceProduct: PriceProductDO): SaveAllotmentItemDO {
		var allotmentItem: SaveAllotmentItemDO = {
			status: AllotmentStatus.Active,
			customerId: customer.id,
			priceProductId: priceProduct.id,
			roomCategoryId: priceProduct.roomCategoryIdList[0],
			openInterval: this.getThDateIntervalDO(),
			availability: this.getAllotmentAvailabilityDO(),
			constraints: this.getAllotmentConstraintWrapperDO(),
			notes: "test"
		}
		return allotmentItem;
	}
	private getThDateIntervalDO(): ThDateIntervalDO {
		var startDate = this._thDateUtils.convertMomentToThDateDO(moment());
		var endDate = startDate.buildPrototype();
		endDate = this._thDateUtils.addDaysToThDateDO(endDate, AllotmentsHelper.IntervalNumberOfDays);
		return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate)
	}
	private getAllotmentAvailabilityDO(): AllotmentAvailabilityDO {
		var availability = new AllotmentAvailabilityDO();
		availability.availabilityForDayList = [];
		var isoWeekDayList = (new ISOWeekDayUtils()).getISOWeekDayList();
		_.forEach(isoWeekDayList, (isoWeekDay: ISOWeekDay) => {
			var availabilityForDay = new AllotmentAvailabilityForDayDO();
			availabilityForDay.isoWeekDay = isoWeekDay;
			availabilityForDay.availableCount = this.getNoOfAvailableRoomsForDay(isoWeekDay);
			availability.availabilityForDayList.push(availabilityForDay);
		});
		return availability;
	}
	private getAllotmentConstraintWrapperDO(): AllotmentConstraintWrapperDO {
		var constraintsWrapper = new AllotmentConstraintWrapperDO();

		var releaseTimeInDaysConstraint = new ReleaseTimeInDaysConstraintDO();
		releaseTimeInDaysConstraint.noOfDays = 7;
		var constraintDO = new AllotmentConstraintDO();
		constraintDO.constraint = releaseTimeInDaysConstraint;
		constraintDO.type = AllotmentConstraintType.ReleaseTimeInDays;

		constraintsWrapper.constraintList = [
			constraintDO
		];
		return constraintsWrapper;
	}
	private getNoOfAvailableRoomsForDay(isoWeekDay: ISOWeekDay): number {
		if (isoWeekDay === ISOWeekDay.Saturday || isoWeekDay === ISOWeekDay.Sunday) {
			return 7;
		}
		return 5;
	}
}