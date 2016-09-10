import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {AddOnProductCategoryDO, AddOnProductCategoryType} from '../../../../../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {AddOnProductCategorySettingDO} from '../../../../../../../data-layer/settings/data-objects/add-on-product/AddOnProductCategorySettingDO';

interface AddOnProductCategoryStructure {
	type: AddOnProductCategoryType;
	name: string;
	iconUrl: string
}

export class AddOnProductCategories extends ABaseSetting {
    constructor() {
        super(SettingType.AddOnProductCategory, "Add-On Product Categories");
    }

    public getAddOnProductSettingDO(): AddOnProductCategorySettingDO {
        var readAddOnProdCategList = this.dataSet;
        var toAddAddOnProdCategList: AddOnProductCategoryDO[] = [];
        readAddOnProdCategList.forEach((readAddOnProdCateg: AddOnProductCategoryStructure) => {
            var addOnProdCategDO = new AddOnProductCategoryDO();
            addOnProdCategDO.id = this._thUtils.generateUniqueID();
			addOnProdCategDO.type = readAddOnProdCateg.type;
            addOnProdCategDO.iconUrl = readAddOnProdCateg.iconUrl;
            addOnProdCategDO.name = readAddOnProdCateg.name;
            toAddAddOnProdCategList.push(addOnProdCategDO);
        });
        var addOnProdCategSettingDO = new AddOnProductCategorySettingDO();
        addOnProdCategSettingDO.metadata = this.getSettingMetadata();
        addOnProdCategSettingDO.value = toAddAddOnProdCategList;
        return addOnProdCategSettingDO;
    }

    private dataSet: AddOnProductCategoryStructure[] = [
        {
			type: AddOnProductCategoryType.Breakfast,
            name: "Breakfast",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Food and Beverages",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Outdoor Activities",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Spa",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Leisure",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Business Center",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Copy and Printing",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Parking",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Public Transport",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Voucher",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Discount",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Early Check-In",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Late Check-Out",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Hotel Services",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            type: AddOnProductCategoryType.AddOnProduct,
            name: "Other",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
    ];
}