import { Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';
import {BaseComponent} from '../../../../common/base/BaseComponent';
import {ThHourDO} from '../../../../pages/internal/services/common/data-objects/th-dates/ThHourDO';
import {ThHourVM} from './utils/ThHourVM';
import {HotelDO} from '../../../../pages/internal/services/hotel/data-objects/hotel/HotelDO.ts'
import {HourPipe} from '../../../../common/utils/pipes/HourPipe';
import {MinutePipe} from '../../../../common/utils/pipes/MinutePipe';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';

@Component({
    selector: 'th-hour-select',
    template: `
		<div class="form-group">
        	<div class="input-group" [ngClass]="{'form-warning': displayError()}">
            	<select class="form-control" [ngModel]="initialHourIndex" (change)="onHourChanged($event.target.value)">
                    <option value="" disabled></option>
                	<option *ngFor="#hourVM of hoursList" [value]="hourVM.index">{{hourVM.thHour.hour | hour}}:{{hourVM.thHour.minute | minute}}</option>
            	</select>
			</div>
            <label class="form-warning"><small><i class="fa fa-info-circle"></i> {{errorMessage | translate}}</small></label>
		</div>
        `,
    pipes: [TranslationPipe, HourPipe, MinutePipe]
})
export class ThHourSelectComponent extends BaseComponent implements OnInit {
    
    @Input() hoursList: ThHourVM[];
    @Input() initialHourIndex: number;
    @Input() isRequired: boolean = false;
	@Input() didSubmitForm: boolean = false;
    @Input() errorMessage: string;
    
    @Output() onHourSelected = new EventEmitter();
    
    selectedHourIndex: number;
    
    constructor() { 
        super();
    }
    
    ngOnInit() {
        this.selectedHourIndex = this.initialHourIndex;
    }
    
    onHourChanged(hourIndex: number) {
        this.selectedHourIndex = hourIndex;
        var selectedHourVM: ThHourVM = _.find(this.hoursList, ((hourVM: ThHourVM)=>{
            return hourVM.index == hourIndex;            
        }));
		this.onHourSelected.next(selectedHourVM.thHour);
	}
    
    public displayError(): boolean {
		return this.didSubmitForm && (!this.selectedHourIndex || this.selectedHourIndex == -1) && this.isRequired;
	}
}