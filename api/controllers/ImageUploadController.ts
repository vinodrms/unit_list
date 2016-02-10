import {IImageStorageService} from '../core/services/image-storage/IImageStorageService';
import {BaseController} from './base/BaseController';
import {ErrorCode} from '../core/utils/responses/ResponseWrapper';
import {AppContext} from '../core/utils/AppContext';

class ImageUploadController extends BaseController {
    public upload(req: any, res: any) {
        var appContext: AppContext = req.appContext;

        req.file('image').upload(function(err, uploadedFiles) {
            if (uploadedFiles && uploadedFiles.length > 0) {
                var imageStorageService: IImageStorageService =
                    appContext.getServiceFactory().getImageStorageService();
                var imageFile = uploadedFiles[0];
                console.log('aici!!!!!: ' + imageFile.fd);
                imageStorageService.upload({
                    imageName: imageFile.fd
                }).then(function(result) {
                    res.json({ result: result });
                });
            }
            // res.json({uploadedFiles: uploadedFiles});
        });
    }
}

var imageUploadController = new ImageUploadController();
module.exports = {
    upload: imageUploadController.upload.bind(imageUploadController)
}