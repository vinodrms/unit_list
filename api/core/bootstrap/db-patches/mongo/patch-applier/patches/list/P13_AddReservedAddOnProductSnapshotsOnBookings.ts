import _ = require('underscore');
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { MongoAddOnProductRepository } from "../../../../../../data-layer/add-on-products/repositories/mongo/MongoAddOnProductRepository";
import { AddOnProductSearchResultRepoDO } from "../../../../../../data-layer/add-on-products/repositories/IAddOnProductRepository";
import { AddOnProductDO } from "../../../../../../data-layer/add-on-products/data-objects/AddOnProductDO";
import { ThError } from "../../../../../../utils/th-responses/ThError";

export class P13_AddReservedAddOnProductSnapshotsOnBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this.bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddReservedAddOnProductSnapshotsOnBookings;
    }

    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, booking) {
        var reservedAddOnProductIdList = [];
        if (_.isArray(booking.reservedAddOnProductList)) {
            booking.reservedAddOnProductList.forEach(reservedAddOnProduct => {
                if (_.isString(reservedAddOnProduct.aopId) && reservedAddOnProduct.aopId.length > 0) {
                    reservedAddOnProductIdList.push(reservedAddOnProduct.aopId);
                }
            });
        }
        reservedAddOnProductIdList = _.uniq(reservedAddOnProductIdList);
        var aopList: AddOnProductDO[] = [];
        if (_.isArray(reservedAddOnProductIdList) && reservedAddOnProductIdList.length > 0) {
            this.addOnProductRepository.getAddOnProductList({ hotelId: booking.hotelId }, { addOnProductIdList: reservedAddOnProductIdList })
                .then((searchResult: AddOnProductSearchResultRepoDO) => {
                    aopList = searchResult.addOnProductList;
                    _.forEach(booking.reservedAddOnProductList, (reservedAddOnProduct) => {
                        var aopWithSameId: AddOnProductDO = _.find(aopList, (aop: AddOnProductDO) => { return aop.id === reservedAddOnProduct.aopId });
                        reservedAddOnProduct.aopSnapshot = aopWithSameId.getAddOnProductSnapshotDO();
                        delete reservedAddOnProduct.aopId;
                    });
                    resolve(booking);
                }).catch((error: ThError) => {
                    reject(error);
                });
        } else {
            resolve(booking);
        };
    }

    protected updateDocumentInMemory(booking) { }
}
