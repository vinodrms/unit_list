export interface ConfirmationModalButtons {
    positive: string,
    negative?: string
}

export class ConfirmationModalInput {
	private _title: string;
	private _content: string;
    private _buttons: ConfirmationModalButtons;
    
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
    
    public get buttons(): ConfirmationModalButtons {
		return this._buttons;
	}
	public set buttons(content: ConfirmationModalButtons) {
		this._buttons = content;
	}
}