import {HotelInventorySnapshotDO} from '../data-objects/HotelInventorySnapshotDO';
import {LazyLoadRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';

export interface HotelInventorySnapshotMetaRepoDO {
    hotelId: string;
}
export interface HotelInventorySnapshotSearchCriteriaRepoDO {
    interval?: ThDateIntervalDO;
    thDateUtcTimestamp?: number;
}
export interface HotelInventorySnapshotSearchResultRepoDO {
    lazyLoad?: LazyLoadRepoDO;
    snapshotList: HotelInventorySnapshotDO[];
}

export interface IHotelInventorySnapshotRepository {
    addSnapshot(meta: HotelInventorySnapshotMetaRepoDO, snapshot: HotelInventorySnapshotDO): Promise<HotelInventorySnapshotDO>;
    getSnapshotList(meta: HotelInventorySnapshotMetaRepoDO,
        searchCriteria?: HotelInventorySnapshotSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<HotelInventorySnapshotSearchResultRepoDO>;
}