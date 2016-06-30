import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class NumberOfRoomsConstraintDO extends BaseDO implements IPriceProductConstraint {
	noOfRooms: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfRooms"];
	}
	public isValid() {
		return ThDataValidators.isValidInteger(this.noOfRooms) && this.noOfRooms >= 1;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("%noOfRooms% rooms", { noOfRooms: this.noOfRooms });
	}
	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		return this.getValueDisplayString(thTranslation);
	}
}