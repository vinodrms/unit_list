import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThUtils} from '../../utils/ThUtils';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {AmenityDO} from '../../data-layer/common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../data-layer/common/data-objects/room-attribute/RoomAttributeDO';
import {RoomDO} from '../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {BedDO} from '../../data-layer/common/data-objects/bed/BedDO';
import {SaveRoomItemDO} from './SaveRoomItemDO';
import {RoomItemActionFactory} from './save-actions/RoomItemActionFactory';

import {RoomCategorySearchResultRepoDO} from '../../data-layer/room-categories/repositories/IRoomCategoryRepository';
import {SaveRoomCategoryItem} from '../../domain-layer/room-categories/SaveRoomCategoryItem';

import _ = require("underscore");

export class SaveRoomItem {
    private _thUtils: ThUtils;
    private _roomDO: SaveRoomItemDO;
    private _roomCategory: RoomCategoryDO;
    
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(roomDO: SaveRoomItemDO): Promise<RoomDO> {
        this._roomDO = roomDO;
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.saveCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SaveRoomItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving room", this._roomDO, thError);
                reject(thError);
            }
        });
    }
    private saveCore(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveRoomItemDO.getValidationStructure().validateStructure(this._roomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._roomDO);
            parser.logAndReject("Error validating data for save room", reject);
            return;
        }

        var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
        var roomCategoriesRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
        var bedsRepository = this._appContext.getRepositoryFactory().getBedRepository();
        
        roomCategoriesRepository.getRoomCategoryList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { displayName: this._roomDO.category }).then((result: RoomCategorySearchResultRepoDO) => {
            if (_.isEmpty(result.roomCategoryList)) {
                var saveRoomCategoryItem = new SaveRoomCategoryItem(this._appContext, this._sessionContext);
                saveRoomCategoryItem.save({ displayName: this._roomDO.category }).then((roomCategory: RoomCategoryDO) => {
                    this._roomCategory = roomCategory; 
                    return this.validateRoomItemReferences();
                }).catch((error: any) => {
                    var thError = new ThError(ThStatusCode.SaveRoomItemError, error);
                    if (thError.isNativeError()) {
                        ThLogger.getInstance().logError(ThLogLevel.Error, "error saving room item - error saving room category", this._roomDO, thError);
                    }
                    throw thError;
                });
            }
            else {
                this._roomCategory = result.roomCategoryList[0];
                return this.validateRoomItemReferences();
            }

        }).then((validReferences: boolean) => {
            if (!validReferences) {
                var thError = new ThError(ThStatusCode.SaveRoomItemInvalidAmenityList, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid room item references", this._roomDO, thError);
                throw thError;
            }

            return this.saveRoom();
        }).then((savedRoom: RoomDO) => {
            resolve(savedRoom);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.SaveRoomItemError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving room item", this._roomDO, thError);
            }
            reject(thError);
        });
    }

    private validateRoomItemReferences(): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.validateRoomItemReferencesCore(resolve, reject);
        });
    }

    private validateRoomItemReferencesCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
        var bedsRepository = this._appContext.getRepositoryFactory().getBedRepository();

        settingsRepository.getRoomAmenities().then((roomAmenityList: AmenityDO[]) => {
            if (!this.roomAmenityListIsValid(roomAmenityList)) {
                var thError = new ThError(ThStatusCode.SaveRoomItemInvalidAmenityList, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid amenity list", this._roomDO, thError);
                throw thError;
            }

            return settingsRepository.getRoomAttributes();
        }).then((roomAttributeList: RoomAttributeDO[]) => {
            if (!this.roomAttributeListIsValid(roomAttributeList)) {
                var thError = new ThError(ThStatusCode.SaveRoomItemInvalidAttributeList, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid attribute list", this._roomDO, thError);
                throw thError;
            }

            return bedsRepository.getBedList({ hotelId: this._sessionContext.sessionDO.hotel.id });
        }).then((bedList: BedDO[]) => {
            if (!this.bedListIsValid(bedList)) {
                var thError = new ThError(ThStatusCode.SaveRoomItemInvalidBedList, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid bed list", this._roomDO, thError);
                throw thError;
            }

            resolve(true);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.SaveRoomItemError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving room item - amenities, attributes, beds validation error", this._roomDO, thError);
            }
            reject(thError);
        });

    }

    private roomAttributeListIsValid(roomAttributeList: RoomAttributeDO[]): boolean {
        var hotelRoomAttributeIdList: string[] = _.map(roomAttributeList, (roomAttribute: RoomAttributeDO) => { return roomAttribute.id; });
        return _.intersection(hotelRoomAttributeIdList, this._roomDO.attributeIdList).length === this._roomDO.attributeIdList.length;
    }

    private roomAmenityListIsValid(roomAmenityList: AmenityDO[]): boolean {
        var hotelRoomAmenityIdList: string[] = _.map(roomAmenityList, (roomAmenity: AmenityDO) => { return roomAmenity.id; });
        return _.intersection(hotelRoomAmenityIdList, this._roomDO.amenityIdList).length === this._roomDO.amenityIdList.length;
    }

    private bedListIsValid(bedList: BedDO[]): boolean {
        var hotelBedIdList: string[] = _.map(bedList, (bed: BedDO) => { return bed.id; });
        return _.intersection(hotelBedIdList, this._roomDO.bedIdList).length === this._roomDO.bedIdList.length;
    }

    private saveRoom(): Promise<RoomDO> {
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.saveRoomCore(resolve, reject);
        });
    }
    private saveRoomCore(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        var actionFactory = new RoomItemActionFactory(this._appContext, this._sessionContext);
        var actionStrategy = actionFactory.getActionStrategy(this.buildRoomDO());
        actionStrategy.save(resolve, reject);
    }

    private buildRoomDO(): RoomDO {
        var room = new RoomDO();
        room.buildFromObject(this._roomDO);
        room.hotelId = this._sessionContext.sessionDO.hotel.id;
        room.categoryId = this._roomCategory.id;
        return room;
    }
}