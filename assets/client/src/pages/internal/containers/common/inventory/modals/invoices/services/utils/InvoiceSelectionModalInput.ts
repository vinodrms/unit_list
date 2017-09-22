export class InvoiceSelectionModalInput {

	private _multiSelection: boolean;
	private _onlyUnpaidInvoices: boolean;
	private _excludedInvoiceId: string;

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
	public get excludedInvoiceId(): string {
		return this._excludedInvoiceId;
	}
	public set excludedInvoiceId(value: string) {
		this._excludedInvoiceId = value;
	}
}