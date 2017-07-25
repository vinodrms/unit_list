import { CountryDO } from "../../../../../data-layer/common/data-objects/country/CountryDO";
import { CustomerDO } from "../../../../../data-layer/customers/data-objects/CustomerDO";

import _ = require("underscore");

export class CountryContainer {
    public static OtherCountryCode = "other";
	public static OtherCountryName = "Other";
    
    private _customerIdToCountryMap: { [customerId: string]: CountryDO; };
    private _countryCodeToCountryMap: { [countryCode: string]: CountryDO; };

    constructor(customerList: CustomerDO[]) {
        this._customerIdToCountryMap = {};
        this._countryCodeToCountryMap = {};

        _.forEach(customerList, (customer: CustomerDO) => {
            let country = customer.customerDetails.getAddress().country;

            if (_.isUndefined(this._customerIdToCountryMap[customer.id])) {
                this._customerIdToCountryMap[customer.id] = country;
                
                if(_.isString(country.code) && _.isUndefined(this._countryCodeToCountryMap[country.code])) {
                    this._countryCodeToCountryMap[country.code] = country;
                }
            }
        });
        
        let otherCountry = new CountryDO();
        otherCountry.code = CountryContainer.OtherCountryCode;
        otherCountry.name = CountryContainer.OtherCountryName;
        this._customerIdToCountryMap[CountryContainer.OtherCountryCode] = otherCountry;

    }

    public getCountryByCustomerId(customerId: string): CountryDO  {
        return this._customerIdToCountryMap[customerId];
    }
    public getCountryByCountryCode(countryCode: string): CountryDO  {
        return this._countryCodeToCountryMap[countryCode];
    }
}	