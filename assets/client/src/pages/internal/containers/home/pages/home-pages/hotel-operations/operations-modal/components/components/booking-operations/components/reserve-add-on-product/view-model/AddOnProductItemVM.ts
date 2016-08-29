import {AddOnProductDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';

export class AddOnProductItemVM {
    private _addOnProduct: AddOnProductDO;
    private _noAdded: number;
    private _totalPriceString: string;

    public get addOnProduct(): AddOnProductDO {
        return this._addOnProduct;
    }
    public set addOnProduct(addOnProduct: AddOnProductDO) {
        this._addOnProduct = addOnProduct;
    }
    public get noAdded(): number {
        return this._noAdded;
    }
    public set noAdded(noAdded: number) {
        this._noAdded = noAdded;
    }
    public get totalPriceString(): string {
        return this._totalPriceString;
    }
    public set totalPriceString(totalPriceString: string) {
        this._totalPriceString = totalPriceString;
    }

    public updateTotalPrice(ccySymbol: string) {
        var totalPrice: number = this._addOnProduct.price * this._noAdded;
        this._totalPriceString = totalPrice + " " + ccySymbol;
    }

    public buildPrototype(): AddOnProductItemVM {
        var itemVM = new AddOnProductItemVM();
        itemVM.addOnProduct = this._addOnProduct;
        itemVM.noAdded = this._noAdded;
        itemVM.totalPriceString = this._totalPriceString;
        return itemVM;
    }
}