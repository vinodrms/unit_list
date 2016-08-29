import {IHotelOperationsPageParam, HotelOperationsPageTitleMeta, HotelOperationsPageFilterMeta} from './IHotelOperationsPageParam';
import {IHotelOperationsOnFilterRemovedHandler} from './IHotelOperationsOnFilterRemovedHandler';
import {HotelOperationsPageType} from './HotelOperationsPageType';

export abstract class AHotelOperationsPageParam implements IHotelOperationsPageParam {
    private _pageType: HotelOperationsPageType;
    public _pageTitleText: string;
    private _pageSubtitleText: string;
    private _titleFilterMeta: HotelOperationsPageFilterMeta;
    public onFilterRemovedHandler: IHotelOperationsOnFilterRemovedHandler;

    constructor(pageType: HotelOperationsPageType, private _titleFontName: string) {
        this._pageType = pageType;
        this._pageTitleText = "";
        this._pageSubtitleText = "";
    }

    public updateTitle(title: string, subtitle: string, filterMeta?: HotelOperationsPageFilterMeta) {
        this._pageTitleText = title;
        this._pageSubtitleText = subtitle;
        this._titleFilterMeta = filterMeta;
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
            subtitle: this._pageSubtitleText,
            filterMeta: this._titleFilterMeta
        }
    }
}