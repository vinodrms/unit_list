export class YieldGroupItemVM{
	constructor(private _colorName : string, private _cssClass : string, private _description : string){
	}

	public get colorName() : string {
		return this._colorName;
	}

	public set colorName(v : string) {
		this._colorName = v;
	}
	
	public get description() : string {
		return this._description;
	}
	
	public set description(v : string) {
		this._description = v;
	}
	
	public get cssClass() : string {
		return this._cssClass;
	}

	public set cssClass(v : string) {
		this._cssClass = v;
	}
	
}