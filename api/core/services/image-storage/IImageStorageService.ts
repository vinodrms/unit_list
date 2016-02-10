export class ImageUploadRequestDO {
    public imageName: string;
}

export class ImageUploadResponseDO {
    public url: string;
    public secureUrl: string;
}

export interface IImageStorageService {
    uploadImageAsync(imageUploadRequestDO: ImageUploadRequestDO, 
                finishImageUploadCallback: { (err: any, imageUploadResponse?: ImageUploadResponseDO): void; });
}