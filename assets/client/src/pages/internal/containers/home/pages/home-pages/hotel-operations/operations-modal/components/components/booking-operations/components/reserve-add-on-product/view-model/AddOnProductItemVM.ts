import { AddOnProductSnapshotDO } from "../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductSnapshotDO";

export class AddOnProductItemVM {
    private _addOnProductSnapshot: AddOnProductSnapshotDO;
    private _noAdded: number;
    private _totalPriceString: string;

    public get addOnProductSnapshot(): AddOnProductSnapshotDO {
        return this._addOnProductSnapshot;
    }
    public set addOnProductSnapshot(addOnProduct: AddOnProductSnapshotDO) {
        this._addOnProductSnapshot = addOnProduct;
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
        var totalPrice: number = this._addOnProductSnapshot.price * this._noAdded;
        this._totalPriceString = totalPrice + " " + ccySymbol;
    }

    public buildPrototype(): AddOnProductItemVM {
        var itemVM = new AddOnProductItemVM();
        itemVM.addOnProductSnapshot = this._addOnProductSnapshot;
        itemVM.noAdded = this._noAdded;
        itemVM.totalPriceString = this._totalPriceString;
        return itemVM;
    }
}