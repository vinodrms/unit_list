export class KeyValueModalInput {
	private _title: string;
	private _content: Object;
    
	constructor() {
	}

	public get title(): string {
		return this._title;
	}
	public set title(title: string) {
		this._title = title;
	}

	public get content(): Object {
		return this._content;
	}
	public set content(content: Object) {
		this._content = content;
	}
}