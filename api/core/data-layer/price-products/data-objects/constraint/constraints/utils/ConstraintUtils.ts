import {ThTranslation} from '../../../../../../utils/localization/ThTranslation';
import {ISOWeekDay, ISOWeekDayUtils, ISOWeekDayVM} from '../../../../../../utils/th-dates/data-objects/ISOWeekDay';

import _ = require('underscore');

export class ConstraintUtils {
    constructor(private _thTranslation: ThTranslation) {

    }
    public getDaysFromWeekDisplayString(iSOWeekDayList: ISOWeekDay[]): string {
        var isoWeekDayUtils = new ISOWeekDayUtils();
        var isoWeekDayVMList: ISOWeekDayVM[] = isoWeekDayUtils.getISOWeekDayVMList();
        var displayString = "";
        _.forEach(isoWeekDayVMList, (isoWeekDayVM: ISOWeekDayVM) => {
            if (_.contains(iSOWeekDayList, isoWeekDayVM.iSOWeekDay)) {
                if (displayString.length > 0) {
                    displayString += ", ";
                }
                displayString += this._thTranslation.translate(isoWeekDayVM.name);
            }
        });
        return displayString;
    }
}