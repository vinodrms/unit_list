import {TestUtils} from '../../helpers/TestUtils';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';
import {PriceProductActionUtils} from '../../../core/domain-layer/price-products/save-actions/utils/PriceProductActionUtils';
import {TaxResponseRepoDO} from '../../../core/data-layer/taxes/repositories/ITaxRepository';
import {AddOnProductDO} from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {PriceProductDO, PriceProductStatus, PriceProductAvailability} from '../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductConditionsDO} from '../../../core/data-layer/price-products/data-objects/conditions/PriceProductConditionsDO';
import {PriceProductCancellationPolicyType} from '../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPenaltyType} from '../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import {NoCancellationPolicyDO} from '../../../core/data-layer/price-products/data-objects/conditions/cancellation/NoCancellationPolicyDO';
import {NoCancellationPenaltyDO} from '../../../core/data-layer/price-products/data-objects/conditions/penalty/NoCancellationPenaltyDO';
import {PriceProductConstraintWrapperDO} from '../../../core/data-layer/price-products/data-objects/constraint/PriceProductConstraintWrapperDO';
import {PricePerPersonDO} from '../../../core/data-layer/price-products/data-objects/price/price-per-person/PricePerPersonDO';
import {PriceForFixedNumberOfPersonsDO} from '../../../core/data-layer/price-products/data-objects/price/price-per-person/PriceForFixedNumberOfPersonsDO';
import {PriceProductPriceDO} from '../../../core/data-layer/price-products/data-objects/price/PriceProductPriceDO';
import {PriceProductPriceConfigurationState} from '../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice';
import {PriceProductPriceType} from '../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice';
import {SinglePriceDO} from '../../../core/data-layer/price-products/data-objects/price/single-price/SinglePriceDO';
import {RoomCategoryStatsDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';

import _ = require('underscore');

export interface IPriceProductDataSource {
	getPriceProductList(roomCategoryStatsList: RoomCategoryStatsDO[], taxes: TaxResponseRepoDO, addOnProductList: AddOnProductDO[]): PriceProductDO[];
}

export class DefaultPriceProductBuilder implements IPriceProductDataSource {
	private _testUtils: TestUtils;

	constructor(private _testContext: TestContext) {
		this._testUtils = new TestUtils();
	}

	public getPriceProductList(roomCategoryStatsList: RoomCategoryStatsDO[], taxes: TaxResponseRepoDO, addOnProductList: AddOnProductDO[]): PriceProductDO[] {
		var ppList: PriceProductDO[] = [];
		var taxId = this._testUtils.getRandomListElement(taxes.vatList).id;
		var addOnProductId = this._testUtils.getRandomListElement(addOnProductList).id;
		ppList.push(DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 1", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId, addOnProductId, PriceProductPriceType.PricePerPerson));
		ppList.push(DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 2", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId, addOnProductId, PriceProductPriceType.SinglePrice));
		var confidentialPriceProduct = DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 3 (Private)", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId, addOnProductId, PriceProductPriceType.SinglePrice);
		confidentialPriceProduct.availability = PriceProductAvailability.Confidential;
		ppList.push(confidentialPriceProduct);
		return ppList;
	}
	public static buildPriceProductDO(testContext: TestContext, name: string, roomCategoryStat: RoomCategoryStatsDO, taxId: string, addOnProductId: string, priceType: PriceProductPriceType): PriceProductDO {
		var ppUtils = new PriceProductActionUtils();
		var priceProduct = new PriceProductDO();
		priceProduct.addOnProductIdList = [addOnProductId];
		priceProduct.availability = PriceProductAvailability.Public;
		priceProduct.conditions = new PriceProductConditionsDO();
		priceProduct.conditions.policyType = PriceProductCancellationPolicyType.NoPolicy;
		priceProduct.conditions.policy = new NoCancellationPolicyDO();
		priceProduct.conditions.penaltyType = PriceProductCancellationPenaltyType.NoPenalty;
		priceProduct.conditions.penalty = new NoCancellationPenaltyDO();
		priceProduct.constraints = new PriceProductConstraintWrapperDO();
		priceProduct.constraints.constraintList = [];
		priceProduct.hotelId = testContext.sessionContext.sessionDO.hotel.id;
		priceProduct.lastRoomAvailability = false;
		priceProduct.name = name;
		switch (priceType) {
			case PriceProductPriceType.PricePerPerson:
				priceProduct.price = DefaultPriceProductBuilder.getPricePerPerson([roomCategoryStat]);
				break;
			case PriceProductPriceType.SinglePrice:
				priceProduct.price = DefaultPriceProductBuilder.getPricePerRoomCategory(roomCategoryStat);
				break;
		}
		priceProduct.roomCategoryIdList = [roomCategoryStat.roomCategory.id];
		priceProduct.status = PriceProductStatus.Active;
		priceProduct.taxIdList = [taxId];
		priceProduct.versionId = 0;
		priceProduct.yieldFilterList = [];
		ppUtils.populateDefaultIntervalsOn(priceProduct);
		return priceProduct;
	}

	public static getPricePerPerson(roomCategoryStatList: RoomCategoryStatsDO[]): PriceProductPriceDO {
		var outPrice = new PriceProductPriceDO();
		outPrice.type = PriceProductPriceType.PricePerPerson;
		outPrice.priceConfigurationState = PriceProductPriceConfigurationState.Valid;

		outPrice.priceList = [];
		_.forEach(roomCategoryStatList, (roomCategoryStat: RoomCategoryStatsDO) => {
			var pricePerPerson = new PricePerPersonDO();
			pricePerPerson.roomCategoryId = roomCategoryStat.roomCategory.id;
			pricePerPerson.adultsPriceList = DefaultPriceProductBuilder.getPriceForFixedNumberOfPersonsDOList(roomCategoryStat.capacity.totalCapacity.noAdults);
			pricePerPerson.childrenPriceList = DefaultPriceProductBuilder.getPriceForFixedNumberOfPersonsDOList(roomCategoryStat.capacity.totalCapacity.noChildren + roomCategoryStat.capacity.totalCapacity.noAdults);
			pricePerPerson.firstChildWithoutAdultPrice = 50.0;

			outPrice.priceList.push(pricePerPerson);
		});

		return outPrice;
	}
	private static getPriceForFixedNumberOfPersonsDOList(maxNoOfPersons: number): PriceForFixedNumberOfPersonsDO[] {
		var testUtils = new TestUtils();
		var priceList: PriceForFixedNumberOfPersonsDO[] = [];
		for (var noOfPersons = 1; noOfPersons <= maxNoOfPersons; noOfPersons++) {
			var price = new PriceForFixedNumberOfPersonsDO();
			price.buildFromObject({
				noOfPersons: noOfPersons,
				price: testUtils.getRandomFloatBetween(50, 100)
			});
			priceList.push(price);
		}
		return priceList;
	}

	public static getPricePerRoomCategory(roomCategoryStat: RoomCategoryStatsDO): PriceProductPriceDO {
		var outPrice = new PriceProductPriceDO();
		outPrice.type = PriceProductPriceType.SinglePrice;
		outPrice.priceConfigurationState = PriceProductPriceConfigurationState.Valid;
		var singlePrice = new SinglePriceDO();
		singlePrice.price = 98.21;
		singlePrice.roomCategoryId = roomCategoryStat.roomCategory.id;
		outPrice.priceList = [singlePrice];
		return outPrice;
	}

	public loadPriceProducts(dataSource: IPriceProductDataSource, roomCategoryStatsList: RoomCategoryStatsDO[], taxes: TaxResponseRepoDO, addOnProductList: AddOnProductDO[]): Promise<PriceProductDO[]> {
		return new Promise<PriceProductDO[]>((resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void }) => {
			this.loadPriceProductsCore(resolve, reject, dataSource, roomCategoryStatsList, taxes, addOnProductList);
		});
	}
	private loadPriceProductsCore(resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void },
		dataSource: IPriceProductDataSource, roomCategoryStatsList: RoomCategoryStatsDO[], taxes: TaxResponseRepoDO, addOnProductList: AddOnProductDO[]) {

		var priceProductList: PriceProductDO[] = dataSource.getPriceProductList(roomCategoryStatsList, taxes, addOnProductList);
		var priceProductRepository = this._testContext.appContext.getRepositoryFactory().getPriceProductRepository();

		var ppPromiseList: Promise<PriceProductDO>[] = [];
		priceProductList.forEach((priceProduct: PriceProductDO) => {
			ppPromiseList.push(priceProductRepository.addPriceProduct({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, priceProduct));
		});
		Promise.all(ppPromiseList).then((priceProductList: PriceProductDO[]) => {
			resolve(priceProductList);
		}).catch((error: any) => {
			reject(error);
		});
	}
}