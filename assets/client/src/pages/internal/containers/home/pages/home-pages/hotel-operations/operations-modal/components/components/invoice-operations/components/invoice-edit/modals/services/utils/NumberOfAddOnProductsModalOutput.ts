import {AddOnProductDO} from '../../../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';

export class NumberOfAddOnProductsModalOutput {
    private _aop: AddOnProductDO;
    private _noOfItems: number;

    public get aop(): AddOnProductDO {
        return this._aop;
    }
    public set aop(aop: AddOnProductDO) {
        this._aop = aop;
    }
    public get noOfItems(): number {
        return this._noOfItems;
    }
    public set noOfItems(noOfItems: number) {
        this._noOfItems = noOfItems;
    }      
}