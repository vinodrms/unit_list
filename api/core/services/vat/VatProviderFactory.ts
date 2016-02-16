import {IVatProvider, VatDetailsDO} from './IVatProvider';
import {VIESVatProviderAdapter} from './providers/VIESVatProviderAdapter';

export class VatProviderFactory {
    constructor() {
    }

    public getEUVatProvider(): IVatProvider {
        return new VIESVatProviderAdapter();
    }
}