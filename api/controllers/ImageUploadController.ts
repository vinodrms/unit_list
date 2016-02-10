import {AImageStorageService} from '../core/services/image-storage/AImageStorageService';
import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';

class ImageUploadController extends BaseController {
    public upload(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        
        //TODO
        req.file('image').upload(function(err, uploadedFiles) {
            if (uploadedFiles && uploadedFiles.length > 0) {
                // var imageStorageService: AImageStorageService =
                //     appContext.getServiceFactory().getImageStorageService();
                // var imageFile = uploadedFiles[0];
                // console.log('aici!!!!!: ' + imageFile.fd);
                // imageStorageService.uploadImage({
                //     imageName: imageFile.fd
                // }).then(function(result) {
                //     res.json({ result: result });
                // });
            }
            // res.json({uploadedFiles: uploadedFiles});
        });
    }
}

var imageUploadController = new ImageUploadController();
module.exports = {
    upload: imageUploadController.upload.bind(imageUploadController)
}