export class CustomerRegisterModalInput {
	private _multiSelection: boolean;
	public get multiSelection(): boolean {
		return this._multiSelection;
	}
	public set multiSelection(multiSelection: boolean) {
		this._multiSelection = multiSelection;
	}
}