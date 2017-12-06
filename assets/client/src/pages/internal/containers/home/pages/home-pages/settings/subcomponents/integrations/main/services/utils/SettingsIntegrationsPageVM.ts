import { IntegrationType } from "../../../utils/IntegrationType";

export class SettingsIntegrationsPageVM {
	private _componentPath: string;
	private _selected: boolean;
	private _pageType: IntegrationType;
	private _pageName: string;

	constructor(componentPath: string, pageType: IntegrationType, pageName: string) {
		this._componentPath = componentPath;
		this._pageType = pageType;
		this._pageName = pageName;
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
	public get pageType(): IntegrationType {
		return this._pageType;
	}
	public set pageType(pageType: IntegrationType) {
		this._pageType = pageType;
	}
	public get pageName(): string {
		return this._pageName;
	}
	public set pageName(pageName: string) {
		this._pageName = pageName;
	}
}