import {HeaderPageType} from './HeaderPageType';

import * as _ from "underscore";

export class HeaderPage {
	private _headerPageType: HeaderPageType;
	private _componentPath: string;
	private _pageName: string;
	private _pageFontName: string;

	private _selected: boolean;

	constructor(headerPageType: HeaderPageType, componentPath: string, pageName: string, pageFontName: string) {
		this._headerPageType = headerPageType;
		this._componentPath = componentPath;
		this._pageName = pageName;
		this._pageFontName = pageFontName;
		this._selected = false;
	}

	public get headerPageType(): HeaderPageType {
		return this._headerPageType;
	}
	public set headerPageType(headerPageType: HeaderPageType) {
		this._headerPageType = headerPageType;
	}
	public get componentPath(): string {
		return this._componentPath;
	}
	public set componentPath(componentPath: string) {
		this._componentPath = componentPath;
	}
	public get pageName(): string {
		return this._pageName;
	}
	public set pageName(pageName: string) {
		this._pageName = pageName;
	}
	public get pageFontName(): string {
		return this._pageFontName;
	}
	public set pageFontName(pageFontName: string) {
		this._pageFontName = pageFontName;
	}
	public get selected(): boolean {
		return this._selected;
	}
	public set selected(selected: boolean) {
		this._selected = selected;
	}
}