export class InvoiceSelectionModalInput {

	private _multiSelection: boolean;
	private _onlyUnpaidInvoices: boolean;

	public get multiSelection(): boolean {
		return this._multiSelection;
	}
	public set multiSelection(multiSelection: boolean) {
		this._multiSelection = multiSelection;
	}
	public get onlyUnpaidInvoices(): boolean {
		return this._onlyUnpaidInvoices;
	}
	public set onlyUnpaidInvoices(value: boolean) {
		this._onlyUnpaidInvoices = value;
	}
}