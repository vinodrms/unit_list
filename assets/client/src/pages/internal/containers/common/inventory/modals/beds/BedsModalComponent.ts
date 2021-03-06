import {Component, OnInit, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BedVM} from '../../../../../services/beds/view-models/BedVM';
import {BedsModalInput} from './services/utils/BedsModalInput';
import {BedSelectionVM} from './services/utils/BedSelectionVM';

@Component({
    selector: 'beds-modal',
    templateUrl: "/client/src/pages/internal/containers/common/inventory/modals/beds/template/beds-modal.html"
})
export class BedsModalComponent extends BaseComponent implements ICustomModalComponent, OnInit, AfterViewChecked {

	isLoading: boolean = true;

	bedSelectionVMList: BedSelectionVM[];

    private _scrollToBottom: boolean = false;
    @ViewChild('scrollableContent') private tableScrollContainer: ElementRef;

    constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<BedVM[]>,
		private _bedsModalInput: BedsModalInput) {
		super();
	}

    public ngOnInit() {
		this.isLoading = false;
		this.initBedSelectionVMList();
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
		this._modalDialogRef.closeForced();
	}

    public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Medium;
	}

	public get maxBedNo(): number {
		return this._bedsModalInput.maxNoOfBeds;
	}

	public get minBedNo(): number {
		return this._bedsModalInput.minNoOfBeds;
	}

	private initBedSelectionVMList() {
		this.bedSelectionVMList = [];
        this._bedsModalInput.availableBedVMList.forEach((bedVM: BedVM) => {
            var bedSelectionVM = new BedSelectionVM();
            bedSelectionVM.bedVM = bedVM;
            bedSelectionVM.numberOfInstances = this.countNoOfBedInstancesInRoom(bedVM.bed.id);
            this.bedSelectionVMList.push(bedSelectionVM);
        });
	}

	private countNoOfBedInstancesInRoom(bedId: string): number {
        var counter = 0;
        this._bedsModalInput.selectedBedVMList.forEach((bedVM: BedVM) => {
            if (bedVM.bed.id === bedId) counter++;
        });
        return counter;
    }

    public get didSelectAtLeastOneBed(): boolean {
		var atLeastOneBedSelected = false;
		this.bedSelectionVMList.forEach((bedSelectionVM: BedSelectionVM) => {
			if (bedSelectionVM.numberOfInstances > 0) {
				atLeastOneBedSelected = true;
			}
		});
		return atLeastOneBedSelected;
	}

	public get didPassedTheMaxNoOfBeds(): boolean {
		var totalNoOfSelectedBeds = 0;
		this.bedSelectionVMList.forEach((bedSelectionVM: BedSelectionVM) => {
			totalNoOfSelectedBeds += bedSelectionVM.numberOfInstances;
		});
		return totalNoOfSelectedBeds > this.maxBedNo;
	}

	private getSavedBedVMList(): BedVM[] {
		var result: BedVM[] = [];
		this.bedSelectionVMList.forEach((bedSelectionVM: BedSelectionVM) => {
			for (var i = 0; i < bedSelectionVM.numberOfInstances; ++i) {
				result.push(bedSelectionVM.bedVM);
			}
		});
		return result;
	}

    public triggerSelectedBed() {
		if (!this.didSelectAtLeastOneBed) {
			return;
		}
		this._modalDialogRef.addResult(this.getSavedBedVMList());
		this.closeDialog();
	}
}