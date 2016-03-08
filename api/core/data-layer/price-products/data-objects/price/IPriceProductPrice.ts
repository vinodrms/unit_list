import {BaseDO} from '../../../common/base/BaseDO';

export interface IPriceProductPrice extends BaseDO {
	getPriceFor(noOfAdults: number, noOfChildren: number): number;
}