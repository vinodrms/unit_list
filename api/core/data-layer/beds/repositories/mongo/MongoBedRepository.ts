import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IBedRepository, BedMetaRepoDO, BedItemMetaRepoDO, BedSearchCriteriaRepoDO, BedSearchResultRepoDO} from '../IBedRepository';
import {BedDO, BedStatus} from '../../../common/data-objects/bed/BedDO';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {MongoBedReadOperationsRepository} from './operations/MongoBedReadOperationsRepository';
import {MongoBedEditOperationsRepository} from './operations/MongoBedEditOperationsRepository';

import async = require('async');
import _ = require('underscore');

export class MongoBedRepository extends MongoRepository implements IBedRepository {
    private _readRepository: MongoBedReadOperationsRepository;
    private _editRepository: MongoBedEditOperationsRepository;
    
    constructor() {
        var bedsEntity = sails.models.bedsentity;
        super(bedsEntity);
        this._readRepository = new MongoBedReadOperationsRepository(bedsEntity);
        this._editRepository = new MongoBedEditOperationsRepository(bedsEntity);
    }

    public getBedList(bedMeta: BedMetaRepoDO, searchCriteria?: BedSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BedSearchResultRepoDO> {
        return this._readRepository.getBedList(bedMeta, searchCriteria, lazyLoad);
    }
    
    public getBedListCount(bedMeta: BedMetaRepoDO, searchCriteria: BedSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._readRepository.getBedListCount(bedMeta, searchCriteria);
    }
    
    public getBedById(bedMeta: BedMetaRepoDO, bedId: string): Promise<BedDO> {
        return this._readRepository.getBedById(bedMeta, bedId);
    }

    public addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO> {
        return this._editRepository.addBed(bedMeta, bed);
    }

    public updateBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, bed: BedDO): Promise<BedDO> {
        return this._editRepository.updateBed(bedMeta, bedItemMeta, bed);
    }
    public deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO> {
        return this._editRepository.deleteBed(bedMeta, bedItemMeta);
    }
}