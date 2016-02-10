import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';

import {ImageUploadRequestDO, ImageUploadResponseDO, IImageStorageService} from './IImageStorageService';

export abstract class AImageStorageService implements IImageStorageService{
    
    constructor(protected _unitPalConfig: UnitPalConfig) {
    }
    
	protected abstract uploadImage(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO> ;
    
    public uploadImageAsync(imageUploadRequestDO: ImageUploadRequestDO, 
                finishImageUploadCallback: { (err: any, imageUploadResponse?: ImageUploadResponseDO): void; }) {
		this.uploadImage(imageUploadRequestDO).then((result: any) => {
			finishImageUploadCallback(null, result);
		}).catch((response: any) => {
			finishImageUploadCallback(response);
		});
	}
}