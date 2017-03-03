import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { PriceProductPriceType } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { IPriceProductPrice } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { NumberSuffixFormatter } from '../../../../../../../../../../../common/utils/form-utils/NumberSuffixFormatter';
import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';

@Component({
    selector: 'price-edit',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/price-edit/template/price-edit.html'
})
export class PriceEditComponent implements OnInit {
    @Input() displayError: boolean;
    @Input() readonly: boolean;
    @Input() priceType: PriceProductPriceType;
    @Input() roomCategoryStats: RoomCategoryStatsDO;
    @Input() price: IPriceProductPrice;
    @Output() priceChange = new EventEmitter<IPriceProductPrice>();

    private _numberSuffixFormatter: NumberSuffixFormatter;

    constructor(private _appContext: AppContext) {
        this._numberSuffixFormatter = new NumberSuffixFormatter(this._appContext.thTranslation);
    }

    ngOnInit() { }

    public get isSinglePrice() {
        return this.priceType === PriceProductPriceType.SinglePrice;
    }
    public get isPricePerPerson() {
        return this.priceType === PriceProductPriceType.PricePerPerson;
    }

    public triggerPriceChange() {
        this.priceChange.next(this.price);
    }

    public getNumberSuffix(inputNumber: number) {
        return this._numberSuffixFormatter.getNumberSuffix(inputNumber);
    }

    public roomCategoryHasOnlyOneAdultAndZeroChildren(): boolean {
        var totalCapacity = this.roomCategoryStats.capacity.totalCapacity;
        return totalCapacity.noAdults === 1 && totalCapacity.noChildren === 0;
    }
}