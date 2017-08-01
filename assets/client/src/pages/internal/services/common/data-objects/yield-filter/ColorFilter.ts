import * as _ from "underscore";

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
	cssClass: string;
	displayName: string;
}

var ColorMetaDict: { [index: number]: ColorMeta; } = {};
ColorMetaDict[ColorCode.Red] = { cssClass: "red", displayName: "Red" };
ColorMetaDict[ColorCode.Yellow] = { cssClass: "yellow", displayName: "Yellow" };
ColorMetaDict[ColorCode.Green] = { cssClass: "green", displayName: "Green" };
ColorMetaDict[ColorCode.Blue] = { cssClass: "blue", displayName: "Blue" };
ColorMetaDict[ColorCode.Gray] = { cssClass: "gray", displayName: "Gray" };
ColorMetaDict[ColorCode.Brown] = { cssClass: "brown", displayName: "Brown" };
ColorMetaDict[ColorCode.Violet] = { cssClass: "violet", displayName: "Violet" };
ColorMetaDict[ColorCode.Orange] = { cssClass: "orange", displayName: "Orange" };
ColorMetaDict[ColorCode.Olive] = { cssClass: "olive", displayName: "Olive" };
ColorMetaDict[ColorCode.Purple] = { cssClass: "purple", displayName: "Purple" };

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
		for (var index = 0; index < this._colorMetaList.length; index++) {
			var colorMeta = this._colorMetaList[index];
			if (colorMeta.cssClass === colorCodeStr) {
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