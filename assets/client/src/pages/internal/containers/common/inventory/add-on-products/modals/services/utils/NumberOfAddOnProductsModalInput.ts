export class NumberOfAddOnProductsModalInput {
    private _addOnProductId: string;

    public get addOnProductId(): string {
        return this._addOnProductId;
    }
    public set addOnProductId(addOnProductId: string) {
        this._addOnProductId = addOnProductId;
    }        
}