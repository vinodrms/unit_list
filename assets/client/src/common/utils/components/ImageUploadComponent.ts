import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {AppContext, ThError} from '../AppContext';
import {UploadedFileResponse} from '../http/IThHttp';
import {TranslationPipe} from '../localization/TranslationPipe';
import {LoadingComponent} from './LoadingComponent';

@Component({
	selector: 'image-upload',
	template: `
	<div class="btn btn-default btn-file">
		<div class="fileinput fileinput-new" data-provides="fileinput">
			<div class="fileinput-preview thumbnail" data-trigger="fileinput" style="width: height: 150px;">
				<loading-component [isLoading]="isLoading"></loading-component>
				<img [src]="imageUrl">
			</div>
			<div>
				<span class="btn btn-default btn-file">
					<span class="fileinput-new">{{ 'Select image' | translate }}</span>
					<span class="fileinput-exists">Change</span>
					<input type="file" name="..." accept="image/*" (change)="didSelectFile($event)" />
				</span>
				<a class="btn btn-default fileinput-exists" data-dismiss="fileinput" (click)="removeImageUrl()">{{ 'Remove' | translate }}</a>
			</div>
		</div>
	</div>
	`,
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
		var files: File[] = event.srcElement.files;
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