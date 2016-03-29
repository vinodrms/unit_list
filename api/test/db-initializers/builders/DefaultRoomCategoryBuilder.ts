import {RoomCategoryDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {AppContext} from '../../../core/utils/AppContext';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';

import _ = require('underscore');

export interface IRoomCategoryDataSource {
    getRoomCategoryList(): RoomCategoryDO[];
}

export class DefaultRoomCategoryBuilder implements IRoomCategoryDataSource {

    constructor(private _testContext: TestContext) {
    }

    public getRoomCategoryList(): RoomCategoryDO[] {
        var roomCategoryList = [];
        roomCategoryList.push(this.getFirstRoomCategory());
        roomCategoryList.push(this.getSecondRoomCategory());
        roomCategoryList.push(this.getThirdRoomCategory());
        roomCategoryList.push(this.getFourthRoomCategory());
        roomCategoryList.push(this.getFifthRoomCategory());
        roomCategoryList.push(this.getSixthRoomCategory());
        return roomCategoryList;
    }

    private getFirstRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Double Standard";
        return roomCategoryDO;
    }

    private getSecondRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Double Standard with Two Single Beds";
        return roomCategoryDO;
    }

    private getThirdRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Quad";
        return roomCategoryDO;
    }

    private getFourthRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Junior Suite for 4 adults";
        return roomCategoryDO;
    }
    
    private getFifthRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Single Standard";
        return roomCategoryDO;
    }
    
    private getSixthRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Triple Standard";
        return roomCategoryDO;
    }
    
    public loadRoomCategories(dataSource: IRoomCategoryDataSource): Promise<RoomCategoryDO[]> {
        return new Promise<RoomCategoryDO[]>((resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadRoomCategoriesCore(resolve, reject, dataSource);
        });
    }
    private loadRoomCategoriesCore(resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }, dataSource: IRoomCategoryDataSource) {

        var roomCategoriesToBeAded = dataSource.getRoomCategoryList();
        var roomCategoryRepository = this._testContext.appContext.getRepositoryFactory().getRoomCategoryRepository();
        var addRoomCategoriesPromiseList: Promise<RoomCategoryDO>[] = [];
        roomCategoriesToBeAded.forEach((roomCategoryToBeAdded: RoomCategoryDO) => {
            addRoomCategoriesPromiseList.push(roomCategoryRepository.addRoomCategory({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, roomCategoryToBeAdded));
        });

        Promise.all(addRoomCategoriesPromiseList).then((roomCategoriesList: RoomCategoryDO[]) => {
            resolve(roomCategoriesList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}