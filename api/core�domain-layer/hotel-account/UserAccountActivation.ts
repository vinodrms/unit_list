import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';

export class UserAccountActivationDO {
	activationCode: string;
	email: string;

	public static getRequiredProperties(): string[] {
		return ["activationCode", "email"];
	}
}

export class UserAccountActivation {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _accountActivationDO: UserAccountActivationDO) {
	}
	public activate(): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.activateCore(resolve, reject);
		});
	}
	private activateCore(resolve, reject) {
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.activateUserAccount(this._accountActivationDO.email, this._accountActivationDO.activationCode).then((result: HotelDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
}