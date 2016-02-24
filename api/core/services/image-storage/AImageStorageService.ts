import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {ImageUploadRequestDO, ImageUploadResponseDO, IImageStorageService} from './IImageStorageService';

export abstract class AImageStorageService implements IImageStorageService {

    constructor(protected _unitPalConfig: UnitPalConfig) {
    }

    public abstract uploadImage(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO>;
}