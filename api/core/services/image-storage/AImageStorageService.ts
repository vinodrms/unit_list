import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';

export class ImageUploadRequestDO {
    public imageName: string;
}

export class ImageUploadResponseDO {
    public imageUrl: string;
}

export abstract class AImageStorageService {
    
    constructor(protected _unitPalConfig: UnitPalConfig) {
    }
    
	protected abstract uploadImage(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO> ;
    
    public uploadImageAsync(imageUploadRequestDO: ImageUploadRequestDO, 
                finishImageUploadCallback: { (err: any, emailContent?: string): void; }) {
		this.uploadImage(imageUploadRequestDO).then((result: any) => {
			finishImageUploadCallback(null, result);
		}).catch((response: any) => {
			finishImageUploadCallback(response);
		});
	}
}