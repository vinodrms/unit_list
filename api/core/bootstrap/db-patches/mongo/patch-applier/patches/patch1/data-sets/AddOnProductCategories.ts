import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {AddOnProductCategoryDO} from '../../../../../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {AddOnProductCategorySettingDO} from '../../../../../../../data-layer/settings/data-objects/add-on-product/AddOnProductCategorySettingDO';

export class AddOnProductCategories extends ABaseSetting {
    constructor() {
        super(SettingType.AddOnProductCategory, "Add-On Product Categories");
    }

    public getAddOnProductSettingDO(): AddOnProductCategorySettingDO {
        var readAddOnProdCategList = this.dataSet;
        var toAddAddOnProdCategList: AddOnProductCategoryDO[] = [];
        readAddOnProdCategList.forEach((readAddOnProdCateg: { name: string, iconUrl: string }) => {
            var addOnProdCategDO = new AddOnProductCategoryDO();
            addOnProdCategDO.id = this._thUtils.generateUniqueID();
            addOnProdCategDO.iconUrl = readAddOnProdCateg.iconUrl;
            addOnProdCategDO.name = readAddOnProdCateg.name;
            toAddAddOnProdCategList.push(addOnProdCategDO);
        });
        var addOnProdCategSettingDO = new AddOnProductCategorySettingDO();
        addOnProdCategSettingDO.metadata = this.getSettingMetadata();
        addOnProdCategSettingDO.value = toAddAddOnProdCategList;
        return addOnProdCategSettingDO;
    }

    private dataSet: { name: string, iconUrl: string }[] = [
        {
            name: "Breakfast",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Outdoor Activities",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Food and Beverages",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Spa",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Leisure",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Business Center",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Copy and Printing",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Parking",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Public Transport",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Voucher",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Discount",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Early Check-In",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Late Check-Out",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
		{
            name: "Hotel Services",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Other",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
    ];
}