import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {BaseComponent} from '../../../../common/base/BaseComponent';
import {ThHourPipe} from '../../../../common/utils/pipes/ThHourPipe';
import {ThHourDO} from '../../../../pages/internal/services/common/data-objects/th-dates/ThHourDO';
import {ThHourVM} from './utils/ThHourVM';
import {HotelDO} from '../../../../pages/internal/services/hotel/data-objects/hotel/HotelDO.ts';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {OperationHoursBuilder} from './utils/OperationHoursBuilder';

@Component({
    selector: 'th-hour-select',
    template: `
		<div class="form-group">
        	<div class="input-group" [ngClass]="{'form-warning': displayError()}">
            	<select class="form-control" [ngModel]="initialHourIndex" (ngModelChange)="onHourChanged($event)" [disabled]="readonly">
                    <option value="" disabled></option>
                	<option *ngFor="let hourVM of hoursList" [value]="hourVM.index">{{hourVM.thHour | thhour}}</option>
            	</select>
			</div>
            <label class="form-warning"><small><i class="fa fa-info-circle"></i> {{errorMessage | translate}}</small></label>
		</div>
        `,
    pipes: [TranslationPipe, ThHourPipe]
})
export class ThHourSelectComponent extends BaseComponent implements OnInit {
	private _hoursBuilder: OperationHoursBuilder = new OperationHoursBuilder();
    
    hoursList: ThHourVM[];
    initialHourIndex: number = -1;
	
	@Input() readonly: boolean;
	@Input() initialHour: ThHourDO;
    @Input() isRequired: boolean = false;
	@Input() didSubmitForm: boolean = false;
    @Input() errorMessage: string;
    
    @Output() onHourSelected = new EventEmitter();
    
    constructor() { 
        super();
		this.hoursList = this._hoursBuilder.operationHoursList;
    }
    
    ngOnInit() {
		this.initialHourIndex = this._hoursBuilder.getInitialIndexFor(this.initialHour);
    }
    
    onHourChanged(hourIndex: number) {
        this.initialHourIndex = hourIndex;
        var selectedHourVM: ThHourVM = _.find(this.hoursList, ((hourVM: ThHourVM)=>{
            return hourVM.index == hourIndex;            
        }));
		this.onHourSelected.next(selectedHourVM.thHour);
	}
    
    public displayError(): boolean {
		return this.didSubmitForm && (!this.initialHourIndex || this.initialHourIndex == -1) && this.isRequired;
	}
}