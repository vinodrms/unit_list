import {KeyMetricDO} from '../../data-objects/result-item/KeyMetricDO';
import {KeyMetricMeta} from './KeyMetricMeta';

export class KeyMetricVM {
    private _keyMetricDO: KeyMetricDO;
    private _meta: KeyMetricMeta;

    public get keyMetricDO(): KeyMetricDO {
        return this._keyMetricDO;
    }
    public set keyMetricDO(keyMetricDO: KeyMetricDO) {
        this._keyMetricDO = keyMetricDO;
    }
    public get meta(): KeyMetricMeta {
        return this._meta;
    }
    public set meta(meta: KeyMetricMeta) {
        this._meta = meta;
    }
}