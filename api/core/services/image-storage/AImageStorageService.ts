import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {ImageUploadRequestDO, ImageUploadResponseDO, IImageStorageService} from './IImageStorageService';

export abstract class AImageStorageService implements IImageStorageService {

    constructor(protected _unitPalConfig: UnitPalConfig) {
    }

    protected abstract uploadImage(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO>;

    public uploadImageAsync(imageUploadRequestDO: ImageUploadRequestDO,
        finishImageUploadCallback: { (err: ThError, imageUploadResponse?: ImageUploadResponseDO): void; }) {
        this.uploadImage(imageUploadRequestDO).then((result: any) => {
            finishImageUploadCallback(null, result);
        }).catch((err: any) => {
            var thError = new ThError(ThStatusCode.ImageStorageServiceErrorUploadingImage, err);
            finishImageUploadCallback(thError);
        });
    }
}