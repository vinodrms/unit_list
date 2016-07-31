import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ControlGroup} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BedSelectionVM} from '../../../../../modals/beds/services/utils/BedSelectionVM';
import {BedsModalService} from '../../../../../modals/beds/services/BedsModalService';
import {BedVM} from '../../../../../../../../services/beds/view-models/BedVM';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {RoomCategoryDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';

@Component({
    selector: 'bed-selector',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-edit/components/bed-selector/template/bed-selector.html',
    directives: [CustomScroll],
    providers: [BedsModalService],
    pipes: [TranslationPipe]
})
export class BedSelectorComponent extends BaseComponent {
    private MIN_BED_NO = 0;
    private MAX_BED_NO = 6;
    
    @Input() availableBedList: BedVM[] = [];
    @Input() selectedBedList: BedVM[] = [];
    @Input() roomCategory: RoomCategoryDO;
    
    @Output() selectedBedListChanged: EventEmitter<BedVM[]> = new EventEmitter<BedVM[]>(); 
    
    constructor(private _appContext: AppContext,
        private _bedsModalService: BedsModalService) {
        super();
    }
    
    
    public get maximuNumberOfBedsReached(): boolean {
        return this.MAX_BED_NO === this.selectedBedList.length;
    }
    
    public get emptySlots(): any[] {
        var result = [];
        var emptySlotsNO = this.MAX_BED_NO - this.selectedBedList.length;
        if(emptySlotsNO > 0) {
            for(var i = 0; i < emptySlotsNO; ++i)
                result.push(i);
        }
        
        return result;
    }
    
    public openBedsSelectModal() {
        this._bedsModalService.openAllBedsModal(this.availableBedList, this.selectedBedList, this.MIN_BED_NO, this.MAX_BED_NO).then((modalDialogInstance: ModalDialogRef<BedVM[]>) => {
            modalDialogInstance.resultObservable.subscribe((savedSelectedBedList: BedVM[]) => {
                this.selectedBedList = savedSelectedBedList;
                this.triggerSelectedBedListChanged();
            });
        }).catch((e: any) => { });
    }
    
    private triggerSelectedBedListChanged() {
        this.selectedBedListChanged.next(this.selectedBedList);
    }
    
    public removeBed(bedIndex: number) {
        var title = this._appContext.thTranslation.translate("Remove Bed");
        var content = this._appContext.thTranslation.translate("Are you sure you want to remove one %name% from this room ?", { name: this.selectedBedList[bedIndex].bed.name });
        var positiveLabel = this._appContext.thTranslation.translate("Yes");
        var negativeLabel = this._appContext.thTranslation.translate("No");
        this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.selectedBedList.splice(bedIndex, 1);
            this.triggerSelectedBedListChanged();
        });
    }
    
    public get readonly(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this.roomCategory) && !this._appContext.thUtils.isUndefinedOrNull(this.roomCategory.bedConfig) &&
            !_.isEmpty(this.roomCategory.bedConfig.bedMetaList);
    }
}
