import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';

@Injectable()
export class BookingEmailConfigStepService implements IBookingStepService {
    private _stepPath: string[];

    didAppearObservable: Observable<boolean>;
    private _didAppearObserver: Observer<boolean>;

    didDisappearObservable: Observable<boolean>;
    private _didDisappearObserver: Observer<boolean>;

    constructor(private _appContext: AppContext) {
        this._stepPath = [this._appContext.thTranslation.translate("Recipients")];
        this.didAppearObservable = new Observable<boolean>((didAppearObserver: Observer<boolean>) => {
            this._didAppearObserver = didAppearObserver;
        });
        this.didDisappearObservable = new Observable<boolean>((didDisappearObserver: Observer<boolean>) => {
            this._didDisappearObserver = didDisappearObserver;
        });
    }

    public getBookingStepType(): BookingStepType {
        return BookingStepType.EmailConfig;
    }
    public canMoveNext(): boolean {
        return true;
    }
    public getStepPath(): string[] {
        return this._stepPath;
    }
    public getErrorString(): string {
        return "";
    }
    public didAppear() {
        if (this._didAppearObserver) { this._didAppearObserver.next(true) };
    }
    public didDisappear() {
        if (this._didDisappearObserver) { this._didDisappearObserver.next(true) };
    }
}