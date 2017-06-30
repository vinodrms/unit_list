export class AddOnProductsModalInput {
    private _filterBreakfast: boolean;
    private _multiSelection: boolean;

    public get filterBreakfast(): boolean {
        return this._filterBreakfast;
    }
    public set filterBreakfast(filterBreakfast: boolean) {
        this._filterBreakfast = filterBreakfast;
    }
    public get multiSelection(): boolean {
        return this._multiSelection;
    }
    public set multiSelection(multiSelection: boolean) {
        this._multiSelection = multiSelection;
    }
}