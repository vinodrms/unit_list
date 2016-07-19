export class BookingPriceItem {
    roomCategoryId: string;
    price: number;
}

export class BookingPossiblePriceItems {
    priceItemList: BookingPriceItem[];
    constructor() {
        this.priceItemList = [];
    }
}