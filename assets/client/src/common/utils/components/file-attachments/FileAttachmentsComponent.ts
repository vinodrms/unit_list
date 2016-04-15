import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BaseComponent} from '../../../base/BaseComponent';
import {AppContext, ThError} from '../../AppContext';
import {FileAttachmentDO} from '../../../../pages/internal/services/common/data-objects/file/FileAttachmentDO';
import {TranslationPipe} from '../../localization/TranslationPipe';
import {UploadedFileResponse} from '../../http/IThHttp';

@Component({
	selector: 'file-attachments',
	templateUrl: '/client/src/common/utils/components/file-attachments/template/file-attachments.html',
	pipes: [TranslationPipe]
})
export class FileAttachmentsComponent extends BaseComponent {
	private _fileAttachmentList: FileAttachmentDO[] = [];
	public get fileAttachmentList(): FileAttachmentDO[] {
		return this._fileAttachmentList;
	}
	@Input()
	public set fileAttachmentList(fileAttachmentList: FileAttachmentDO[]) {
		this._fileAttachmentList = fileAttachmentList;
	}

	@Output() onFileAttachmentsChange: EventEmitter<FileAttachmentDO[]> = new EventEmitter();
	isLoading: boolean;

	constructor(private _appContext: AppContext) {
		super();
		this.isLoading = false;
	}

	public removeFileAttachment(fileAttachment: FileAttachmentDO) {
		var title = this._appContext.thTranslation.translate("Remove file");
		var content = this._appContext.thTranslation.translate("Are you sure you want to remove %fileName% ?", { fileName: fileAttachment.name });
		this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
			() => {
				this._fileAttachmentList = _.filter(this._fileAttachmentList, (existingAttachment: FileAttachmentDO) => { return existingAttachment.url !== fileAttachment.url });
				this.triggerFileAttachmentsChange();
			}, () => { });
	}

	public didSelectFile(event: any) {
		var files: File[] = (event.srcElement || event.target).files;
		if (files.length == 0) {
			return;
		}
		var fileToUpload: File = files[0];

		this.isLoading = true;
		this._appContext.thHttp.uploadFile(fileToUpload).subscribe((uploadResponse: UploadedFileResponse) => {
			this.isLoading = false;

			var newFileAttachment: FileAttachmentDO = new FileAttachmentDO();
			newFileAttachment.name = fileToUpload.name;
			newFileAttachment.url = uploadResponse.secureUrl;
			this.fileAttachmentList.push(newFileAttachment);

			this.triggerFileAttachmentsChange();
		}, (err: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(err.message);
		});
	}
	private triggerFileAttachmentsChange() {
		this.onFileAttachmentsChange.next(this._fileAttachmentList);
	}
}