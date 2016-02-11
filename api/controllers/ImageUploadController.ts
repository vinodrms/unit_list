import {ThLogger, ThLogLevel} from '../core/utils/logging/ThLogger';
import {ThError} from '../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../core/utils/th-responses/ThResponse';
import {IImageStorageService} from '../core/services/image-storage/IImageStorageService';
import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';

class ImageUploadController extends BaseController {
    public upload(req: Express.Request, res: Express.Response) {
        var _ctrlContext = this;
        try {
            req.file('image').upload(function(err, uploadedFiles) {
                if (err) {
                    _ctrlContext.returnErrorResponse(req, res, err, ThStatusCode.ImageUploadControllerErrorUploadingImage);
                    return;
                }
                if (uploadedFiles && !_.isEmpty(uploadedFiles)) {
                    var appContext: AppContext = req.appContext;
                    var imageStorageService: IImageStorageService = appContext.getServiceFactory().getImageStorageService();
                    var imageFile = uploadedFiles[0];

                    imageStorageService.uploadImageAsync({
                        imageName: imageFile.fd
                    }, ((error: any, result: any) => {
                        if (error) {
                            _ctrlContext.returnErrorResponse(req, res, error, ThStatusCode.ImageUploadControllerErrorUploadingImage);
                        }
                        else {
                            _ctrlContext.returnSuccesfulResponse(req, res, result);
                        }
                    }))
                    return;
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
}

var imageUploadController = new ImageUploadController();
module.exports = {
    upload: imageUploadController.upload.bind(imageUploadController)
}