import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {IRepositoryCleaner} from '../../../common/base/IRepositoryCleaner';
import {IBedRepository, BedMetaRepoDO, BedItemMetaRepoDO} from '../IBedRepository';
import {BedDO} from '../../../common/data-objects/bed/BedDO';

import async = require('async');
import _ = require('underscore');

export class MongoBedRepository extends MongoRepository implements IBedRepository, IRepositoryCleaner {
    private _bedsEntity: Sails.Model;

    constructor() {
        var bedsEntity = sails.models.bedsentity;
        super(bedsEntity);
        this._bedsEntity = bedsEntity;
    }
    
    public addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO> {
        return null;
    }
    
    public deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO> {
        return null;
    }
    
    public createBedListAsync(bedList: BedDO[], finishAddBedCallback: { (err: any, savedBedList?: BedDO[]): void }) {
        this._bedsEntity.create(bedList).then((createdBedList: any) => {
            var savedBedList: BedDO[] = [];
            createdBedList.forEach(savedBed => {
                var savedBedDO: BedDO = new BedDO();
                savedBedDO.buildFromObject(savedBed);
                savedBedList.push(savedBedDO);
            });
            finishAddBedCallback(null, savedBedList);
        }).catch((err: Error) => {
            finishAddBedCallback(err);
        });
    }

    public saveBedAsync(bed: BedDO, finishAddBedCallback: { (err: any, savedBed?: BedDO): void }) {
        this.saveBed(bed).then((savedBed: BedDO) => {
            finishAddBedCallback(null, savedBed);
        }).catch((error: any) => {
            finishAddBedCallback(error);
        });
    }

    private saveBed(bed: BedDO): Promise<BedDO> {
        // if (this._thUtils.isUndefinedOrNull(bed.id))
            return new Promise<BedDO>((resolve, reject) => {
                this.createBedCore(resolve, reject, bed);
            });
        // return new Promise<BedDO>((resolve, reject) => {
        //     this.updateBedCore(resolve, reject, bed);
        // });
    }

    private createBedCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }, bed: BedDO) {
        this._bedsEntity.create(bed).then((createdBed: Sails.QueryResult) => {
            var savedBed: BedDO = new BedDO();
            savedBed.buildFromObject(createdBed);
            resolve(savedBed);
        }).catch((err: Error) => {
            var errorCode = this.getMongoErrorCode(err);
            if (errorCode == MongoErrorCodes.DuplicateKeyError) {
                var thError = new ThError(ThStatusCode.BedRepositoryBedAlreadyExists, err);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed already exists", bed, thError);
                reject(thError);
            }
            else {
                var thError = new ThError(ThStatusCode.BedRepositoryErrorAddingBed, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding bed", bed, thError);
                reject(thError);
            }
        });
    }

    // private updateBedCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }, bed: BedDO) {
    //     this._bedsEntity.update({ _id: bed.id }, bed).then((updatedBeds: Sails.QueryResult[]) => {
    //         if (!this._thUtils.isUndefinedOrNull(updatedBeds) && !_.isEmpty(updatedBeds)) {
    //             var updatedBed: BedDO = new BedDO();
    //             updatedBed.buildFromObject(updatedBeds[0]);
    //             resolve(updatedBed);
    //         }
    //         //TODO 
    //         // reject(error: no bed updated)
    //     }).catch((err: Error) => {
    //         var errorCode = this.getMongoErrorCode(err);
            
    //         //TODO
    //         // reject (error: update error)
    //         if (errorCode == MongoErrorCodes.DuplicateKeyError) {
    //             var thError = new ThError(ThStatusCode.BedRepositoryBedAlreadyExists, err);
    //             ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed already exists", bed, thError);
    //             reject(thError);
    //         }
    //         else {
    //             var thError = new ThError(ThStatusCode.BedRepositoryErrorAddingBed, err);
    //             ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding bed", bed, thError);
    //             reject(thError);
    //         }
    //     });
    // }

    public getBedListByHotelIdAsync(hotelId: string, finishGetBedByHotelIdCallback: { (err: any, bedList?: BedDO[]): void }) {
        this.getBedListByHotelId(hotelId).then((foundBedList: BedDO[]) => {
            finishGetBedByHotelIdCallback(null, foundBedList);
        }).catch((error: any) => {
            finishGetBedByHotelIdCallback(error);
        });
    }

    public getBedListByHotelId(hotelId: string): Promise<BedDO[]> {
        return new Promise<BedDO[]>((resolve, reject) => {
            this.getBedListByHotelIdCore(resolve, reject, hotelId);
        });
    }

    private getBedListByHotelIdCore(resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }, hotelId: string) {
        this._bedsEntity.find({ "hotelId": hotelId }).then((foundBedList: Sails.QueryResult[]) => {
            if (!foundBedList) {
                var thError = new ThError(ThStatusCode.BedRepositoryErrorFindingBedByHotelId, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid hotelId to retrieve bed configuration", { hotelId: hotelId }, thError);
                reject(thError);
                return;
            }
            var foundBedDOList: BedDO[] = [];

            foundBedList.forEach(foundBed => {
                var bedDO = new BedDO();
                bedDO.buildFromObject(foundBed);
                foundBedDOList.push(bedDO);
            });

            resolve(foundBedDOList);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.BedRepositoryErrorFindingBed, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting bed by hotelId", { hotelId: hotelId }, thError);
            reject(thError);
        });
    }

    public testPromiseChain() {
        this.getBedListByHotelId("")
            .then((bedList: BedDO[]) => {
                return this.getBedListByHotelId("");
            })
            .then((bedList: BedDO[]) => {
                return this.getBedListByHotelId("");
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    public testBedTransactionalUpdate(bed: BedDO): Promise<BedDO> {
        return new Promise<BedDO>((resolve, reject) => {
            this.testBedTransactionalUpdateCore(bed, resolve, reject);
        });
    }

    private testBedTransactionalUpdateCore(bed: BedDO, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        this.getBedById(bed.id)
            .then((bed: BedDO) => {
                if(!bed) {
                    reject(new ThError(ThStatusCode.BedRepositoryErrorFindingBed, null));
                    return;
                }
                return this.updateBed(bed);
            })
            .then((bed: BedDO) => {
                resolve(bed);
                return;
            })
            .catch((err: any) => {
                reject(err);
                return;
            });
    }
    
    public updateBed(bed: BedDO): Promise<BedDO> {
        return new Promise<BedDO>((resolve, reject) => {
            this.updateBedCore(bed, resolve, reject);
        });
    }
    
    private updateBedCore(bed: BedDO, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        this._bedsEntity.update({ _id: bed.id }, bed).then((updatedBeds: Sails.QueryResult[]) => {
            if (!this._thUtils.isUndefinedOrNull(updatedBeds) && !_.isEmpty(updatedBeds)) {
                var updatedBed: BedDO = new BedDO();
                updatedBed.buildFromObject(updatedBeds[0]);
                resolve(updatedBed);
            }
            //TODO 
            // reject(error: no bed updated)
        }).catch((err: Error) => {
            var errorCode = this.getMongoErrorCode(err);
            
            //TODO
            // reject (error: update error)
            if (errorCode == MongoErrorCodes.DuplicateKeyError) {
                var thError = new ThError(ThStatusCode.BedRepositoryBedAlreadyExists, err);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed already exists", bed, thError);
                reject(thError);
            }
            else {
                var thError = new ThError(ThStatusCode.BedRepositoryErrorAddingBed, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding bed", bed, thError);
                reject(thError);
            }
        });
    }
    
    public getBedById(id: string): Promise<BedDO> {
        return new Promise<BedDO>((resolve, reject) => {
            this.getBedByIdCore(resolve, reject, id);
        });
    }

    private getBedByIdCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }, id: string) {
        this._bedsEntity.findOne({ "id": id }).then((foundBed: Sails.QueryResult) => {
            if (!foundBed) {
                var thError = new ThError(ThStatusCode.HotelRepositoryHotelIdNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid id to retrieve hotel", { id: id }, thError);
                reject(thError);
                return;
            }
            var bed: BedDO = new BedDO();
            bed.buildFromObject(foundBed);
            resolve(bed);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.HotelRepositoryErrorFindingHotelById, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel by id", { id: id }, thError);
            reject(thError);
        });
    }

    public cleanRepository(): Promise<Object> {
        return this._bedsEntity.destroy({});
    }
}