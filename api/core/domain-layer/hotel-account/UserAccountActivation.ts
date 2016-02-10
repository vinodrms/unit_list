import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {UserDO} from '../../data-layer/hotel/data-objects/user/UserDO';

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
	public activate(): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: ThError): void }) => {
			this.activateCore(resolve, reject);
		});
	}
	private activateCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }) {
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.activateUserAccount(this._accountActivationDO.email, this._accountActivationDO.activationCode).then((user: UserDO) => {
			resolve(user);
		}).catch((err: any) => {
			var thError = new ThError(ThStatusCode.UserAccountActivationErrorActivatingAccount, err);
			reject(thError);
		});
	}
}