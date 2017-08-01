import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { ISOWeekDayVM, ISOWeekDayUtils, ISOWeekDay } from "../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay";
import { PriceProductConstraintFactory } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintFactory";
import { PriceProductConstraintDO } from "../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO";
import { PriceProductConstraintMeta, PriceProductConstraintType } from "../../../../../../../../../services/price-products/data-objects/constraint/IPriceProductConstraint";
import { DaysFromWeekConstraintDO } from "../../../../../../../../../services/price-products/data-objects/constraint/constraints/DaysFromWeekConstraintDO";

import * as _ from "underscore";

@Component({
    selector: 'price-product-constraint-selector',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/constraints/constraint-selector/template/price-product-constraint-selector.html'
})
export class PriceProductConstraintSelectorComponent extends BaseComponent implements OnInit {
    @Output() onConstraintChange = new EventEmitter<PriceProductConstraintDO>();
    public triggerOnConstraintChange() {
        this.onConstraintChange.next(this.constraintDO);
    }

    private _constraintFactory: PriceProductConstraintFactory;

    isoWeekDayVMList: ISOWeekDayVM[];
    constraintDO: PriceProductConstraintDO;
    constraintMetaList: PriceProductConstraintMeta[];

    constructor(private _appContext: AppContext) {
        super();
        this._constraintFactory = new PriceProductConstraintFactory();
        this.constraintMetaList = this._constraintFactory.getPriceProductConstraintMetaList();
        this.constraintDO = this._constraintFactory.getDefaultConstraintDO();
        this.isoWeekDayVMList = (new ISOWeekDayUtils()).getISOWeekDayVMList();
    }

    ngOnInit(): void {
        this.triggerOnConstraintChange();
    }

    public get description(): string {
        return _.find(this.constraintMetaList, (constraintMeta: PriceProductConstraintMeta) => { return constraintMeta.constraintType === this.constraintDO.type }).description;
    }
    public didChangeConstraintType(newConstraintTypeStr: string) {
        var newConstraintType: PriceProductConstraintType = parseInt(newConstraintTypeStr);
        if (newConstraintType === this.constraintDO.type) {
            return;
        }
        this.constraintDO = this._constraintFactory.getConstraintDOByType(newConstraintType);
        this.triggerOnConstraintChange();
    }

    public isDaysFromWeekConstraint() {
        return this.constraintDO.type === PriceProductConstraintType.BookableOnlyOnDaysFromWeek
            || this.constraintDO.type === PriceProductConstraintType.IncludeDaysFromWeek
            || this.constraintDO.type === PriceProductConstraintType.MustArriveOnDaysFromWeek;
    }
    public isLeadDaysConstraint() {
        return this.constraintDO.type === PriceProductConstraintType.MinimumLeadDays || this.constraintDO.type === PriceProductConstraintType.MaximumLeadDays;
    }
    public isLengthOfStayConstraint() {
        return this.constraintDO.type === PriceProductConstraintType.MinimumLengthOfStay;
    }
    public isNumberOfRoomsConstraint() {
        return this.constraintDO.type === PriceProductConstraintType.MinimumNumberOfRooms;
    }
    public isNumberOfAdultsConstraint() {
        return this.constraintDO.type === PriceProductConstraintType.MinimumNumberOfAdults;
    }

    public addOrRemoveDayFromDaysFromWeekConstraint(daysFromWeekConstraint: DaysFromWeekConstraintDO, weekDay: ISOWeekDay) {
        daysFromWeekConstraint.addOrRemove(weekDay);
        this.triggerOnConstraintChange();
    }
}