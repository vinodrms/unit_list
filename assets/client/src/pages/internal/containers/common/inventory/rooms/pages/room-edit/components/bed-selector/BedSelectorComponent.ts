import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {BedSelectionVM} from '../../../../../modals/beds/services/utils/BedSelectionVM';
import {BedsModalService} from '../../../../../modals/beds/services/BedsModalService';
import {BedVM} from '../../../../../../../../services/beds/view-models/BedVM';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';

@Component({
    selector: 'bed-selector',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-edit/components/bed-selector/template/bed-selector.html',
    providers: [BedsModalService],
    pipes: [TranslationPipe]
})
export class BedSelectorComponent extends BaseComponent implements OnInit {
    private MIN_BED_NO = 0;
    private MAX_BED_NO = 6;
    
    private emptySlots: Object[];
    
    @Input() availableBedList: BedVM[];
    @Input() selectedBedList: BedVM[];
    
    @Output() selectedBedListChanged: EventEmitter<BedVM[]> = new EventEmitter<BedVM[]>(); 
    
    constructor(private _appContext: AppContext,
        private _bedsModalService: BedsModalService) {
        super();
    }
    
    ngOnInit() {
        this.resetEmptySlots();
    }
    
    private resetEmptySlots() {
        if (this._appContext.thUtils.isUndefinedOrNull(this.emptySlots)) {
            this.emptySlots = [];
        }
        var emptySlotsNO = this.MAX_BED_NO - this.selectedBedList.length;
        if (emptySlotsNO < this.emptySlots.length) {
            while (emptySlotsNO != this.emptySlots.length) {
                this.emptySlots.splice(0, 1);
            }
        }
        else if (emptySlotsNO > this.emptySlots.length) {
            while (emptySlotsNO != this.emptySlots.length) {
                this.emptySlots.push(new Object());
            }
        }
    }
    
    public get maximuNumberOfBedsReached(): boolean {
        return this.MAX_BED_NO === this.selectedBedList.length;
    }
    
    public openBedsSelectModal() {
        this._bedsModalService.openAllBedsModal(this.availableBedList, this.selectedBedList, this.MIN_BED_NO, this.MAX_BED_NO).then((modalDialogInstance: ModalDialogInstance<BedVM[]>) => {
            modalDialogInstance.resultObservable.subscribe((savedSelectedBedList: BedVM[]) => {
                this.selectedBedList = savedSelectedBedList;
                this.resetEmptySlots();
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
            this.resetEmptySlots();
            this.triggerSelectedBedListChanged();
        });
    }
}
