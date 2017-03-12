import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { PriceProductDiscountDO } from "../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { PriceProductConstraintContainer } from "../../constraints/constraints-list/utils/PriceProductConstraintContainer";
import { PriceProductConstraintWrapperDO } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintWrapperDO";
import { PriceProductDiscountVM } from "./PriceProductDiscountVM";

export class PriceProductDiscountContainer {
    private _currentIndex: number;
    private _discountVMList: PriceProductDiscountVM[];

    constructor(private _appContext: AppContext) { }

    public initFromDiscountList(discountDOList: PriceProductDiscountDO[]) {
        this._currentIndex = 0;
        this._discountVMList = [];
        _.forEach(discountDOList, (discountDO: PriceProductDiscountDO) => {
            this.addDiscount(discountDO);
        });
    }
    public addDiscount(discountDO: PriceProductDiscountDO) {
        var discountVM = new PriceProductDiscountVM();
        discountVM.index = this._currentIndex++;
        discountVM.name = discountDO.name;
        discountVM.value = discountDO.value;
        discountVM.constraintContainer = new PriceProductConstraintContainer(this._appContext);
        discountVM.constraintContainer.initFromConstraintList(discountDO.constraints.constraintList);
        this._discountVMList.push(discountVM);
    }

    public removeDiscount(discountVMToRemove: PriceProductDiscountVM) {
        let title = this._appContext.thTranslation.translate("Remove Discount");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove %name%?", { name: discountVMToRemove.name });
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.removeDiscountCore(discountVMToRemove);
            }, () => { });
    }
    private removeDiscountCore(discountVMToRemove: PriceProductDiscountVM) {
        this._discountVMList = _.filter(this._discountVMList, (existingDiscountVM: PriceProductDiscountVM) => { return existingDiscountVM.index !== discountVMToRemove.index });
    }

    public get discountVMList(): PriceProductDiscountVM[] {
        return this._discountVMList;
    }
    public set discountVMList(discountVMList: PriceProductDiscountVM[]) {
        this._discountVMList = discountVMList;
    }

    public getDiscountDOList(): PriceProductDiscountDO[] {
        return _.map(this._discountVMList, (discountVM: PriceProductDiscountVM) => {
            let discountDO = new PriceProductDiscountDO();
            discountDO.name = discountVM.name;
            discountDO.value = discountVM.value;
            discountDO.constraints = new PriceProductConstraintWrapperDO();
            discountDO.constraints.constraintList = discountVM.constraintContainer.getConstraintDOList();
            return discountDO;
        });
    }

    public isEmpty(): boolean {
        return !_.isArray(this._discountVMList) || this._discountVMList.length == 0;
    }
}