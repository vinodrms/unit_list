import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {ISOWeekDayUtils, ISOWeekDayVM} from '../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';
import {PriceProductConstraintDO} from '../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';
import {IPriceProductConstraint, PriceProductConstraintMeta, PriceProductConstraintType} from '../../../../../../../../../services/price-products/data-objects/constraint/IPriceProductConstraint';
import {PriceProductConstraintFactory} from '../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintFactory';

@Component({
	selector: 'price-product-constraint-modal',
	templateUrl: "/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/constraints/constraint-modal/template/price-product-constraint-modal.html",
	pipes: [TranslationPipe]
})
export class PriceProductConstraintModalComponent extends BaseComponent implements ICustomModalComponent {
	private _constraintFactory: PriceProductConstraintFactory;

	isoWeekDayVMList: ISOWeekDayVM[];
	constraintDO: PriceProductConstraintDO;
	constraintMetaList: PriceProductConstraintMeta[];

	constructor(private _appContext: AppContext,
		private _modalDialogInstance: ModalDialogInstance<PriceProductConstraintDO>) {
		super();
		this._constraintFactory = new PriceProductConstraintFactory();
		this.constraintMetaList = this._constraintFactory.getPriceProductConstraintMetaList();
		this.constraintDO = this._constraintFactory.getDefaultConstraintDO();
		this.isoWeekDayVMList = (new ISOWeekDayUtils()).getISOWeekDayVMList();
		
		this.constraintDO.constraint
	}

	public closeDialog() {
		this._modalDialogInstance.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Medium;
	}
	public get description(): string {
		return _.find(this.constraintMetaList, (constraintMeta: PriceProductConstraintMeta) => { return constraintMeta.constraintType === this.constraintDO.type }).description;
	}
	public didChangeConstraintType(newConstraintTypeStr: string) {
		var newConstraintType: PriceProductConstraintType = parseInt(newConstraintTypeStr);
		if(newConstraintType === this.constraintDO.type) {
			return;
		}
		this.constraintDO = this._constraintFactory.getConstraintDOByType(newConstraintType);
	}
	
	public isDaysFromWeekConstraint() {
		return this.constraintDO.type === PriceProductConstraintType.BookableOnlyOnDaysFromWeek || this.constraintDO.type === PriceProductConstraintType.IncludeDaysFromWeek;
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
	
	public addConstraint() {
		if(!this.constraintDO.isValid()) {
			return;
		}
		this._modalDialogInstance.addResult(this.constraintDO);
		this.closeDialog();
	}
}