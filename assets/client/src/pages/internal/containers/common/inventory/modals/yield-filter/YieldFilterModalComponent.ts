import {Component, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {YieldFilterModalInput} from './services/utils/YieldFilterModalInput';
import {YieldFilterDO, YieldFilterType} from '../../../../../services/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../../../services/common/data-objects/yield-filter/YieldFilterValueDO';
import {ColorFilter} from '../../../../../services/common/data-objects/yield-filter/ColorFilter';
import {YieldFilterValueVM} from './services/view-models/YieldFilterValueVM';

@Component({
	selector: 'yield-filter-modal',
	templateUrl: "/client/src/pages/internal/containers/common/inventory/modals/yield-filter/template/yield-filter-modal.html",
	pipes: [TranslationPipe]
})
export class YieldFilterModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewChecked {
	private _scrollToBottom: boolean = false;
	@ViewChild('scrollableContent') private tableScrollContainer: ElementRef;

	yieldFilter: YieldFilterDO;
	selectedYieldFilterValue: YieldFilterValueDO;

	yieldFilterValueVMList: YieldFilterValueVM[];
	colorFilter: ColorFilter;

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<YieldFilterValueDO>,
		private _yieldFilterModalInput: YieldFilterModalInput) {
		super();

		this.colorFilter = new ColorFilter();
		this.yieldFilter = this._yieldFilterModalInput.yieldFilter;
		this.yieldFilterValueVMList = [];
		_.forEach(this._yieldFilterModalInput.yieldFilter.values, (filterValue: YieldFilterValueDO) => {
			this.yieldFilterValueVMList.push(new YieldFilterValueVM(filterValue, this.yieldFilter.id, this.colorFilter.getColorMetaByColorCode(filterValue.colorCode)));
		});
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

	public isTextFilter() {
		return this.yieldFilter.type === YieldFilterType.Text;
	}
	public isColorFilter() {
		return this.yieldFilter.type === YieldFilterType.Color;
	}

	public didSelectFilterValue(): boolean {
		return this.selectedYieldFilterValue != null;
	}
	public isFilterSelected(yieldFilterValueVM: YieldFilterValueVM) {
		return this.didSelectFilterValue() && yieldFilterValueVM.filterValue.id === this.selectedYieldFilterValue.id;
	}
	public selectedFilter(yieldFilterValueVM: YieldFilterValueVM) {
		return this.selectedYieldFilterValue = yieldFilterValueVM.filterValue;
	}
	public didChangeColorCodeFor(yieldFilterValueVM: YieldFilterValueVM, colorCodeStr: string) {
		yieldFilterValueVM.filterValue.colorCode = colorCodeStr;
		yieldFilterValueVM.colorMeta = this.colorFilter.getColorMetaByColorCode(colorCodeStr);
	}

	public saveYieldFilter(yieldFilterValueVM: YieldFilterValueVM) {
		if (!yieldFilterValueVM.filterValue.colorCode && !yieldFilterValueVM.filterValue.label) {
			return;
		}
		yieldFilterValueVM.isSaving = true;
		this._yieldFilterModalInput.yieldFilterService.saveYieldValue(yieldFilterValueVM.filterId, yieldFilterValueVM.filterValue)
			.subscribe((savedYieldFilterValue: YieldFilterValueDO) => {
				yieldFilterValueVM.filterValue = savedYieldFilterValue;
				yieldFilterValueVM.isEditing = false;
				yieldFilterValueVM.isSaving = false;
			}, (error: ThError) => {
				yieldFilterValueVM.isSaving = false;
				this._appContext.toaster.error(error.message);
			});
	}
	public editYieldFilter(yieldFilterValueVM: YieldFilterValueVM) {
		yieldFilterValueVM.isEditing = true;
	}
	public addYieldFilterValue() {
		var yieldFilterValueDO = new YieldFilterValueDO();
		var yieldFilterVM = new YieldFilterValueVM(yieldFilterValueDO, this.yieldFilter.id, this.colorFilter.getColorMetaByColorCode(""));
		yieldFilterVM.isEditing = true;
		this.yieldFilterValueVMList.push(yieldFilterVM);
		this._scrollToBottom = true;
	}
	public triggerSelectFilterValue() {
		if (!this.didSelectFilterValue()) {
			return;
		}
		this._modalDialogRef.addResult(this.selectedYieldFilterValue);
		this.closeDialog();
	}
}