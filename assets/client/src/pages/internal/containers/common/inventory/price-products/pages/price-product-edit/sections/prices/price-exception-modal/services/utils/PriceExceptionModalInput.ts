import { PriceVM } from '../../../utils/PriceVM';

export class PriceExceptionModalInput {
    private _priceVM: PriceVM;
    private _readonly: boolean;


    constructor(priceVM: PriceVM, readonly: boolean) {
        this._priceVM = priceVM;
        this._readonly = readonly;
    }

    public get priceVM(): PriceVM {
        return this._priceVM;
    }
    public set priceVM(priceVM: PriceVM) {
        this._priceVM = priceVM;
    }

    public get readonly(): boolean {
        return this._readonly;
    }
    public set readonly(readonly: boolean) {
        this._readonly = readonly;
    }
}