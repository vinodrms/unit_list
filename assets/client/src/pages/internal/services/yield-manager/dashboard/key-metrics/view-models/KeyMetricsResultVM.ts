import {KeyMetricsResultItemVM} from './KeyMetricsResultItemVM';

export class KeyMetricsResultVM {
    private _currentItemVM: KeyMetricsResultItemVM;
    private _previousItemVM: KeyMetricsResultItemVM;

    public get currentItemVM(): KeyMetricsResultItemVM {
        return this._currentItemVM;
    }
    public set currentItemVM(currentItemVM: KeyMetricsResultItemVM) {
        this._currentItemVM = currentItemVM;
    }

    public get previousItemVM(): KeyMetricsResultItemVM {
        return this._previousItemVM;
    }
    public set previousItemVM(previousItemVM: KeyMetricsResultItemVM) {
        this._previousItemVM = previousItemVM;
    }
}