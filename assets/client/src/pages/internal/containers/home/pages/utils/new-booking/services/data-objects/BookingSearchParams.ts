import {ThDateIntervalDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {TransientBookingItem} from './TransientBookingItem';
import {ThDataValidators} from '../../../../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class BookingSearchParams {
    constructor() {
        this.configCapacity = new ConfigCapacityDO();
    }

    customerId: string;
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    transientBookingList: TransientBookingItem[];

    public validNoAdults(): boolean {
        return this.validNoOfItems(this.configCapacity.noAdults);
    }
    public validNoChildren(): boolean {
        return this.validNoOfItems(this.configCapacity.noChildren);
    }
    public validNoBabies(): boolean {
        return this.validNoOfItems(this.configCapacity.noBabies);
    }
    private validNoOfItems(noOfItems: number) {
        return ThDataValidators.isValidInteger(noOfItems) && noOfItems >= 0;
    }

    public areValid(): boolean {
        return this.validNoAdults() && this.validNoChildren() && this.validNoBabies();
    }
}