import {OpaqueToken} from '@angular/core';
import {HotelOperationsPageType} from './HotelOperationsPageType';
import {IHotelOperationsOnFilterRemovedHandler} from './IHotelOperationsOnFilterRemovedHandler';

export interface HotelOperationsPageFilterMeta {
    filterInfo: string;
    filterValue?: string;
    filterRemoveInfo?: string;
}

export interface HotelOperationsPageTitleMeta {
    title: string;
    subtitle: string;
    fontName: string;
    
    filterMeta?: HotelOperationsPageFilterMeta;
}

export interface IHotelOperationsPageParam {
    pageType: HotelOperationsPageType;
    titleMeta: HotelOperationsPageTitleMeta;

    onFilterRemovedHandler: IHotelOperationsOnFilterRemovedHandler;
}
export const IHotelOperationsPageParam = new OpaqueToken("IHotelOperationsPageParam");