import {ThLogger, ThLogLevel} from '../core/utils/logging/ThLogger';
import {ThError} from '../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../core/utils/th-responses/ThResponse';
import {IImageStorageService} from '../core/services/image-storage/IImageStorageService';
import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';
import {IVatProvider, VatDetailsDO} from '../core/services/vat/IVatProvider';

class ServiceController extends BaseController {
    public uploadFile(req: Express.Request, res: Express.Response) {
        var _ctrlContext = this;
        try {
            req.file('file').upload(function(err, uploadedFiles) {
                if (err) {
                    _ctrlContext.returnErrorResponse(req, res, err, ThStatusCode.ImageUploadControllerErrorUploadingImage);
                    return;
                }
                if (uploadedFiles && !_.isEmpty(uploadedFiles)) {
                    var appContext: AppContext = req.appContext;
                    var imageStorageService: IImageStorageService = appContext.getServiceFactory().getImageStorageService();
                    var imageFile = uploadedFiles[0];

					imageStorageService.uploadImage({ imageName: imageFile.fd })
						.then((result: any) => {
							_ctrlContext.returnSuccesfulResponse(req, res, result);
						}).catch((error: any) => {
							_ctrlContext.returnErrorResponse(req, res, error, ThStatusCode.ImageUploadControllerErrorUploadingImage);
						});
                }
                else {
                    var thError = new ThError(ThStatusCode.ImageUploadControllerNoFilesToUpload, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "No files to upload", { url: req.url, body: req.body, query: req.query }, thError);
                    _ctrlContext.returnErrorResponse(req, res, thError, ThStatusCode.ImageUploadControllerNoFilesToUpload);
                }
            });
        } catch (e) {
            var thError = new ThError(ThStatusCode.ImageUploadControllerGenericError, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Generic File Upload Error", { url: req.url, body: req.body, query: req.query }, thError);
            _ctrlContext.returnErrorResponse(req, res, thError, ThStatusCode.ImageUploadControllerNoFilesToUpload);
        }
    }

    public checkVAT(req: Express.Request, res: Express.Response) {
        if (!this.precheckGETParameters(req, res, ['countryCode', 'vatNumber'])) { return };

        var appContext: AppContext = req.appContext;
        var vatNumberVerifier: IVatProvider = appContext.getServiceFactory().getVatProviderProxyService();

        var countryCode: string = req.query.countryCode;
        var vatNumber: string = req.query.vatNumber;

        vatNumberVerifier.checkVAT(countryCode, vatNumber).then((vatDetails: VatDetailsDO) => {
            this.returnSuccesfulResponse(req, res, vatDetails);
        }).catch((error: ThError) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.VatProviderErrorCheckingVat);
        });
    }
}

var serviceController = new ServiceController();
module.exports = {
    uploadFile: serviceController.uploadFile.bind(serviceController),
    checkVAT: serviceController.checkVAT.bind(serviceController)
}