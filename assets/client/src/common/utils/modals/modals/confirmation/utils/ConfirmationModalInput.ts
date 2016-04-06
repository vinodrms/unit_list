export class ConfirmationModalInput {
	private _title: string;
	private _content: string;

	constructor() {
	}

	public get title(): string {
		return this._title;
	}
	public set title(title: string) {
		this._title = title;
	}

	public get content(): string {
		return this._content;
	}
	public set content(content: string) {
		this._content = content;
	}
}