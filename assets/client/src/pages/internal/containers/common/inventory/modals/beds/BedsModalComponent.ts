import {Component, OnInit, AfterViewChecked, ViewChild, ElementRef} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {BedVM} from '../../../../../services/beds/view-models/BedVM';
import {BedsModalInput} from './services/utils/BedsModalInput';

@Component({
    selector: 'beds-modal',
    templateUrl: "/client/src/pages/internal/containers/common/inventory/modals/beds/template/beds-modal.html",
    directives: [LoadingComponent],
    pipes: [TranslationPipe]
})
export class BedsModalComponent extends BaseComponent implements ICustomModalComponent, OnInit, AfterViewChecked {
    isLoading: boolean = true;
    
    private _scrollToBottom: boolean = false;
    @ViewChild('scrollableContent') private tableScrollContainer: ElementRef;
    
    selectedBedVM: BedVM;
    
    constructor(private _appContext: AppContext,
		private _modalDialogInstance: ModalDialogInstance<BedVM>,
		private _bedsModalInput: BedsModalInput) {
		super();
	}
    public ngOnInit() {
		this.isLoading = false;
	}
    
	public ngAfterViewChecked() {
		if (this._scrollToBottom) {
			this.scrollToBottom();
			this._scrollToBottom = false;
		}
	}
	private scrollToBottom(): void {
        try {
            this.tableScrollContainer.nativeElement.scrollTop = this.tableScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

	public closeDialog() {
		this._modalDialogInstance.closeForced();
	}
    
    public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Medium;
	}
    
    public get bedVMList(): BedVM[] {
        return this._bedsModalInput.bedVMList;    
    }
    
    public didSelectBed(): boolean {
		return this.selectedBedVM != null;
	}
    
    public triggerSelectedBed() {
		if (!this.didSelectBed()) {
			return;
		}
		this._modalDialogInstance.addResult(this.selectedBedVM);
		this.closeDialog();
	}
    
    public bedSelected(bedVM: BedVM): boolean {
        if(!this.didSelectBed()) {
            return false;    
        }
        return bedVM.bed.id == this.selectedBedVM.bed.id;
    }
}