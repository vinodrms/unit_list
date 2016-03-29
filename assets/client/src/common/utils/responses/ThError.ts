export class ThError {
	constructor(private _message: string) {
	}
	public get message(): string {
		return this._message;
	}
}