import {ThDateDO} from '../../../../common/data-objects/th-dates/ThDateDO';
import {PriceProductYieldItemVM} from './PriceProductYieldItemVM';

export class PriceProductYieldResultVM {
    private _dateList: ThDateDO[];
    private _priceProductYieldItemVM: PriceProductYieldItemVM[];

    public get dateList(): ThDateDO[] {
        return this._dateList;
    }
    public set dateList(dateList: ThDateDO[]) {
        this._dateList = dateList;
    }
    public get priceProductYieldItemVM(): PriceProductYieldItemVM[] {
        return this._priceProductYieldItemVM;
    }
    public set priceProductYieldItemVM(priceProductYieldItemVM: PriceProductYieldItemVM[]) {
        this._priceProductYieldItemVM = priceProductYieldItemVM;
    }
}