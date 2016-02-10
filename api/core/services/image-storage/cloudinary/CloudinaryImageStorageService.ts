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
            reject: { (err: any): void }) => {
            this.uploadCore(imageUploadRequestDO, resolve, reject);
        });
    }

    public uploadCore(imageUploadRequestDO: ImageUploadRequestDO,
        resolve: { (imageUploadResponse?: ImageUploadResponseDO): void },
        reject: { (err: any): void }) {
        cloudinary.uploader.upload(imageUploadRequestDO.imageName, (result) => {
            if (result.error) {
                reject(result.error.message);
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