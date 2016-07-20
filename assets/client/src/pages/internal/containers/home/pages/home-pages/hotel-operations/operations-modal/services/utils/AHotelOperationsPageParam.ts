import {IHotelOperationsPageParam, HotelOperationsPageTitleMeta} from './IHotelOperationsPageParam';
import {HotelOperationsPageType} from './HotelOperationsPageType';

export abstract class AHotelOperationsPageParam implements IHotelOperationsPageParam {
    private _pageType: HotelOperationsPageType;
    public _pageTitleText: string;

    constructor(pageType: HotelOperationsPageType, private _titleFontName: string) {
        this._pageType = pageType;
        this._pageTitleText = "";
    }

    public get pageTitleText(): string {
        return this._pageTitleText;
    }
    public set pageTitleText(pageTitleText: string) {
        this._pageTitleText = pageTitleText;
    }

    public get pageType(): HotelOperationsPageType {
        return this._pageType;
    }
    public set pageType(pageType: HotelOperationsPageType) {
        this._pageType = pageType;
    }

    public get titleMeta(): HotelOperationsPageTitleMeta {
        return {
            fontName: this._titleFontName,
            title: this._pageTitleText
        }
    }
}