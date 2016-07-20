import {IHotelOperationsPageParam} from '../utils/../../../services/utils/IHotelOperationsPageParam';

export class HotelOperationsPageController {
    private _hotelOperationsPageParamList: IHotelOperationsPageParam[];

    constructor(initialPage: IHotelOperationsPageParam) {
        this._hotelOperationsPageParamList = [initialPage];
    }

    public canGoBack(): boolean {
        return this._hotelOperationsPageParamList.length > 1;
    }
    public goBack() {
        this._hotelOperationsPageParamList.pop();
    }

    public get currentHotelOperationsPageParam(): IHotelOperationsPageParam {
        return this._hotelOperationsPageParamList[this._hotelOperationsPageParamList.length - 1];
    }
}