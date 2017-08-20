import {MongoRepository} from '../../../common/base/MongoRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IAllotmentRepository, AllotmentMetaRepoDO, AllotmentItemMetaRepoDO, AllotmentSearchCriteriaRepoDO, AllotmentSearchResultRepoDO} from '../IAllotmentRepository';
import {AllotmentDO, AllotmentStatus} from '../../data-objects/AllotmentDO';
import {MongoAllotmentCrudOperationsRepository} from './operations/MongoAllotmentCrudOperationsRepository';
import {MongoAllotmentReadOperationsRepository} from './operations/MongoAllotmentReadOperationsRepository';

declare var sails: any;

export class MongoAllotmentRepository extends MongoRepository implements IAllotmentRepository {
	private _crudRepository: MongoAllotmentCrudOperationsRepository;
	private _readRepository: MongoAllotmentReadOperationsRepository;

	constructor() {
		var allotmentEntity = sails.models.allotmententity;
        super(allotmentEntity);
		this._crudRepository = new MongoAllotmentCrudOperationsRepository(allotmentEntity);
		this._readRepository = new MongoAllotmentReadOperationsRepository(allotmentEntity);
	}

	public getAllotmentListCount(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return this._readRepository.getAllotmentListCount(meta, searchCriteria);
	}
	public getAllotmentList(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AllotmentSearchResultRepoDO> {
		return this._readRepository.getAllotmentList(meta, searchCriteria, lazyLoad);
	}

	public getAllotmentById(meta: AllotmentMetaRepoDO, allotmentId: string): Promise<AllotmentDO> {
		return this._crudRepository.getAllotmentById(meta, allotmentId);
	}
	public addAllotment(meta: AllotmentMetaRepoDO, allotment: AllotmentDO): Promise<AllotmentDO> {
		return this._crudRepository.addAllotment(meta, allotment);
	}
	public updateAllotment(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, allotment: AllotmentDO): Promise<AllotmentDO> {
		return this._crudRepository.updateAllotment(meta, itemMeta, allotment);
	}
	public updateAllotmentStatus(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, status: AllotmentStatus): Promise<AllotmentDO> {
		return this._crudRepository.updateAllotmentStatus(meta, itemMeta, status);
	}
}