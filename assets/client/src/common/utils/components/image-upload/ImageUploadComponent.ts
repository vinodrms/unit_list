import {Component, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../AppContext';
import {UploadedFileResponse} from '../../http/IThHttp';
import {TranslationPipe} from '../../localization/TranslationPipe';
import {LoadingComponent} from '../LoadingComponent';

@Component({
	selector: 'image-upload',
	templateUrl: '/client/src/common/utils/components/image-upload/template/image-upload.html',
	directives: [LoadingComponent],
	pipes: [TranslationPipe]
})

export class ImageUploadComponent {
	isLoading: boolean = false;

	@Input() imageUrl: string;
	@Output() onImageUpload = new EventEmitter();

	constructor(private _appContext: AppContext) {
		this.imageUrl = "";
	}

	public removeImageUrl() {
		this.setImageUrl("");
	}

	public didSelectFile(event: any) {
		var files: File[] = (event.srcElement || event.target).files;
		if (files.length == 0) {
			return;
		}
		this.isLoading = true;
		this._appContext.thHttp.uploadFile(files[0]).subscribe((uploadResponse: UploadedFileResponse) => {
			this.isLoading = false;
			this.setImageUrl(uploadResponse.secureUrl);
		}, (err: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(err.message);
		});
	}
	private setImageUrl(imageUrl: string) {
		this.imageUrl = imageUrl;
		this.onImageUpload.next(this.imageUrl);
	}
}