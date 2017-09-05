

import { IHotelAuthentication, HotelAuthenticationType } from "./IHotelAuthentication";
import { HotelBasicAuthentication } from "./HotelBasicAuthentication";
import { AppContext } from "../../../utils/AppContext";

export class HotelAuthenticationFactory {
    constructor(private _appContext: AppContext) {

    }

    public getHotelAuthenticationService(type?: HotelAuthenticationType): IHotelAuthentication {
        switch(type) {
            case HotelAuthenticationType.Basic: 
                return new HotelBasicAuthentication(this._appContext);
            default: 
                return new HotelBasicAuthentication(this._appContext);
        }
    }
}