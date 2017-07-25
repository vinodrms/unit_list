import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {AllotmentMetaRepoDO, AllotmentSearchResultRepoDO} from '../core/data-layer/allotments/repositories/IAllotmentRepository';
import {AllotmentDO} from '../core/data-layer/allotments/data-objects/AllotmentDO';
import {SaveAllotmentItem} from '../core/domain-layer/allotments/SaveAllotmentItem';
import {ArchiveAllotmentItem} from '../core/domain-layer/allotments/ArchiveAllotmentItem';

export class AllotmentsController extends BaseController {
	public getAllotmentById(req: any, res: any) {
		if (!this.precheckGETParameters(req, res, ['id'])) { return };

		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var allotmentId = req.query.id;
		var allMeta = this.getAllotmentMetaRepoDOFrom(sessionContext);

		var allotmentRepo = appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepo.getAllotmentById(allMeta, allotmentId).then((allotment: AllotmentDO) => {
			this.returnSuccesfulResponse(req, res, { allotment: allotment });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AllotmentsControllerErrorGettingAllotment);
		});
	}
	public saveAllotmentItem(req: any, res: any) {
		var saveAllItem = new SaveAllotmentItem(req.appContext, req.sessionContext);
		saveAllItem.save(req.body.allotment).then((updatedAllotment: AllotmentDO) => {
			this.returnSuccesfulResponse(req, res, { allotment: updatedAllotment });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AllotmentsControllerErrorSavingAllotment);
		});
	}
	public archiveAllotmentItem(req: any, res: any) {
		var archiveAllItem = new ArchiveAllotmentItem(req.appContext, req.sessionContext);
		archiveAllItem.archive(req.body.allotment).then((archivedAllotment: AllotmentDO) => {
			this.returnSuccesfulResponse(req, res, { allotment: archivedAllotment });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AllotmentsControllerErrorArchivingAllotment);
		});
	}
	public getAllotmentListCount(req: any, res: any) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var allMeta = this.getAllotmentMetaRepoDOFrom(sessionContext);
		var allotmentRepo = appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepo.getAllotmentListCount(allMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AllotmentsControllerErrorGettingCount);
		});
	}
	public getAllotmentList(req: any, res: any) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var allMeta = this.getAllotmentMetaRepoDOFrom(sessionContext);
		var allotmentRepo = appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepo.getAllotmentList(allMeta, req.body.searchCriteria, req.body.lazyLoad).then((allSearchResult: AllotmentSearchResultRepoDO) => {
			this.returnSuccesfulResponse(req, res, allSearchResult);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AllotmentsControllerErrorGettingList);
		});
	}

	private getAllotmentMetaRepoDOFrom(sessionContext: SessionContext): AllotmentMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var allController = new AllotmentsController();
module.exports = {
	getAllotmentById: allController.getAllotmentById.bind(allController),
	saveAllotmentItem: allController.saveAllotmentItem.bind(allController),
	archiveAllotmentItem: allController.archiveAllotmentItem.bind(allController),
	getAllotmentListCount: allController.getAllotmentListCount.bind(allController),
	getAllotmentList: allController.getAllotmentList.bind(allController)
}