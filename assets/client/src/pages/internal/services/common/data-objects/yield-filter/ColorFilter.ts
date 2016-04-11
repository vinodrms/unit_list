export enum ColorCode {
	Red,
	Yellow,
	Green,
	Blue,
	Gray,
	Brown,
	Violet,
	Orange,
	Olive,
	Purple
}

export interface ColorMeta {
	colorCode: ColorCode;
	colorCodeStr: string;
	displayName: string;
}

var ColorMetaDict: { [index: number]: ColorMeta; } = {};
ColorMetaDict[ColorCode.Red] = { colorCode: ColorCode.Red, colorCodeStr: "red", displayName: "Red" };
ColorMetaDict[ColorCode.Yellow] = { colorCode: ColorCode.Red, colorCodeStr: "yellow", displayName: "Yellow" };
ColorMetaDict[ColorCode.Green] = { colorCode: ColorCode.Red, colorCodeStr: "green", displayName: "Green" };
ColorMetaDict[ColorCode.Blue] = { colorCode: ColorCode.Red, colorCodeStr: "blue", displayName: "Blue" };
ColorMetaDict[ColorCode.Gray] = { colorCode: ColorCode.Red, colorCodeStr: "gray", displayName: "Gray" };
ColorMetaDict[ColorCode.Brown] = { colorCode: ColorCode.Red, colorCodeStr: "brown", displayName: "Brown" };
ColorMetaDict[ColorCode.Violet] = { colorCode: ColorCode.Red, colorCodeStr: "violet", displayName: "Violet" };
ColorMetaDict[ColorCode.Orange] = { colorCode: ColorCode.Red, colorCodeStr: "orange", displayName: "Orange" };
ColorMetaDict[ColorCode.Olive] = { colorCode: ColorCode.Red, colorCodeStr: "olive", displayName: "Olive" };
ColorMetaDict[ColorCode.Purple] = { colorCode: ColorCode.Red, colorCodeStr: "purple", displayName: "Purple" };

export class ColorFilter {
	private _colorMetaList: ColorMeta[];
	
	constructor() {
		this.indexColorMetaCodes();
	}
	private indexColorMetaCodes() {
		this._colorMetaList = [];
		var colorCodeStrArray: string[] = Object.keys(ColorMetaDict);
		_.forEach(colorCodeStrArray, (colorCodeUnparsed: string) => {
			var colorCode = parseInt(colorCodeUnparsed);
			this._colorMetaList.push(ColorMetaDict[colorCode]);
		});
	}
	public getColorMetaByColorCode(colorCodeStr: string): ColorMeta {
		for(var index = 0; index < this._colorMetaList.length; index ++) {
			var colorMeta = this._colorMetaList[index];
			if(colorMeta.colorCodeStr === colorCodeStr) {
				return colorMeta;
			}
		}
		return this._colorMetaList[0];
	}
	
	public get colorMetaList(): ColorMeta[] {
		return this._colorMetaList;
	}
	public set colorMetaList(colorMetaList: ColorMeta[]) {
		this._colorMetaList = colorMetaList;
	}
}