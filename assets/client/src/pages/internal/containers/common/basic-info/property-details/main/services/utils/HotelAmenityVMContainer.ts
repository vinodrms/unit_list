import { AmenityDO } from '../../../../../../../services/common/data-objects/amenity/AmenityDO';
import { HotelAmenitiesDO } from '../../../../../../../services/settings/data-objects/HotelAmenitiesDO';

import * as _ from "underscore";

export class HotelAmenityVM {
    hotelAmenity: AmenityDO;
    isSelected: boolean;

    public toggle() {
        this.isSelected = !this.isSelected;
    }
}

export class HotelAmenityVMContainer {
    private _hotelAmenityList: HotelAmenityVM[];

    constructor(hotelAmenities: HotelAmenitiesDO, availableHotelAmenities: string[]) {
        this._hotelAmenityList = [];
        hotelAmenities.hotelAmenityList.forEach((hotelAmenity: AmenityDO) => {
            var hotelAmenityVM: HotelAmenityVM = new HotelAmenityVM();
            hotelAmenityVM.hotelAmenity = hotelAmenity;
            hotelAmenityVM.isSelected = _.contains(availableHotelAmenities, hotelAmenity.id);
            this._hotelAmenityList.push(hotelAmenityVM);
        });
    }

    public get hotelAmenityList(): HotelAmenityVM[] {
        return this._hotelAmenityList;
    }
    public set hotelAmenityList(hotelAmenityList: HotelAmenityVM[]) {
        this._hotelAmenityList = hotelAmenityList;
    }

    public getSelectedHotelAmenityList(): string[] {
        var filteredHotelAmenities: HotelAmenityVM[] = _.filter(this._hotelAmenityList, (hotelAmenityVM: HotelAmenityVM) => {
            return hotelAmenityVM.isSelected;
        })
        return _.map(filteredHotelAmenities, (hotelAmenityVM: HotelAmenityVM) => {
            return hotelAmenityVM.hotelAmenity.id;
        });
    }
}