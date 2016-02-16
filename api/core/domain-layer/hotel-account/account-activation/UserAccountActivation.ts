import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {UserAccountActivationDO} from './UserAccountActivationDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {UserAccountActivationRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';

export class UserAccountActivation {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _accountActivationDO: UserAccountActivationDO) {
	}
	public activate(): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: ThError): void }) => {
			this.activateCore(resolve, reject);
		});
	}
	private activateCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }) {
		var validationResult = UserAccountActivationDO.getValidationStructure().validateStructure(this._accountActivationDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._accountActivationDO);
			parser.logAndReject("Error validating user account activation fields", reject);
			return;
		}
		var activationParams: UserAccountActivationRepoDO = {
			email: this._accountActivationDO.email,
			activationCode: this._accountActivationDO.activationCode
		};
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.activateUserAccount(activationParams).then((user: UserDO) => {
			resolve(user);
		}).catch((err: any) => {
			var thError = new ThError(ThStatusCode.UserAccountActivationErrorActivatingAccount, err);
			reject(thError);
		});
	}
}