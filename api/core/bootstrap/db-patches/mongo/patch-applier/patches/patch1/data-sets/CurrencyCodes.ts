import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {CurrencyDO} from '../../../../../../../data-layer/common/data-objects/currency/CurrencyDO';
import {CurrencySettingDO} from '../../../../../../../data-layer/settings/data-objects/currency/CurrencySettingDO';

export class CurrencyCodes extends ABaseSetting {
    constructor() {
        super(SettingType.CurrencyCodes, "Currency Codes");
    }

    public getCurrencySettingDO(): CurrencySettingDO {
        var readCurrencies = this.dataSet;
        var toAddCurrencies: CurrencyDO[] = [];
        readCurrencies.forEach((readCurrency: { symbol: string, name: string, nativeSymbol: string, code: string, namePlural: string }) => {
            var ccyDO = new CurrencyDO();
            ccyDO.symbol = readCurrency.symbol;
            ccyDO.name = readCurrency.name;
            ccyDO.nativeSymbol = readCurrency.nativeSymbol;
            ccyDO.code = readCurrency.code;
            ccyDO.namePlural = readCurrency.namePlural;
            toAddCurrencies.push(ccyDO);
        });
        var ccySettingDO = new CurrencySettingDO();
        ccySettingDO.metadata = this.getSettingMetadata();
        ccySettingDO.value = toAddCurrencies;
        return ccySettingDO;
    }

    private dataSet: { symbol: string, name: string, nativeSymbol: string, code: string, namePlural: string }[] = [
        {
            symbol: "$",
            name: "US Dollar",
            nativeSymbol: "$",
            code: "USD",
            namePlural: "US dollars"
        },
        {
            symbol: "€",
            name: "Euro",
            nativeSymbol: "€",
            code: "EUR",
            namePlural: "euros"
        },
        {
            symbol: "AED",
            name: "United Arab Emirates Dirham",
            nativeSymbol: "د.إ.‏",
            code: "AED",
            namePlural: "UAE dirhams"
        },
        {
            symbol: "Af",
            name: "Afghan Afghani",
            nativeSymbol: "؋",
            code: "AFN",
            namePlural: "Afghan Afghanis"
        },
        {
            symbol: "ALL",
            name: "Albanian Lek",
            nativeSymbol: "Lek",
            code: "ALL",
            namePlural: "Albanian lekë"
        },
        {
            symbol: "AMD",
            name: "Armenian Dram",
            nativeSymbol: "դր.",
            code: "AMD",
            namePlural: "Armenian drams"
        },
        {
            symbol: "AR$",
            name: "Argentine Peso",
            nativeSymbol: "$",
            code: "ARS",
            namePlural: "Argentine pesos"
        },
        {
            symbol: "AU$",
            name: "Australian Dollar",
            nativeSymbol: "$",
            code: "AUD",
            namePlural: "Australian dollars"
        },
        {
            symbol: "man.",
            name: "Azerbaijani Manat",
            nativeSymbol: "ман.",
            code: "AZN",
            namePlural: "Azerbaijani manats"
        },
        {
            symbol: "KM",
            name: "Bosnia-Herzegovina Convertible Mark",
            nativeSymbol: "KM",
            code: "BAM",
            namePlural: "Bosnia-Herzegovina convertible marks"
        },
        {
            symbol: "Tk",
            name: "Bangladeshi Taka",
            nativeSymbol: "৳",
            code: "BDT",
            namePlural: "Bangladeshi takas"
        },
        {
            symbol: "BGN",
            name: "Bulgarian Lev",
            nativeSymbol: "лв.",
            code: "BGN",
            namePlural: "Bulgarian leva"
        },
        {
            symbol: "BD",
            name: "Bahraini Dinar",
            nativeSymbol: "د.ب.‏",
            code: "BHD",
            namePlural: "Bahraini dinars"
        },
        {
            symbol: "FBu",
            name: "Burundian Franc",
            nativeSymbol: "FBu",
            code: "BIF",
            namePlural: "Burundian francs"
        },
        {
            symbol: "BN$",
            name: "Brunei Dollar",
            nativeSymbol: "$",
            code: "BND",
            namePlural: "Brunei dollars"
        },
        {
            symbol: "Bs",
            name: "Bolivian Boliviano",
            nativeSymbol: "Bs",
            code: "BOB",
            namePlural: "Bolivian bolivianos"
        },
        {
            symbol: "R$",
            name: "Brazilian Real",
            nativeSymbol: "R$",
            code: "BRL",
            namePlural: "Brazilian reals"
        },
        {
            symbol: "BWP",
            name: "Botswanan Pula",
            nativeSymbol: "P",
            code: "BWP",
            namePlural: "Botswanan pulas"
        },
        {
            symbol: "BYR",
            name: "Belarusian Ruble",
            nativeSymbol: "BYR",
            code: "BYR",
            namePlural: "Belarusian rubles"
        },
        {
            symbol: "BZ$",
            name: "Belize Dollar",
            nativeSymbol: "$",
            code: "BZD",
            namePlural: "Belize dollars"
        },
        {
            symbol: "CDF",
            name: "Congolese Franc",
            nativeSymbol: "FrCD",
            code: "CDF",
            namePlural: "Congolese francs"
        },
        {
            symbol: "CHF",
            name: "Swiss Franc",
            nativeSymbol: "CHF",
            code: "CHF",
            namePlural: "Swiss francs"
        },
        {
            symbol: "CL$",
            name: "Chilean Peso",
            nativeSymbol: "$",
            code: "CLP",
            namePlural: "Chilean pesos"
        },
        {
            symbol: "CN¥",
            name: "Chinese Yuan",
            nativeSymbol: "CN¥",
            code: "CNY",
            namePlural: "Chinese yuan"
        },
        {
            symbol: "CO$",
            name: "Colombian Peso",
            nativeSymbol: "$",
            code: "COP",
            namePlural: "Colombian pesos"
        },
        {
            symbol: "₡",
            name: "Costa Rican Colón",
            nativeSymbol: "₡",
            code: "CRC",
            namePlural: "Costa Rican colóns"
        },
        {
            symbol: "CV$",
            name: "Cape Verdean Escudo",
            nativeSymbol: "CV$",
            code: "CVE",
            namePlural: "Cape Verdean escudos"
        },
        {
            symbol: "Kč",
            name: "Czech Republic Koruna",
            nativeSymbol: "Kč",
            code: "CZK",
            namePlural: "Czech Republic korunas"
        },
        {
            symbol: "Fdj",
            name: "Djiboutian Franc",
            nativeSymbol: "Fdj",
            code: "DJF",
            namePlural: "Djiboutian francs"
        },
        {
            symbol: "Dkr",
            name: "Danish Krone",
            nativeSymbol: "kr",
            code: "DKK",
            namePlural: "Danish kroner"
        },
        {
            symbol: "RD$",
            name: "Dominican Peso",
            nativeSymbol: "RD$",
            code: "DOP",
            namePlural: "Dominican pesos"
        },
        {
            symbol: "DA",
            name: "Algerian Dinar",
            nativeSymbol: "د.ج.‏",
            code: "DZD",
            namePlural: "Algerian dinars"
        },
        {
            symbol: "Ekr",
            name: "Estonian Kroon",
            nativeSymbol: "kr",
            code: "EEK",
            namePlural: "Estonian kroons"
        },
        {
            symbol: "EGP",
            name: "Egyptian Pound",
            nativeSymbol: "ج.م.‏",
            code: "EGP",
            namePlural: "Egyptian pounds"
        },
        {
            symbol: "Nfk",
            name: "Eritrean Nakfa",
            nativeSymbol: "Nfk",
            code: "ERN",
            namePlural: "Eritrean nakfas"
        },
        {
            symbol: "Br",
            name: "Ethiopian Birr",
            nativeSymbol: "Br",
            code: "ETB",
            namePlural: "Ethiopian birrs"
        },
        {
            symbol: "£",
            name: "British Pound Sterling",
            nativeSymbol: "£",
            code: "GBP",
            namePlural: "British pounds sterling"
        },
        {
            symbol: "GEL",
            name: "Georgian Lari",
            nativeSymbol: "GEL",
            code: "GEL",
            namePlural: "Georgian laris"
        },
        {
            symbol: "GH₵",
            name: "Ghanaian Cedi",
            nativeSymbol: "GH₵",
            code: "GHS",
            namePlural: "Ghanaian cedis"
        },
        {
            symbol: "FG",
            name: "Guinean Franc",
            nativeSymbol: "FG",
            code: "GNF",
            namePlural: "Guinean francs"
        },
        {
            symbol: "GTQ",
            name: "Guatemalan Quetzal",
            nativeSymbol: "Q",
            code: "GTQ",
            namePlural: "Guatemalan quetzals"
        },
        {
            symbol: "HK$",
            name: "Hong Kong Dollar",
            nativeSymbol: "$",
            code: "HKD",
            namePlural: "Hong Kong dollars"
        },
        {
            symbol: "HNL",
            name: "Honduran Lempira",
            nativeSymbol: "L",
            code: "HNL",
            namePlural: "Honduran lempiras"
        },
        {
            symbol: "kn",
            name: "Croatian Kuna",
            nativeSymbol: "kn",
            code: "HRK",
            namePlural: "Croatian kunas"
        },
        {
            symbol: "Ft",
            name: "Hungarian Forint",
            nativeSymbol: "Ft",
            code: "HUF",
            namePlural: "Hungarian forints"
        },
        {
            symbol: "Rp",
            name: "Indonesian Rupiah",
            nativeSymbol: "Rp",
            code: "IDR",
            namePlural: "Indonesian rupiahs"
        },
        {
            symbol: "₪",
            name: "Israeli New Sheqel",
            nativeSymbol: "₪",
            code: "ILS",
            namePlural: "Israeli new sheqels"
        },
        {
            symbol: "Rs",
            name: "Indian Rupee",
            nativeSymbol: "টকা",
            code: "INR",
            namePlural: "Indian rupees"
        },
        {
            symbol: "IQD",
            name: "Iraqi Dinar",
            nativeSymbol: "د.ع.‏",
            code: "IQD",
            namePlural: "Iraqi dinars"
        },
        {
            symbol: "IRR",
            name: "Iranian Rial",
            nativeSymbol: "﷼",
            code: "IRR",
            namePlural: "Iranian rials"
        },
        {
            symbol: "Ikr",
            name: "Icelandic Króna",
            nativeSymbol: "kr",
            code: "ISK",
            namePlural: "Icelandic krónur"
        },
        {
            symbol: "J$",
            name: "Jamaican Dollar",
            nativeSymbol: "$",
            code: "JMD",
            namePlural: "Jamaican dollars"
        },
        {
            symbol: "JD",
            name: "Jordanian Dinar",
            nativeSymbol: "د.أ.‏",
            code: "JOD",
            namePlural: "Jordanian dinars"
        },
        {
            symbol: "¥",
            name: "Japanese Yen",
            nativeSymbol: "￥",
            code: "JPY",
            namePlural: "Japanese yen"
        },
        {
            symbol: "Ksh",
            name: "Kenyan Shilling",
            nativeSymbol: "Ksh",
            code: "KES",
            namePlural: "Kenyan shillings"
        },
        {
            symbol: "KHR",
            name: "Cambodian Riel",
            nativeSymbol: "៛",
            code: "KHR",
            namePlural: "Cambodian riels"
        },
        {
            symbol: "CF",
            name: "Comorian Franc",
            nativeSymbol: "FC",
            code: "KMF",
            namePlural: "Comorian francs"
        },
        {
            symbol: "₩",
            name: "South Korean Won",
            nativeSymbol: "₩",
            code: "KRW",
            namePlural: "South Korean won"
        },
        {
            symbol: "KD",
            name: "Kuwaiti Dinar",
            nativeSymbol: "د.ك.‏",
            code: "KWD",
            namePlural: "Kuwaiti dinars"
        },
        {
            symbol: "KZT",
            name: "Kazakhstani Tenge",
            nativeSymbol: "тңг.",
            code: "KZT",
            namePlural: "Kazakhstani tenges"
        },
        {
            symbol: "LB£",
            name: "Lebanese Pound",
            nativeSymbol: "ل.ل.‏",
            code: "LBP",
            namePlural: "Lebanese pounds"
        },
        {
            symbol: "SLRs",
            name: "Sri Lankan Rupee",
            nativeSymbol: "SL Re",
            code: "LKR",
            namePlural: "Sri Lankan rupees"
        },
        {
            symbol: "Lt",
            name: "Lithuanian Litas",
            nativeSymbol: "Lt",
            code: "LTL",
            namePlural: "Lithuanian litai"
        },
        {
            symbol: "Ls",
            name: "Latvian Lats",
            nativeSymbol: "Ls",
            code: "LVL",
            namePlural: "Latvian lati"
        },
        {
            symbol: "LD",
            name: "Libyan Dinar",
            nativeSymbol: "د.ل.‏",
            code: "LYD",
            namePlural: "Libyan dinars"
        },
        {
            symbol: "MAD",
            name: "Moroccan Dirham",
            nativeSymbol: "د.م.‏",
            code: "MAD",
            namePlural: "Moroccan dirhams"
        },
        {
            symbol: "MDL",
            name: "Moldavian Leu",
            nativeSymbol: "MDL",
            code: "MDL",
            namePlural: "Moldavian lei"
        },
        {
            symbol: "MGA",
            name: "Malagasy Ariary",
            nativeSymbol: "MGA",
            code: "MGA",
            namePlural: "Malagasy Ariaries"
        },
        {
            symbol: "MKD",
            name: "Macedonian Denar",
            nativeSymbol: "MKD",
            code: "MKD",
            namePlural: "Macedonian denari"
        },
        {
            symbol: "MMK",
            name: "Myanma Kyat",
            nativeSymbol: "K",
            code: "MMK",
            namePlural: "Myanma kyats"
        },
        {
            symbol: "MOP$",
            name: "Macanese Pataca",
            nativeSymbol: "MOP$",
            code: "MOP",
            namePlural: "Macanese patacas"
        },
        {
            symbol: "MURs",
            name: "Mauritian Rupee",
            nativeSymbol: "MURs",
            code: "MUR",
            namePlural: "Mauritian rupees"
        },
        {
            symbol: "MX$",
            name: "Mexican Peso",
            nativeSymbol: "$",
            code: "MXN",
            namePlural: "Mexican pesos"
        },
        {
            symbol: "RM",
            name: "Malaysian Ringgit",
            nativeSymbol: "RM",
            code: "MYR",
            namePlural: "Malaysian ringgits"
        },
        {
            symbol: "MTn",
            name: "Mozambican Metical",
            nativeSymbol: "MTn",
            code: "MZN",
            namePlural: "Mozambican meticals"
        },
        {
            symbol: "N$",
            name: "Namibian Dollar",
            nativeSymbol: "N$",
            code: "NAD",
            namePlural: "Namibian dollars"
        },
        {
            symbol: "₦",
            name: "Nigerian Naira",
            nativeSymbol: "₦",
            code: "NGN",
            namePlural: "Nigerian nairas"
        },
        {
            symbol: "C$",
            name: "Nicaraguan Córdoba",
            nativeSymbol: "C$",
            code: "NIO",
            namePlural: "Nicaraguan córdobas"
        },
        {
            symbol: "Nkr",
            name: "Norwegian Krone",
            nativeSymbol: "kr",
            code: "NOK",
            namePlural: "Norwegian kroner"
        },
        {
            symbol: "NPRs",
            name: "Nepalese Rupee",
            nativeSymbol: "नेरू",
            code: "NPR",
            namePlural: "Nepalese rupees"
        },
        {
            symbol: "NZ$",
            name: "New Zealand Dollar",
            nativeSymbol: "$",
            code: "NZD",
            namePlural: "New Zealand dollars"
        },
        {
            symbol: "OMR",
            name: "Omani Rial",
            nativeSymbol: "ر.ع.‏",
            code: "OMR",
            namePlural: "Omani rials"
        },
        {
            symbol: "B/.",
            name: "Panamanian Balboa",
            nativeSymbol: "B/.",
            code: "PAB",
            namePlural: "Panamanian balboas"
        },
        {
            symbol: "S/.",
            name: "Peruvian Nuevo Sol",
            nativeSymbol: "S/.",
            code: "PEN",
            namePlural: "Peruvian nuevos soles"
        },
        {
            symbol: "₱",
            name: "Philippine Peso",
            nativeSymbol: "₱",
            code: "PHP",
            namePlural: "Philippine pesos"
        },
        {
            symbol: "PKRs",
            name: "Pakistani Rupee",
            nativeSymbol: "₨",
            code: "PKR",
            namePlural: "Pakistani rupees"
        },
        {
            symbol: "zł",
            name: "Polish Zloty",
            nativeSymbol: "zł",
            code: "PLN",
            namePlural: "Polish zlotys"
        },
        {
            symbol: "₲",
            name: "Paraguayan Guarani",
            nativeSymbol: "₲",
            code: "PYG",
            namePlural: "Paraguayan guaranis"
        },
        {
            symbol: "QR",
            name: "Qatari Rial",
            nativeSymbol: "ر.ق.‏",
            code: "QAR",
            namePlural: "Qatari rials"
        },
        {
            symbol: "RON",
            name: "Romanian Leu",
            nativeSymbol: "RON",
            code: "RON",
            namePlural: "Romanian lei"
        },
        {
            symbol: "din.",
            name: "Serbian Dinar",
            nativeSymbol: "дин.",
            code: "RSD",
            namePlural: "Serbian dinars"
        },
        {
            symbol: "RUB",
            name: "Russian Ruble",
            nativeSymbol: "руб.",
            code: "RUB",
            namePlural: "Russian rubles"
        },
        {
            symbol: "RWF",
            name: "Rwandan Franc",
            nativeSymbol: "FR",
            code: "RWF",
            namePlural: "Rwandan francs"
        },
        {
            symbol: "SR",
            name: "Saudi Riyal",
            nativeSymbol: "ر.س.‏",
            code: "SAR",
            namePlural: "Saudi riyals"
        },
        {
            symbol: "SDG",
            name: "Sudanese Pound",
            nativeSymbol: "SDG",
            code: "SDG",
            namePlural: "Sudanese pounds"
        },
        {
            symbol: "Skr",
            name: "Swedish Krona",
            nativeSymbol: "kr",
            code: "SEK",
            namePlural: "Swedish kronor"
        },
        {
            symbol: "S$",
            name: "Singapore Dollar",
            nativeSymbol: "$",
            code: "SGD",
            namePlural: "Singapore dollars"
        },
        {
            symbol: "Ssh",
            name: "Somali Shilling",
            nativeSymbol: "Ssh",
            code: "SOS",
            namePlural: "Somali shillings"
        },
        {
            symbol: "SY£",
            name: "Syrian Pound",
            nativeSymbol: "ل.س.‏",
            code: "SYP",
            namePlural: "Syrian pounds"
        },
        {
            symbol: "฿",
            name: "Thai Baht",
            nativeSymbol: "฿",
            code: "THB",
            namePlural: "Thai baht"
        },
        {
            symbol: "DT",
            name: "Tunisian Dinar",
            nativeSymbol: "د.ت.‏",
            code: "TND",
            namePlural: "Tunisian dinars"
        },
        {
            symbol: "T$",
            name: "Tongan Paʻanga",
            nativeSymbol: "T$",
            code: "TOP",
            namePlural: "Tongan paʻanga"
        },
        {
            symbol: "TL",
            name: "Turkish Lira",
            nativeSymbol: "TL",
            code: "TRY",
            namePlural: "Turkish Lira"
        },
        {
            symbol: "TT$",
            name: "Trinidad and Tobago Dollar",
            nativeSymbol: "$",
            code: "TTD",
            namePlural: "Trinidad and Tobago dollars"
        },
        {
            symbol: "NT$",
            name: "New Taiwan Dollar",
            nativeSymbol: "NT$",
            code: "TWD",
            namePlural: "New Taiwan dollars"
        },
        {
            symbol: "TSh",
            name: "Tanzanian Shilling",
            nativeSymbol: "TSh",
            code: "TZS",
            namePlural: "Tanzanian shillings"
        },
        {
            symbol: "₴",
            name: "Ukrainian Hryvnia",
            nativeSymbol: "₴",
            code: "UAH",
            namePlural: "Ukrainian hryvnias"
        },
        {
            symbol: "USh",
            name: "Ugandan Shilling",
            nativeSymbol: "USh",
            code: "UGX",
            namePlural: "Ugandan shillings"
        },
        {
            symbol: "$U",
            name: "Uruguayan Peso",
            nativeSymbol: "$",
            code: "UYU",
            namePlural: "Uruguayan pesos"
        },
        {
            symbol: "UZS",
            name: "Uzbekistan Som",
            nativeSymbol: "UZS",
            code: "UZS",
            namePlural: "Uzbekistan som"
        },
        {
            symbol: "Bs.F.",
            name: "Venezuelan Bolívar",
            nativeSymbol: "Bs.F.",
            code: "VEF",
            namePlural: "Venezuelan bolívars"
        },
        {
            symbol: "₫",
            name: "Vietnamese Dong",
            nativeSymbol: "₫",
            code: "VND",
            namePlural: "Vietnamese dong"
        },
        {
            symbol: "FCFA",
            name: "CFA Franc BEAC",
            nativeSymbol: "FCFA",
            code: "XAF",
            namePlural: "CFA francs BEAC"
        },
        {
            symbol: "CFA",
            name: "CFA Franc BCEAO",
            nativeSymbol: "CFA",
            code: "XOF",
            namePlural: "CFA francs BCEAO"
        },
        {
            symbol: "YR",
            name: "Yemeni Rial",
            nativeSymbol: "ر.ي.‏",
            code: "YER",
            namePlural: "Yemeni rials"
        },
        {
            symbol: "R",
            name: "South African Rand",
            nativeSymbol: "R",
            code: "ZAR",
            namePlural: "South African rand"
        },
        {
            symbol: "ZK",
            name: "Zambian Kwacha",
            nativeSymbol: "ZK",
            code: "ZMK",
            namePlural: "Zambian kwachas"
        }
    ];
}   
    