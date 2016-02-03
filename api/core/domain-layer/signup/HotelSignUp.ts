import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';

export class HotelSignUpDO {
	hotelName : string;
	email : string;
	password : string;
	firstName : string;
	lastName : string;
	
	public static getRequiredProperties() : string[] {
		return ["hotelName", "email", "password", "firstName", "lastName"];
	}
}

export class HotelSignUp {
	constructor(private _appContext : AppContext, private _sessionContext : SessionContext, private _signUpDO : HotelSignUpDO) {
	}
	
	public signUp() : Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.signUpCore(resolve, reject);
		});
	}
	
	private signUpCore(resolve, reject) {
		// TODO
	}
}