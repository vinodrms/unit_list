import {Component, AfterViewInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../common/utils/directives/CustomScroll';
import {PrintableSection} from '../../../../../../../../../common/utils/directives/PrintableSection';
import {AllotmentVM} from '../../../../../../../services/allotments/view-models/AllotmentVM';
import {AllotmentDO, AllotmentStatus} from '../../../../../../../services/allotments/data-objects/AllotmentDO';
import {CustomerDO} from '../../../../../../../services/customers/data-objects/CustomerDO';
import {AllotmentEditSectionContainer} from './utils/AllotmentEditSectionContainer';
import {AllotmentEditTopSectionComponent} from '../sections/top-section/AllotmentEditTopSectionComponent';
import {AllotmentOpenIntervalSectionComponent} from '../sections/open-interval/AllotmentOpenIntervalSectionComponent';
import {AllotmentAvailabilitySectionComponent} from '../sections/availability/AllotmentAvailabilitySectionComponent';
import {AllotmentEditConstraintsSectionComponent} from '../sections/constraints/constraint-list/AllotmentEditConstraintsSectionComponent';
import {AllotmentNotesSectionComponent} from '../sections/notes/AllotmentNotesSectionComponent';
import {AllotmentsService} from '../../../../../../../services/allotments/AllotmentsService';

@Component({
	selector: 'allotment-edit-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/container/template/allotment-edit-container.html',
	directives: [CustomScroll, PrintableSection,
		AllotmentEditTopSectionComponent, AllotmentOpenIntervalSectionComponent,
		AllotmentAvailabilitySectionComponent, AllotmentEditConstraintsSectionComponent,
		AllotmentNotesSectionComponent],
	providers: [],
	pipes: [TranslationPipe]
})
export class AllotmentEditContainerComponent extends BaseComponent implements AfterViewInit {
	@ViewChild(AllotmentEditTopSectionComponent) private _topSectionComponent: AllotmentEditTopSectionComponent;
	@ViewChild(AllotmentOpenIntervalSectionComponent) private _openIntervalSectionComponent: AllotmentOpenIntervalSectionComponent;
	@ViewChild(AllotmentAvailabilitySectionComponent) private _availabilitySectionComponent: AllotmentAvailabilitySectionComponent;
	@ViewChild(AllotmentEditConstraintsSectionComponent) private _editConstraintsSectionComponent: AllotmentEditConstraintsSectionComponent;
	@ViewChild(AllotmentNotesSectionComponent) private _notesSectionComponent: AllotmentNotesSectionComponent;

	private _allotmentVM: AllotmentVM;
	public get allotmentVM(): AllotmentVM {
		return this._allotmentVM;
	}
	@Input()
	public set allotmentVM(allotmentVM: AllotmentVM) {
		this._allotmentVM = allotmentVM;
		this.initializeDependentData();
	}
	@Output() onExit = new EventEmitter();
	public showViewScreen() {
		this.onExit.next(true);
	}

	private _didInit = false;
	isLoading: boolean = true;
	isSavingAllotment: boolean = false;
	didSubmit = false;
	private _allotmentEditSectionContainer: AllotmentEditSectionContainer;

	constructor(private _appContext: AppContext,
		private _allotmentsService: AllotmentsService) {
		super();
	}
	ngAfterViewInit() {
		setTimeout(() => {
			this._didInit = true;
			this._allotmentEditSectionContainer = new AllotmentEditSectionContainer(
				[
					this._topSectionComponent,
					this._openIntervalSectionComponent,
					this._availabilitySectionComponent,
					this._editConstraintsSectionComponent,
					this._notesSectionComponent
				]
			);
			this.initializeDependentData();
		});
	}
	private initializeDependentData() {
		if (!this._didInit || !this._allotmentVM) {
			return;
		}
		this.isLoading = true;

		this._allotmentEditSectionContainer.initializeFrom(this._allotmentVM);
		this._allotmentEditSectionContainer.readonly = this.isReadOnly();
		this.isLoading = false;
		this.didSubmit = false;
		if (this._allotmentVM.allotment.status === AllotmentStatus.Active) {
			this._notesSectionComponent.readonly = false;
		}
	}
	private isReadOnly(): boolean {
		return this._allotmentVM != null && !this._allotmentVM.isNewAllotment();
	}


	public canSaveAllotment(): boolean {
		return this._allotmentVM != null && this._allotmentVM.allotment.isActive();
	}
	public saveAllotment() {
		this.didSubmit = true;
		if (!this._allotmentEditSectionContainer.isValid() || !this.canSaveAllotment()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}

		this._allotmentEditSectionContainer.updateDataOn(this._allotmentVM);

		this.isSavingAllotment = true;
		this._allotmentsService.saveAllotmentDO(this._allotmentVM.allotment)
			.subscribe((updatedAllotment: AllotmentDO) => {
				this.isSavingAllotment = false;
				this.showViewScreen();
			}, (error: ThError) => {
				this.isSavingAllotment = false;
				this._appContext.toaster.error(error.message);
			});
	}

	printPage() {
		var title = this._appContext.thTranslation.translate("Allotment for %customerName%", { customerName: this._allotmentVM.customer.customerName });
		this._appContext.thUtils.printPage(title);
	}
}