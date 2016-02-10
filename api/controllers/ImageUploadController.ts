import {IImageStorageService} from '../core/services/image-storage/IImageStorageService';
import {BaseController} from './base/BaseController';
import {ErrorCode} from '../core/utils/responses/ResponseWrapper';
import {AppContext} from '../core/utils/AppContext';

import _ = require('underscore');

class ImageUploadController extends BaseController {
    public upload(req: any, res: any) {
        
        req['file']('image').upload(function(err, uploadedFiles) {
            if (uploadedFiles && !_.isEmpty(uploadedFiles)) {
                var appContext: AppContext = req.appContext;
                var imageStorageService: IImageStorageService =
                    appContext.getServiceFactory().getImageStorageService();
                var imageFile = uploadedFiles[0];
                
                imageStorageService.uploadImageAsync({
                    imageName: imageFile.fd
                }, ((error: any, result: any) => {
                    if (error) {
                        res.json(error);
                    }
                    else {
                        res.json(result);
                        // this.returnSuccesfulResponse(req, res, result);
                    }
                }))
            }
            else {
                res.json('No files to upload');
            }
        });
    }
}

var imageUploadController = new ImageUploadController();
module.exports = {
    upload: imageUploadController.upload.bind(imageUploadController)
}