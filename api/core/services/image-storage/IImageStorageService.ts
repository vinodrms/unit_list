export class ImageUploadRequestDO {
    public imageName: string;
}

export class ImageUploadResponseDO {
    public url: string;
    public secureUrl: string;
}

export interface IImageStorageService {
	uploadImage(imageUploadRequestDO: ImageUploadRequestDO): Promise<ImageUploadResponseDO>;
}