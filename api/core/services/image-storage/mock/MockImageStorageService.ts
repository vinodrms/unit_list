import {AImageStorageService} from '../AImageStorageService';
import {ImageUploadRequestDO, ImageUploadResponseDO} from '../IImageStorageService';
import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';

export class MockImageStorageService extends AImageStorageService {

    constructor(protected _unitPalConfig: UnitPalConfig) {
        super(_unitPalConfig);
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
        resolve({
            url: 'http://res.cloudinary.com/hbpr8ossz/image/upload/v1455016970/sample.jpg',
            secureUrl: 'https://res.cloudinary.com/hbpr8ossz/image/upload/v1455016970/sample.jpg'
        });
    }
}