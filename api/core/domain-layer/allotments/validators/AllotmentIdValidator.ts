import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {AllotmentDO, AllotmentStatus} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentSearchResultRepoDO} from '../../../data-layer/allotments/repositories/IAllotmentRepository';

export class AllotmentIdValidator {
    private _thUtils: ThUtils;
    private _allotmentIdList: string[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public validateAllotmentIdList(allotmentIdList: string[]): Promise<AllotmentDO[]> {
        this._allotmentIdList = allotmentIdList;
        return new Promise<AllotmentDO[]>((resolve: { (result: AllotmentDO[]): void }, reject: { (err: ThError): void }) => {
            this.validateAllotmentIdListCore(resolve, reject);
        });
    }
    private validateAllotmentIdListCore(resolve: { (result: AllotmentDO[]): void }, reject: { (err: ThError): void }) {
        if (this._allotmentIdList.length == 0) {
            resolve([]);
            return;
        }

        var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
        allotmentRepo.getAllotmentList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { allotmentIdList: this._allotmentIdList, status: AllotmentStatus.Active })
            .then((searchResult: AllotmentSearchResultRepoDO) => {
                var validAllotmentIdList: string[] = this.getIdList(searchResult.allotmentList);
                if (!this._thUtils.firstArrayIncludedInSecond(this._allotmentIdList, validAllotmentIdList)) {
                    var thError = new ThError(ThStatusCode.AllotmentIdValidatorInvalidId, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid allotment id list", this._allotmentIdList, thError);
                    throw thError;
                }
                resolve(searchResult.allotmentList);
            }).catch((error: any) => {
                reject(error);
            });
    }
    private getIdList(allotmentList: AllotmentDO[]): string[] {
        return _.map(allotmentList, (allotmentDO: AllotmentDO) => {
            return allotmentDO.id;
        });
    }
}