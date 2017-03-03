import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { ISOWeekDayUtils, ISOWeekDayVM, ISOWeekDay } from '../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';
import { PriceExceptionModalInput } from './services/utils/PriceExceptionModalInput';
import { IPriceProductPrice } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductPriceDO } from '../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import { PriceVM } from '../utils/PriceVM';

@Component({
    selector: 'price-exception-modal',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/price-exception-modal/template/price-exception-modal.html'
})
export class PriceExceptionModalComponent extends BaseComponent implements ICustomModalComponent {
    readonly: boolean;
    displayError: boolean;
    priceVM: PriceVM;
    isoWeekDayVMList: ISOWeekDayVM[];

    private _selectedWeekDay: ISOWeekDay;
    price: IPriceProductPrice;
    didEditCurrentException: boolean;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<PriceVM>,
        modalInput: PriceExceptionModalInput) {
        super();
        this.isoWeekDayVMList = (new ISOWeekDayUtils()).getISOWeekDayVMList();
        this.priceVM = modalInput.priceVM;
        this.readonly = modalInput.readonly;
        this.selectedWeekDay = ISOWeekDay.Monday;
        this.displayError = false;
    }
    public closeDialog() {
        if (!this.readonly) {
            this._modalDialogRef.addResult(this.priceVM);
        }
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return true;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public hasExceptionConfigured(weekDay: ISOWeekDay): boolean {
        if (this._appContext.thUtils.isUndefinedOrNull(this.priceVM.priceExceptionsByWeekday[weekDay])) {
            return false;
        }
        return true;
    }

    public get selectedWeekDay(): ISOWeekDay {
        return this._selectedWeekDay;
    }
    public set selectedWeekDay(selectedWeekDay: ISOWeekDay) {
        this._selectedWeekDay = selectedWeekDay;
        let newPrice = PriceProductPriceDO.buildPriceInstance(this.priceVM.priceType);
        if (this.hasExceptionConfigured(selectedWeekDay)) {
            newPrice.buildFromObject(this.priceVM.priceExceptionsByWeekday[selectedWeekDay]);
        }
        else {
            newPrice.buildFromObject(this.priceVM.price);
        }
        this.didEditCurrentException = false;
        this.price = newPrice;
    }
    public get buttonLabel() {
        if (this.hasExceptionConfigured(this._selectedWeekDay)) {
            return "Save Exception";
        }
        return "Add Exception";
    }
    public savePriceException() {
        if (this.readonly || !this.price.isValid()) { return; }
        this.priceVM.priceExceptionsByWeekday[this._selectedWeekDay] = this.price;
        this.priceVM.indexExceptions();
    }
}