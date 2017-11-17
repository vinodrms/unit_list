import { ABaseSetting } from './ABaseSetting';
import { SettingMetadataDO, SettingType } from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import { CurrencyDO } from '../../../../../../../data-layer/common/data-objects/currency/CurrencyDO';
import { CurrencySettingDO } from '../../../../../../../data-layer/settings/data-objects/currency/CurrencySettingDO';

export class CurrencyCodes extends ABaseSetting {
    constructor() {
        super(SettingType.CurrencyCodes, "Currency Codes");
    }

    public getCurrencySettingDO(): CurrencySettingDO {
        var readCurrencies = this.dataSet;
        var toAddCurrencies: CurrencyDO[] = [];
        readCurrencies.forEach((readCurrency: { symbol: string, name: string, nativeSymbol: string, code: string, namePlural: string, decimalsNo: number}) => {
            var ccyDO = new CurrencyDO();
            ccyDO.symbol = readCurrency.symbol;
            ccyDO.name = readCurrency.name;
            ccyDO.nativeSymbol = readCurrency.nativeSymbol;
            ccyDO.code = readCurrency.code;
            ccyDO.namePlural = readCurrency.namePlural;
            ccyDO.decimalsNo = readCurrency.decimalsNo;
            toAddCurrencies.push(ccyDO);
        });
        var ccySettingDO = new CurrencySettingDO();
        ccySettingDO.metadata = this.getSettingMetadata();
        ccySettingDO.value = toAddCurrencies;
        return ccySettingDO;
    }

    private dataSet: { symbol: string, name: string, nativeSymbol: string, code: string, namePlural: string, decimalsNo: number}[] = [
        {
            symbol: "$",
            name: "US Dollar",
            nativeSymbol: "$",
            code: "USD",
            namePlural: "US dollars",
            decimalsNo: 2
        },
        {
            symbol: "€",
            name: "Euro",
            nativeSymbol: "€",
            code: "EUR",
            namePlural: "euros",
            decimalsNo: 2
        },
        {
            symbol: "AED",
            name: "United Arab Emirates Dirham",
            nativeSymbol: "د.إ.‏",
            code: "AED",
            namePlural: "UAE dirhams",
            decimalsNo: 2
        },
        {
            symbol: "Af",
            name: "Afghan Afghani",
            nativeSymbol: "؋",
            code: "AFN",
            namePlural: "Afghan Afghanis",
            decimalsNo: 2
        },
        {
            symbol: "ALL",
            name: "Albanian Lek",
            nativeSymbol: "Lek",
            code: "ALL",
            namePlural: "Albanian lekë",
            decimalsNo: 2
        },
        {
            symbol: "AMD",
            name: "Armenian Dram",
            nativeSymbol: "դր.",
            code: "AMD",
            namePlural: "Armenian drams",
            decimalsNo: 2
        },
        {
            symbol: "AR$",
            name: "Argentine Peso",
            nativeSymbol: "$",
            code: "ARS",
            namePlural: "Argentine pesos",
            decimalsNo: 2
        },
        {
            symbol: "AU$",
            name: "Australian Dollar",
            nativeSymbol: "$",
            code: "AUD",
            namePlural: "Australian dollars",
            decimalsNo: 2
        },
        {
            symbol: "man.",
            name: "Azerbaijani Manat",
            nativeSymbol: "ман.",
            code: "AZN",
            namePlural: "Azerbaijani manats",
            decimalsNo: 2
        },
        {
            symbol: "KM",
            name: "Bosnia-Herzegovina Convertible Mark",
            nativeSymbol: "KM",
            code: "BAM",
            namePlural: "Bosnia-Herzegovina convertible marks",
            decimalsNo: 2
        },
        {
            symbol: "Tk",
            name: "Bangladeshi Taka",
            nativeSymbol: "৳",
            code: "BDT",
            namePlural: "Bangladeshi takas",
            decimalsNo: 2
        },
        {
            symbol: "BGN",
            name: "Bulgarian Lev",
            nativeSymbol: "лв.",
            code: "BGN",
            namePlural: "Bulgarian leva",
            decimalsNo: 2
        },
        {
            symbol: "BD",
            name: "Bahraini Dinar",
            nativeSymbol: "د.ب.‏",
            code: "BHD",
            namePlural: "Bahraini dinars",
            decimalsNo: 3
        },
        {
            symbol: "FBu",
            name: "Burundian Franc",
            nativeSymbol: "FBu",
            code: "BIF",
            namePlural: "Burundian francs",
            decimalsNo: 0
        },
        {
            symbol: "BN$",
            name: "Brunei Dollar",
            nativeSymbol: "$",
            code: "BND",
            namePlural: "Brunei dollars",
            decimalsNo: 2
        },
        {
            symbol: "Bs",
            name: "Bolivian Boliviano",
            nativeSymbol: "Bs",
            code: "BOB",
            namePlural: "Bolivian bolivianos",
            decimalsNo: 2
        },
        {
            symbol: "R$",
            name: "Brazilian Real",
            nativeSymbol: "R$",
            code: "BRL",
            namePlural: "Brazilian reals",
            decimalsNo: 2
        },
        {
            symbol: "BWP",
            name: "Botswanan Pula",
            nativeSymbol: "P",
            code: "BWP",
            namePlural: "Botswanan pulas",
            decimalsNo: 2
        },
        {
            symbol: "BYN",
            name: "Belarusian Ruble",
            nativeSymbol: "BYN",
            code: "BYN",
            namePlural: "Belarusian rubles",
            decimalsNo: 2
        },
        {
            symbol: "BZ$",
            name: "Belize Dollar",
            nativeSymbol: "$",
            code: "BZD",
            namePlural: "Belize dollars",
            decimalsNo: 2
        },
        {
            symbol: "CDF",
            name: "Congolese Franc",
            nativeSymbol: "FrCD",
            code: "CDF",
            namePlural: "Congolese francs",
            decimalsNo: 2
        },
        {
            symbol: "CHF",
            name: "Swiss Franc",
            nativeSymbol: "CHF",
            code: "CHF",
            namePlural: "Swiss francs",
            decimalsNo: 2
        },
        {
            symbol: "CL$",
            name: "Chilean Peso",
            nativeSymbol: "$",
            code: "CLP",
            namePlural: "Chilean pesos",
            decimalsNo: 0
        },
        {
            symbol: "CN¥",
            name: "Chinese Yuan",
            nativeSymbol: "CN¥",
            code: "CNY",
            namePlural: "Chinese yuan",
            decimalsNo: 2
        },
        {
            symbol: "CO$",
            name: "Colombian Peso",
            nativeSymbol: "$",
            code: "COP",
            namePlural: "Colombian pesos",
            decimalsNo: 2
        },
        {
            symbol: "₡",
            name: "Costa Rican Colón",
            nativeSymbol: "₡",
            code: "CRC",
            namePlural: "Costa Rican colóns",
            decimalsNo: 2
        },
        {
            symbol: "CV$",
            name: "Cape Verdean Escudo",
            nativeSymbol: "CV$",
            code: "CVE",
            namePlural: "Cape Verdean escudos",
            decimalsNo: 0
        },
        {
            symbol: "Kč",
            name: "Czech Republic Koruna",
            nativeSymbol: "Kč",
            code: "CZK",
            namePlural: "Czech Republic korunas",
            decimalsNo: 2
        },
        {
            symbol: "Fdj",
            name: "Djiboutian Franc",
            nativeSymbol: "Fdj",
            code: "DJF",
            namePlural: "Djiboutian francs",
            decimalsNo: 0
        },
        {
            symbol: "Dkr",
            name: "Danish Krone",
            nativeSymbol: "kr",
            code: "DKK",
            namePlural: "Danish kroner",
            decimalsNo: 2
        },
        {
            symbol: "RD$",
            name: "Dominican Peso",
            nativeSymbol: "RD$",
            code: "DOP",
            namePlural: "Dominican pesos",
            decimalsNo: 2
        },
        {
            symbol: "DA",
            name: "Algerian Dinar",
            nativeSymbol: "د.ج.‏",
            code: "DZD",
            namePlural: "Algerian dinars",
            decimalsNo: 2
        },
        {
            symbol: "EGP",
            name: "Egyptian Pound",
            nativeSymbol: "ج.م.‏",
            code: "EGP",
            namePlural: "Egyptian pounds",
            decimalsNo: 2
        },
        {
            symbol: "Nfk",
            name: "Eritrean Nakfa",
            nativeSymbol: "Nfk",
            code: "ERN",
            namePlural: "Eritrean nakfas",
            decimalsNo: 2
        },
        {
            symbol: "Br",
            name: "Ethiopian Birr",
            nativeSymbol: "Br",
            code: "ETB",
            namePlural: "Ethiopian birrs",
            decimalsNo: 2
        },
        {
            symbol: "£",
            name: "British Pound Sterling",
            nativeSymbol: "£",
            code: "GBP",
            namePlural: "British pounds sterling",
            decimalsNo: 2
        },
        {
            symbol: "GEL",
            name: "Georgian Lari",
            nativeSymbol: "GEL",
            code: "GEL",
            namePlural: "Georgian laris",
            decimalsNo: 2
        },
        {
            symbol: "GH₵",
            name: "Ghanaian Cedi",
            nativeSymbol: "GH₵",
            code: "GHS",
            namePlural: "Ghanaian cedis",
            decimalsNo: 2
        },
        {
            symbol: "FG",
            name: "Guinean Franc",
            nativeSymbol: "FG",
            code: "GNF",
            namePlural: "Guinean francs",
            decimalsNo: 0
        },
        {
            symbol: "GTQ",
            name: "Guatemalan Quetzal",
            nativeSymbol: "Q",
            code: "GTQ",
            namePlural: "Guatemalan quetzals",
            decimalsNo: 2
        },
        {
            symbol: "HK$",
            name: "Hong Kong Dollar",
            nativeSymbol: "$",
            code: "HKD",
            namePlural: "Hong Kong dollars",
            decimalsNo: 2
        },
        {
            symbol: "HNL",
            name: "Honduran Lempira",
            nativeSymbol: "L",
            code: "HNL",
            namePlural: "Honduran lempiras",
            decimalsNo: 2
        },
        {
            symbol: "kn",
            name: "Croatian Kuna",
            nativeSymbol: "kn",
            code: "HRK",
            namePlural: "Croatian kunas",
            decimalsNo: 2
        },
        {
            symbol: "Ft",
            name: "Hungarian Forint",
            nativeSymbol: "Ft",
            code: "HUF",
            namePlural: "Hungarian forints",
            decimalsNo: 2
        },
        {
            symbol: "Rp",
            name: "Indonesian Rupiah",
            nativeSymbol: "Rp",
            code: "IDR",
            namePlural: "Indonesian rupiahs",
            decimalsNo: 2
        },
        {
            symbol: "₪",
            name: "Israeli New Sheqel",
            nativeSymbol: "₪",
            code: "ILS",
            namePlural: "Israeli new sheqels",
            decimalsNo: 2
        },
        {
            symbol: "Rs",
            name: "Indian Rupee",
            nativeSymbol: "টকা",
            code: "INR",
            namePlural: "Indian rupees",
            decimalsNo: 2
        },
        {
            symbol: "IQD",
            name: "Iraqi Dinar",
            nativeSymbol: "د.ع.‏",
            code: "IQD",
            namePlural: "Iraqi dinars",
            decimalsNo: 3
        },
        {
            symbol: "IRR",
            name: "Iranian Rial",
            nativeSymbol: "﷼",
            code: "IRR",
            namePlural: "Iranian rials",
            decimalsNo: 2
        },
        {
            symbol: "Ikr",
            name: "Icelandic Króna",
            nativeSymbol: "kr",
            code: "ISK",
            namePlural: "Icelandic krónur",
            decimalsNo: 0
        },
        {
            symbol: "J$",
            name: "Jamaican Dollar",
            nativeSymbol: "$",
            code: "JMD",
            namePlural: "Jamaican dollars",
            decimalsNo: 2
        },
        {
            symbol: "JD",
            name: "Jordanian Dinar",
            nativeSymbol: "د.أ.‏",
            code: "JOD",
            namePlural: "Jordanian dinars",
            decimalsNo: 3
        },
        {
            symbol: "¥",
            name: "Japanese Yen",
            nativeSymbol: "￥",
            code: "JPY",
            namePlural: "Japanese yen",
            decimalsNo: 0
        },
        {
            symbol: "Ksh",
            name: "Kenyan Shilling",
            nativeSymbol: "Ksh",
            code: "KES",
            namePlural: "Kenyan shillings",
            decimalsNo: 2
        },
        {
            symbol: "KHR",
            name: "Cambodian Riel",
            nativeSymbol: "៛",
            code: "KHR",
            namePlural: "Cambodian riels",
            decimalsNo: 2
        },
        {
            symbol: "CF",
            name: "Comorian Franc",
            nativeSymbol: "FC",
            code: "KMF",
            namePlural: "Comorian francs",
            decimalsNo: 0
        },
        {
            symbol: "₩",
            name: "South Korean Won",
            nativeSymbol: "₩",
            code: "KRW",
            namePlural: "South Korean won",
            decimalsNo: 0
        },
        {
            symbol: "KD",
            name: "Kuwaiti Dinar",
            nativeSymbol: "د.ك.‏",
            code: "KWD",
            namePlural: "Kuwaiti dinars",
            decimalsNo: 3
        },
        {
            symbol: "KZT",
            name: "Kazakhstani Tenge",
            nativeSymbol: "тңг.",
            code: "KZT",
            namePlural: "Kazakhstani tenges",
            decimalsNo: 2
        },
        {
            symbol: "LB£",
            name: "Lebanese Pound",
            nativeSymbol: "ل.ل.‏",
            code: "LBP",
            namePlural: "Lebanese pounds",
            decimalsNo: 2
        },
        {
            symbol: "SLRs",
            name: "Sri Lankan Rupee",
            nativeSymbol: "SL Re",
            code: "LKR",
            namePlural: "Sri Lankan rupees",
            decimalsNo: 2
        },
        {
            symbol: "LD",
            name: "Libyan Dinar",
            nativeSymbol: "د.ل.‏",
            code: "LYD",
            namePlural: "Libyan dinars",
            decimalsNo: 3
        },
        {
            symbol: "MAD",
            name: "Moroccan Dirham",
            nativeSymbol: "د.م.‏",
            code: "MAD",
            namePlural: "Moroccan dirhams",
            decimalsNo: 2
        },
        {
            symbol: "MDL",
            name: "Moldavian Leu",
            nativeSymbol: "MDL",
            code: "MDL",
            namePlural: "Moldavian lei",
            decimalsNo: 2
        },
        {
            symbol: "MGA",
            name: "Malagasy Ariary",
            nativeSymbol: "MGA",
            code: "MGA",
            namePlural: "Malagasy Ariaries",
            decimalsNo: 1
        },
        {
            symbol: "MKD",
            name: "Macedonian Denar",
            nativeSymbol: "MKD",
            code: "MKD",
            namePlural: "Macedonian denari",
            decimalsNo: 2
        },
        {
            symbol: "MMK",
            name: "Myanma Kyat",
            nativeSymbol: "K",
            code: "MMK",
            namePlural: "Myanma kyats",
            decimalsNo: 2
        },
        {
            symbol: "MOP$",
            name: "Macanese Pataca",
            nativeSymbol: "MOP$",
            code: "MOP",
            namePlural: "Macanese patacas",
            decimalsNo: 2
        },
        {
            symbol: "MURs",
            name: "Mauritian Rupee",
            nativeSymbol: "MURs",
            code: "MUR",
            namePlural: "Mauritian rupees",
            decimalsNo: 2
        },
        {
            symbol: "MX$",
            name: "Mexican Peso",
            nativeSymbol: "$",
            code: "MXN",
            namePlural: "Mexican pesos",
            decimalsNo: 2
        },
        {
            symbol: "RM",
            name: "Malaysian Ringgit",
            nativeSymbol: "RM",
            code: "MYR",
            namePlural: "Malaysian ringgits",
            decimalsNo: 2
        },
        {
            symbol: "MTn",
            name: "Mozambican Metical",
            nativeSymbol: "MTn",
            code: "MZN",
            namePlural: "Mozambican meticals",
            decimalsNo: 2
        },
        {
            symbol: "N$",
            name: "Namibian Dollar",
            nativeSymbol: "N$",
            code: "NAD",
            namePlural: "Namibian dollars",
            decimalsNo: 2
        },
        {
            symbol: "₦",
            name: "Nigerian Naira",
            nativeSymbol: "₦",
            code: "NGN",
            namePlural: "Nigerian nairas",
            decimalsNo: 2
        },
        {
            symbol: "C$",
            name: "Nicaraguan Córdoba",
            nativeSymbol: "C$",
            code: "NIO",
            namePlural: "Nicaraguan córdobas",
            decimalsNo: 2
        },
        {
            symbol: "Nkr",
            name: "Norwegian Krone",
            nativeSymbol: "kr",
            code: "NOK",
            namePlural: "Norwegian kroner",
            decimalsNo: 2
        },
        {
            symbol: "NPRs",
            name: "Nepalese Rupee",
            nativeSymbol: "नेरू",
            code: "NPR",
            namePlural: "Nepalese rupees",
            decimalsNo: 2
        },
        {
            symbol: "NZ$",
            name: "New Zealand Dollar",
            nativeSymbol: "$",
            code: "NZD",
            namePlural: "New Zealand dollars",
            decimalsNo: 2
        },
        {
            symbol: "OMR",
            name: "Omani Rial",
            nativeSymbol: "ر.ع.‏",
            code: "OMR",
            namePlural: "Omani rials",
            decimalsNo: 3
        },
        {
            symbol: "B/.",
            name: "Panamanian Balboa",
            nativeSymbol: "B/.",
            code: "PAB",
            namePlural: "Panamanian balboas",
            decimalsNo: 2
        },
        {
            symbol: "S/.",
            name: "Peruvian Nuevo Sol",
            nativeSymbol: "S/.",
            code: "PEN",
            namePlural: "Peruvian nuevos soles",
            decimalsNo: 2
        },
        {
            symbol: "₱",
            name: "Philippine Peso",
            nativeSymbol: "₱",
            code: "PHP",
            namePlural: "Philippine pesos",
            decimalsNo: 2
        },
        {
            symbol: "PKRs",
            name: "Pakistani Rupee",
            nativeSymbol: "₨",
            code: "PKR",
            namePlural: "Pakistani rupees",
            decimalsNo: 2
        },
        {
            symbol: "zł",
            name: "Polish Zloty",
            nativeSymbol: "zł",
            code: "PLN",
            namePlural: "Polish zlotys",
            decimalsNo: 2
        },
        {
            symbol: "₲",
            name: "Paraguayan Guarani",
            nativeSymbol: "₲",
            code: "PYG",
            namePlural: "Paraguayan guaranis",
            decimalsNo: 0
        },
        {
            symbol: "QR",
            name: "Qatari Rial",
            nativeSymbol: "ر.ق.‏",
            code: "QAR",
            namePlural: "Qatari rials",
            decimalsNo: 2
        },
        {
            symbol: "RON",
            name: "Romanian Leu",
            nativeSymbol: "RON",
            code: "RON",
            namePlural: "Romanian lei",
            decimalsNo: 2
        },
        {
            symbol: "din.",
            name: "Serbian Dinar",
            nativeSymbol: "дин.",
            code: "RSD",
            namePlural: "Serbian dinars",
            decimalsNo: 2
        },
        {
            symbol: "RUB",
            name: "Russian Ruble",
            nativeSymbol: "руб.",
            code: "RUB",
            namePlural: "Russian rubles",
            decimalsNo: 2
        },
        {
            symbol: "RWF",
            name: "Rwandan Franc",
            nativeSymbol: "FR",
            code: "RWF",
            namePlural: "Rwandan francs",
            decimalsNo: 0
        },
        {
            symbol: "SR",
            name: "Saudi Riyal",
            nativeSymbol: "ر.س.‏",
            code: "SAR",
            namePlural: "Saudi riyals",
            decimalsNo: 2
        },
        {
            symbol: "SDG",
            name: "Sudanese Pound",
            nativeSymbol: "SDG",
            code: "SDG",
            namePlural: "Sudanese pounds",
            decimalsNo: 2
        },
        {
            symbol: "Skr",
            name: "Swedish Krona",
            nativeSymbol: "kr",
            code: "SEK",
            namePlural: "Swedish kronor",
            decimalsNo: 2
        },
        {
            symbol: "S$",
            name: "Singapore Dollar",
            nativeSymbol: "$",
            code: "SGD",
            namePlural: "Singapore dollars",
            decimalsNo: 2
        },
        {
            symbol: "Ssh",
            name: "Somali Shilling",
            nativeSymbol: "Ssh",
            code: "SOS",
            namePlural: "Somali shillings",
            decimalsNo: 2
        },
        {
            symbol: "SY£",
            name: "Syrian Pound",
            nativeSymbol: "ل.س.‏",
            code: "SYP",
            namePlural: "Syrian pounds",
            decimalsNo: 2
        },
        {
            symbol: "฿",
            name: "Thai Baht",
            nativeSymbol: "฿",
            code: "THB",
            namePlural: "Thai baht",
            decimalsNo: 2
        },
        {
            symbol: "DT",
            name: "Tunisian Dinar",
            nativeSymbol: "د.ت.‏",
            code: "TND",
            namePlural: "Tunisian dinars",
            decimalsNo: 3
        },
        {
            symbol: "T$",
            name: "Tongan Paʻanga",
            nativeSymbol: "T$",
            code: "TOP",
            namePlural: "Tongan paʻanga",
            decimalsNo: 2
        },
        {
            symbol: "TL",
            name: "Turkish Lira",
            nativeSymbol: "TL",
            code: "TRY",
            namePlural: "Turkish Lira",
            decimalsNo: 2
        },
        {
            symbol: "TT$",
            name: "Trinidad and Tobago Dollar",
            nativeSymbol: "$",
            code: "TTD",
            namePlural: "Trinidad and Tobago dollars",
            decimalsNo: 2
        },
        {
            symbol: "NT$",
            name: "New Taiwan Dollar",
            nativeSymbol: "NT$",
            code: "TWD",
            namePlural: "New Taiwan dollars",
            decimalsNo: 2
        },
        {
            symbol: "TSh",
            name: "Tanzanian Shilling",
            nativeSymbol: "TSh",
            code: "TZS",
            namePlural: "Tanzanian shillings",
            decimalsNo: 2
        },
        {
            symbol: "₴",
            name: "Ukrainian Hryvnia",
            nativeSymbol: "₴",
            code: "UAH",
            namePlural: "Ukrainian hryvnias",
            decimalsNo: 2
        },
        {
            symbol: "USh",
            name: "Ugandan Shilling",
            nativeSymbol: "USh",
            code: "UGX",
            namePlural: "Ugandan shillings",
            decimalsNo: 0
        },
        {
            symbol: "$U",
            name: "Uruguayan Peso",
            nativeSymbol: "$",
            code: "UYU",
            namePlural: "Uruguayan pesos",
            decimalsNo: 2
        },
        {
            symbol: "UZS",
            name: "Uzbekistan Som",
            nativeSymbol: "UZS",
            code: "UZS",
            namePlural: "Uzbekistan som",
            decimalsNo: 2
        },
        {
            symbol: "Bs.F.",
            name: "Venezuelan Bolívar",
            nativeSymbol: "Bs.F.",
            code: "VEF",
            namePlural: "Venezuelan bolívars",
            decimalsNo: 2
        },
        {
            symbol: "₫",
            name: "Vietnamese Dong",
            nativeSymbol: "₫",
            code: "VND",
            namePlural: "Vietnamese dong",
            decimalsNo: 0
        },
        {
            symbol: "FCFA",
            name: "CFA Franc BEAC",
            nativeSymbol: "FCFA",
            code: "XAF",
            namePlural: "CFA francs BEAC",
            decimalsNo: 0
        },
        {
            symbol: "CFA",
            name: "CFA Franc BCEAO",
            nativeSymbol: "CFA",
            code: "XOF",
            namePlural: "CFA francs BCEAO",
            decimalsNo: 0
        },
        {
            symbol: "YR",
            name: "Yemeni Rial",
            nativeSymbol: "ر.ي.‏",
            code: "YER",
            namePlural: "Yemeni rials",
            decimalsNo: 2
        },
        {
            symbol: "R",
            name: "South African Rand",
            nativeSymbol: "R",
            code: "ZAR",
            namePlural: "South African rand",
            decimalsNo: 2
        },
        {
            symbol: "ZK",
            name: "Zambian Kwacha",
            nativeSymbol: "ZK",
            code: "ZMW",
            namePlural: "Zambian kwachas",
            decimalsNo: 2
        }
    ];
}
