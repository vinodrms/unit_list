import { HotelSignUpDO } from "../../../../../core/domain-layer/hotel-account/sign-up/HotelSignUpDO";
import { TestContext } from "../../../../helpers/TestContext";

import request = require('request');

export class UserAccountTestHelper {
    private static ClientId: string = "UnitPal-Web";
    private testContext: TestContext;

    constructor(ctx: TestContext) {
        this.testContext = ctx;
    }

    public getSignUpDO(): HotelSignUpDO {
        var signUpDO: HotelSignUpDO = {
            email: "dragos.pricope@gmail.com",
            firstName: "Dragos",
            lastName: "Pricope",
            hotelName: "3angleTECH Hotel",
            password: "TestTest01"
        };
        return signUpDO;
    }

    public getLoginRequestOptions(username: string, password: string) {
        let clientId = UserAccountTestHelper.ClientId;
        let baseUrl = this.testContext.appContext.getUnitPalConfig().getAppContextRoot();
        let url = baseUrl + '/api/token';

        return {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: url,
            body: `client_id=${clientId}&grant_type=password&username=${username}&password=${password}`,
            method: 'POST',
        };
    }

    public getReissueTokenRequestOptions(refreshToken: string) {
        let clientId = UserAccountTestHelper.ClientId;
        let baseUrl = this.testContext.appContext.getUnitPalConfig().getAppContextRoot();
        let url = baseUrl + '/api/token';

        return {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: url,
            body: `client_id=${clientId}&grant_type=refresh_token&refresh_token=${refreshToken}`,
            method: 'POST',
        };
    }

}