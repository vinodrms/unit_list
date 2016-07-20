import {OpaqueToken} from '@angular/core';
import {HotelOperationsPageType} from './HotelOperationsPageType';

export interface HotelOperationsPageTitleMeta {
    title;
    fontName;
}

export interface IHotelOperationsPageParam {
    pageType: HotelOperationsPageType;
    titleMeta: HotelOperationsPageTitleMeta;
}
export const IHotelOperationsPageParam = new OpaqueToken("IHotelOperationsPageParam");