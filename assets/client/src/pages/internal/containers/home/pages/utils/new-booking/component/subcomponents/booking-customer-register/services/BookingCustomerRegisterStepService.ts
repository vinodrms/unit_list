import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';

@Injectable()
export class BookingCustomerRegisterStepService implements IBookingStepService {
	private _basePath: string;

	private _basePathList: string[] = [];
	private _customerRegisterPathList: string[] = [];
	private _fullPathList: string[] = [] = [];

	constructor(private _appContext: AppContext) {
		this._basePath = this._appContext.thTranslation.translate("Customer Register");
	}

	public getBookingStepType(): BookingStepType {
		return BookingStepType.CustomerRegister;
	}
	public canMoveNext(): boolean {
		return false;
	}
	public getStepPath(): string[] {
		return this._fullPathList;
	}
	public getErrorString(): string {
		return "";
	}
	public didAppear() {}
	public didDisappear() {}

	public get basePathList(): string[] {
		return this._basePathList;
	}
	public set basePathList(basePathList: string[]) {
		this._basePathList = basePathList;
		this.updateFullPathList();
	}
	public get customerRegisterPathList(): string[] {
		return this._customerRegisterPathList;
	}
	public set customerRegisterPathList(customerRegisterPathList: string[]) {
		this._customerRegisterPathList = customerRegisterPathList;
		this.updateFullPathList();
	}
	private updateFullPathList() {
		this._fullPathList = this._basePathList;
		this._fullPathList = this._fullPathList.concat(this._customerRegisterPathList);
	}
}