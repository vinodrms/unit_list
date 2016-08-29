import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {AllotmentDO, AllotmentStatus} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentSearchCriteriaRepoDO, AllotmentSearchResultRepoDO} from '../../../data-layer/allotments/repositories/IAllotmentRepository';
import {AllotmentsContainer} from './results/AllotmentsContainer';

export class AllotmentIdValidator {
    private _thUtils: ThUtils;
    private _allotmentIdList: string[];
    private _onlyActive: boolean;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public validateAllotmentIdList(inputParams: { allotmentIdList: string[], onlyActive: boolean }): Promise<AllotmentsContainer> {
        this._allotmentIdList = inputParams.allotmentIdList;
        this._onlyActive = inputParams.onlyActive;
        return new Promise<AllotmentsContainer>((resolve: { (result: AllotmentsContainer): void }, reject: { (err: ThError): void }) => {
            this.validateAllotmentIdListCore(resolve, reject);
        });
    }
    private validateAllotmentIdListCore(resolve: { (result: AllotmentsContainer): void }, reject: { (err: ThError): void }) {
        if (this._allotmentIdList.length == 0) {
            resolve(new AllotmentsContainer([]));
            return;
        }
        var searchCriteria: AllotmentSearchCriteriaRepoDO = this.getSearchCriteria();
        var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
        allotmentRepo.getAllotmentList({ hotelId: this._sessionContext.sessionDO.hotel.id }, searchCriteria)
            .then((searchResult: AllotmentSearchResultRepoDO) => {
                var validAllotmentIdList: string[] = this.getIdList(searchResult.allotmentList);
                if (!this._thUtils.firstArrayIncludedInSecond(this._allotmentIdList, validAllotmentIdList)) {
                    var thError = new ThError(ThStatusCode.AllotmentIdValidatorInvalidId, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid allotment id list", this._allotmentIdList, thError);
                    throw thError;
                }
                resolve(new AllotmentsContainer(searchResult.allotmentList));
            }).catch((error: any) => {
                reject(error);
            });
    }
    private getSearchCriteria(): AllotmentSearchCriteriaRepoDO {
        var searchCriteria: AllotmentSearchCriteriaRepoDO = {
            allotmentIdList: this._allotmentIdList
        }
        if (this._onlyActive) {
            searchCriteria.status = AllotmentStatus.Active;
        }
        return searchCriteria;
    }
    private getIdList(allotmentList: AllotmentDO[]): string[] {
        return _.map(allotmentList, (allotmentDO: AllotmentDO) => {
            return allotmentDO.id;
        });
    }
}