
import { DynamicPriceVMContainer } from "./DynamicPriceVMContainer";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { PriceProductVM } from "../../../../../../../../../services/price-products/view-models/PriceProductVM";
import { RoomCategoryStatsDO } from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO";
import { DynamicPriceVM } from "./DynamicPriceVM";

export class PricingContainer {
    pricePerPersonContainer: DynamicPriceVMContainer;
	singlePriceContainer: DynamicPriceVMContainer;

    constructor(private _appContext: AppContext) {
        this.pricePerPersonContainer = new DynamicPriceVMContainer(PriceProductPriceType.PricePerPerson);
		this.singlePriceContainer = new DynamicPriceVMContainer(PriceProductPriceType.SinglePrice);
    }

    public updateCurrentPriceFrom(priceProductVM: PriceProductVM) {
        this.singlePriceContainer.initializeFrom(priceProductVM.priceProduct.price);
		this.pricePerPersonContainer.initializeFrom(priceProductVM.priceProduct.price);
    }

    public updateFromRoomCategoryStatsList(currentRoomCategoryStatsList: RoomCategoryStatsDO[]) {
        this.pricePerPersonContainer.updateFromRoomCategoryStatsList(currentRoomCategoryStatsList);
		this.singlePriceContainer.updateFromRoomCategoryStatsList(currentRoomCategoryStatsList);
    }

    public removeDynamicPrice(indexToRemove: number) {
        this.pricePerPersonContainer.dynamicPriceVMList.splice(indexToRemove, 1);
		this.singlePriceContainer.dynamicPriceVMList.splice(indexToRemove, 1);
    }
    
    public updateNameAndDescriptionOnDynamicPrice(indexToUpdate: number, updatedDynamicPrice: DynamicPriceVM) {
        this.pricePerPersonContainer.dynamicPriceVMList[indexToUpdate].name = updatedDynamicPrice.name;
        this.pricePerPersonContainer.dynamicPriceVMList[indexToUpdate].description = updatedDynamicPrice.description;

        this.singlePriceContainer.dynamicPriceVMList[indexToUpdate].name = updatedDynamicPrice.name;
        this.singlePriceContainer.dynamicPriceVMList[indexToUpdate].description = updatedDynamicPrice.description;
    }

    public addDynamicPrice(newDynamicPrice: DynamicPriceVM) {
        let firstPricePerPersonDynamicPriceClone: DynamicPriceVM = this.pricePerPersonContainer.dynamicPriceVMList[0].buildPrototype();
		firstPricePerPersonDynamicPriceClone.name = newDynamicPrice.name;
		firstPricePerPersonDynamicPriceClone.description = newDynamicPrice.description;
        firstPricePerPersonDynamicPriceClone.resetPrices();

        let firstSinglePriceDynamicPriceClone: DynamicPriceVM = this.singlePriceContainer.dynamicPriceVMList[0].buildPrototype();
		firstSinglePriceDynamicPriceClone.name = newDynamicPrice.name;
		firstSinglePriceDynamicPriceClone.description = newDynamicPrice.description;
        firstSinglePriceDynamicPriceClone.resetPrices();
        
		this.pricePerPersonContainer.dynamicPriceVMList.push(firstPricePerPersonDynamicPriceClone);
        this.singlePriceContainer.dynamicPriceVMList.push(firstSinglePriceDynamicPriceClone);
    }

    public hasAtLeastADynamicPriceConfigured(): boolean {
        return this.pricePerPersonContainer.dynamicPriceVMList.length == 1 || this.singlePriceContainer.dynamicPriceVMList.length == 1;
    }

    public getSelectedPricingContainer(isPricePerNumberOfPersons: boolean): DynamicPriceVMContainer {
        if (isPricePerNumberOfPersons) {
			return this.pricePerPersonContainer;
		}
		return this.singlePriceContainer;
    }
}
