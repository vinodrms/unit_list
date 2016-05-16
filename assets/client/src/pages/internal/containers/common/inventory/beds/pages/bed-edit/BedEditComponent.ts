import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ControlGroup} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {BedEditService} from './services/BedEditService';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {BaseFormComponent} from '../../../../../../../../common/base/BaseFormComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {BedTemplateDO} from '../../../../../../services/common/data-objects/bed-template/BedTemplateDO';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {BedDO, BedStorageType, BedAccommodationType} from '../../../../../../services/beds/data-objects/BedDO';
import {BedsService} from '../../../../../../services/beds/BedsService';
import {BedTemplatesService} from '../../../../../../services/settings/BedTemplatesService';
import {BedTemplatesDO} from '../../../../../../services/settings/data-objects/BedTemplatesDO';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';

@Component({
    selector: 'bed-edit',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/beds/pages/bed-edit/template/bed-edit.html',
    providers: [BedEditService],
    directives: [LoadingComponent, CustomScroll],
    pipes: [TranslationPipe]
})
export class BedEditComponent extends BaseFormComponent implements OnInit {
    isLoading: boolean;
    isSavingBed: boolean = false;
    
    displayedBedTemplates: BedTemplateDO[];
    allBedTemplates: BedTemplateDO[];
    
    private _bedVM: BedVM;
    public get bedVM(): BedVM {
		return this._bedVM;
	}
	@Input()
	public set bedVM(bedVM: BedVM) {
		this._bedVM = bedVM;
		this.initDefaultBedData();
		this.initForm();
	}
    @Output() onExit = new EventEmitter();
	public showViewScreen() {
		this.onExit.next(true);
	}
    
    constructor(private _appContext: AppContext,
        private _bedEditService: BedEditService,
        private _bedsService: BedsService,
        private _bedTemplateService: BedTemplatesService) {
        super();
        
        this.displayedBedTemplates = [];
    }

    ngOnInit() { 
        this.isLoading = true;
        
		Observable.combineLatest(
			this._bedTemplateService.getBedTemplatesDO()
		).subscribe((result: [BedTemplatesDO]) => {
            this.allBedTemplates = result[0].bedTemplateList;
            this.initDefaultBedData();
            this.isLoading = false;            
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
    }
    
    private initDefaultBedData() {
		if(!this.bedVM.bed.bedTemplateId && this.allBedTemplates && !_.isEmpty(this.allBedTemplates)) {
            this.bedVM.bed.bedTemplateId = this.allBedTemplates[0].id;
        }
        this.filterBedTemplatesByAccommodationType();
	}
	private initForm() {
		this.didSubmitForm = false;
        this._bedEditService.updateFormValues(this._bedVM);	
	}
    
    protected getDefaultControlGroup(): ControlGroup {
        return this._bedEditService.bedForm;
    }
    
    public isNewBed(): boolean {
		return this._bedVM.bed.id == null || this._bedVM.bed.id.length == 0;
	}
    
    public saveBed() {
        this.didSubmitForm = true;
        if (!this._bedEditService.isValidForm()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}    
        
        var bed = this._bedVM.bed;
        this._bedEditService.updateBed(bed);
        if(this._bedVM.bed.accommodationType === BedAccommodationType.Babies) {
            this.removeDimensionsAndCapacityFromBedObject(bed);
        }
        
        this.isSavingBed = true;
		this._bedsService.saveBedDO(bed).subscribe((updatedBed: BedDO) => {
			this.isSavingBed = false;
			this.showViewScreen();
		}, (error: ThError) => {
			this.isSavingBed = false;
			this._appContext.toaster.error(error.message);
		});
    }
    
    private removeDimensionsAndCapacityFromBedObject(bed: BedDO) {
        delete bed.size;
        delete bed.capacity;        
    }
    
    public toggleStorageType() {
        if(this._bedVM.bed.storageType === BedStorageType.Rollaway) {
            this._bedVM.bed.storageType = BedStorageType.Stationary;
        }
        else if(this._bedVM.bed.storageType === BedStorageType.Stationary) {
            this._bedVM.bed.storageType = BedStorageType.Rollaway;
        }         
    }
    
    public toggleAccommodationType() {
        if(this._bedVM.bed.accommodationType === BedAccommodationType.Babies) {
            this._bedVM.bed.accommodationType = BedAccommodationType.AdultsAndChildren;
        }
        else if(this._bedVM.bed.accommodationType === BedAccommodationType.AdultsAndChildren) {
            this._bedVM.bed.accommodationType = BedAccommodationType.Babies;
        }
        this.filterBedTemplatesByAccommodationType();
        this.makeTheDefaultBedTemplateSelection();    
    }
    
    private filterBedTemplatesByAccommodationType() {
        this.displayedBedTemplates = _.filter(this.allBedTemplates, (bedTemplate: BedTemplateDO) => {
            return bedTemplate.accommodationType === this._bedVM.bed.accommodationType;     
        });
    }
    
    private makeTheDefaultBedTemplateSelection() {
        if(this.displayedBedTemplates.length === 1) {
            this.bedVM.bed.bedTemplateId = this.displayedBedTemplates[0].id;
        }
        else {
            delete this.bedVM.bed.bedTemplateId;
        }        
    }
    
    public get isStationary(): boolean {
        return this._bedVM.bed.storageType === BedStorageType.Stationary;
    }
    
    public get accomodatesBabies(): boolean {
        return this._bedVM.bed.accommodationType === BedAccommodationType.Babies
    }
}