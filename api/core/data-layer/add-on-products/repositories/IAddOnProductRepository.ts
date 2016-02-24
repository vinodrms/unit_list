import {AddOnProductDO} from '../data-objects/AddOnProductDO';

export interface AddOnProductMetaRepoDO {
	hotelId: string;
}

export interface IAddOnProductRepository {
	getAddOnProductList(meta: AddOnProductMetaRepoDO): Promise<AddOnProductDO[]>;
	getAddOnProductById(meta: AddOnProductMetaRepoDO, addOnProductId: string): Promise<AddOnProductDO>;
	
	//addAddOnProduct(meta: AddOnProductMetaRepoDO, addOnProduct: AddOnProductDO):Prom
}