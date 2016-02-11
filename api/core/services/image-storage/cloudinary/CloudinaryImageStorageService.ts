import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AImageStorageService} from '../AImageStorageService';
import {ImageUploadRequestDO, ImageUploadResponseDO} from '../IImageStorageService';
import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';

var cloudinary = require('cloudinary');

export class CloudinaryImageStorageService extends AImageStorageService {

    constructor(protected _unitPalConfig: UnitPalConfig) {
        super(_unitPalConfig);
        cloudinary.config(
            _unitPalConfig.getImageStorageProviderSettings()
        );
    }

    public uploadImage(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO> {
        return new Promise<ImageUploadResponseDO>((resolve: { (imageUploadResponse?: ImageUploadResponseDO): void },
            reject: { (err: ThError): void }) => {
            this.uploadCore(imageUploadRequestDO, resolve, reject);
        });
    }

    public uploadCore(imageUploadRequestDO: ImageUploadRequestDO,
        resolve: { (imageUploadResponse?: ImageUploadResponseDO): void },
        reject: { (err: ThError): void }) {
        cloudinary.uploader.upload(imageUploadRequestDO.imageName, (result) => {
            if (!result || result.error) {
                var thError = new ThError(ThStatusCode.CloudinaryImageStorageServiceErrorUploadingImage, result.error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error uploading image on cloudinary", imageUploadRequestDO, thError);
                reject(thError);
            }
            else {
                resolve({
                    url: result.url,
                    secureUrl: result.secure_url
                });
            }
        });
    }
}