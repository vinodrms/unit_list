import {IImageStorageService, ImageUploadRequestDO, ImageUploadResponseDO} from '../IImageStorageService';
import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';

var cloudinary = require('cloudinary');

export class CloudinaryImageStorageService implements IImageStorageService {
    constructor(private _unitPalConfig: UnitPalConfig) {
        cloudinary.config(_unitPalConfig.getImageStorageProviderSettings);
    }

    public upload(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO> {
        return new Promise<ImageUploadResponseDO>((resolve: { (imageUploadResponse?: ImageUploadResponseDO): void }, 
                                                    reject: { (err: any): void }) => {
            this.uploadCore(imageUploadRequestDO, resolve, reject);
        });
    }

    public uploadCore(imageUploadRequestDO: ImageUploadRequestDO, 
                        resolve: { (imageUploadResponse?: ImageUploadResponseDO): void }, 
                        reject: { (err: any): void }) {
        cloudinary.uploader.upload(imageUploadRequestDO, (result) => {
            console.log(result);
            resolve({
                imageUrl: ''
            });
        });
    }
}