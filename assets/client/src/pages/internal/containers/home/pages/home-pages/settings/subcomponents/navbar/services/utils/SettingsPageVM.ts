import {SettingsPageType} from './SettingsPageType';

export class SettingsPageVM {
	private _pageType: SettingsPageType;
	private _selected: boolean;
	private _componentPath: string;
	private _pageName: string;
	private _iconFontName: string;
	
	constructor(pageType: SettingsPageType, componentPath: string, pageName: string, iconFontName: string) {
		this._pageType = pageType;
		this._componentPath = componentPath;
		this._pageName = pageName;
		this._iconFontName = iconFontName;
		this._selected = false;
	}
	
	public get componentPath(): string {
		return this._componentPath;
	}
	public set componentPath(componentPath: string) {
		this._componentPath = componentPath;
	}
	public get selected(): boolean {
		return this._selected;
	}
	public set selected(selected: boolean) {
		this._selected = selected;
	}
	
	public get pageType(): SettingsPageType {
		return this._pageType;
	}
	public set pageType(pageType: SettingsPageType) {
		this._pageType = pageType;
	}
	public get pageName(): string {
		return this._pageName;
	}
	public set pageName(pageName: string) {
		this._pageName = pageName;
	}
	public get iconFontName(): string {
		return this._iconFontName;
	}
	public set iconFontName(iconFontName: string) {
		this._iconFontName = iconFontName;
	}
}