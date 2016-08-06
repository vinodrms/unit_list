export class YieldLevelItemVM{
	constructor(private _name : string, private _description : string){
	}

	public get name() : string {
		return this._name;
	}

	public set name(v : string) {
		this._name = v;
	}
	
	public get description() : string {
		return this._description;
	}

	public set description(v : string) {
		this._description = v;
	}
}