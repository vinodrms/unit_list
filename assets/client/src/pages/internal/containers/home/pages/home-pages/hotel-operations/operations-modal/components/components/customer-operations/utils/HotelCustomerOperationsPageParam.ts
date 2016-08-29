import {AHotelOperationsPageParam} from '../../../../services/utils/AHotelOperationsPageParam';
import {HotelOperationsPageType} from '../../../../services/utils/HotelOperationsPageType';

export class HotelCustomerOperationsPageParam extends AHotelOperationsPageParam {
    private static CustomerFontName = "(";
    customerId: string;

    constructor(customerId: string) {
        super(HotelOperationsPageType.CustomerOperations, HotelCustomerOperationsPageParam.CustomerFontName);
        this.customerId = customerId;
    }
}