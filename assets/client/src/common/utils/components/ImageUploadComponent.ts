import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {AppContext, ThError} from '../AppContext';
import {UploadedFileResponse} from '../http/IThHttp';
import {TranslationPipe} from '../localization/TranslationPipe';
import {LoadingComponent} from './LoadingComponent';

@Component({
	selector: 'image-upload',
	template: `
		<span class="btn btn-default btn-file file-upload">
			<div class="fileinput fileinput-new" data-provides="fileinput">
				<div class="fileinput-preview thumbnail" data-trigger="fileinput" style="width: 100%;">
					<loading-component [isLoading]="isLoading"></loading-component>
					<img *ngIf="imageUrl && !isLoading" [src]="imageUrl" />
					<i class="fa fa-picture-o fa-5x" *ngIf="!imageUrl && !isLoading"></i>
				</div>
				<span class="btn btn-default btn-file file-upload">
					<input type="file" name="..." accept="image/*" (change)="didSelectFile($event)" />
				</span>
				<br/>
				<a class="btn btn-default fileinput-exists" data-dismiss="fileinput" (click)="removeImageUrl()">{{ 'Remove' | translate }}</a>
			</div>
		</span>
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