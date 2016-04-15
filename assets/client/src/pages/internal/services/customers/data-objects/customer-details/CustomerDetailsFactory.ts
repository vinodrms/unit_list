import {ICustomerDetailsDO} from './ICustomerDetailsDO';
import {CustomerType} from '../CustomerDO';
import {IndividualDetailsDO} from './IndividualDetailsDO';
import {CorporateDetailsDO} from './CorporateDetailsDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {CountryDO} from '../../../common/data-objects/country/CountryDO';
import {ThDateDO} from '../../../common/data-objects/th-dates/ThDateDO';

export class CustomerDetailsFactory {
	public getCustomerDetailsByType(customerType: CustomerType): ICustomerDetailsDO {
		switch (customerType) {
			case CustomerType.Individual:
				return this.buildNewIndividualDetailsDO();
			default:
				return this.buildNewCorporateDetailsDO();
		}
	}
	public getDefaultCustomerType(): CustomerType {
		return CustomerType.Individual;
	}
	private buildNewIndividualDetailsDO(): IndividualDetailsDO {
		var individualDetails = new IndividualDetailsDO();
		individualDetails.address = new AddressDO();
		individualDetails.address.country = new CountryDO();
		individualDetails.birthday = new ThDateDO();
		return individualDetails;
	}
	private buildNewCorporateDetailsDO(): CorporateDetailsDO {
		var corporateDetails = new CorporateDetailsDO();
		corporateDetails.address = new AddressDO();
		corporateDetails.address.country = new CountryDO();
		return corporateDetails;
	}
}