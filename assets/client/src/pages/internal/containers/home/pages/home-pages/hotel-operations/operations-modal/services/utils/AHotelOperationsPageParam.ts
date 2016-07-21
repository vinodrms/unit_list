import {IHotelOperationsPageParam, HotelOperationsPageTitleMeta} from './IHotelOperationsPageParam';
import {HotelOperationsPageType} from './HotelOperationsPageType';

export abstract class AHotelOperationsPageParam implements IHotelOperationsPageParam {
    private _pageType: HotelOperationsPageType;
    public _pageTitleText: string;
    private _pageSubtitleText: string;

    constructor(pageType: HotelOperationsPageType, private _titleFontName: string) {
        this._pageType = pageType;
        this._pageTitleText = "";
        this._pageSubtitleText = "";
    }

    public updateTitle(title: string, subtitle: string) {
        this._pageTitleText = title;
        this._pageSubtitleText = subtitle;
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
            title: this._pageTitleText,
            subtitle: this._pageSubtitleText
        }
    }
}