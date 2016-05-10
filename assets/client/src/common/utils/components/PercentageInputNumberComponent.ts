import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../localization/TranslationPipe';

@Component({
	selector: 'percentage-input-number',
	template: `
		<div class="form-group">
        	<div class="input-group" [ngClass]="{'form-warning': displayError()}">
            	<input type="number" placeholder="{{placeholder | translate}}" class="form-control input-group-lg" 
					 [ngModel]="percentage"
					 (ngModelChange)="didChangePercentage($event)"
					 [readonly]="readonly">
			</div>
            <label class="form-warning"><small><i class="fa fa-info-circle"></i> {{errorMessage | translate}}</small></label>
		</div>
	`,
	pipes: [TranslationPipe]
})

export class PercentageInputNumberComponent implements OnInit {
	@Input() placeholder: string = "1 - 100";
	@Input() didSubmitForm: boolean = false;
	@Input() initialPercentage: number;
	@Input() readonly: boolean;
	@Input() isRequired: boolean = false;
	@Input() errorMessage: string;

	@Output() onPercentageChanged = new EventEmitter();

	percentage: number;

	constructor() { }

	public ngOnInit() {
		if (this.initialPercentage != null && _.isNumber(this.initialPercentage)) {
			this.percentage = this.initialPercentage * 100;
		}
	}

	didChangePercentage(percentage: number) {
		this.percentage = percentage;
		if (this.isValidPercentage()) {
			this.onPercentageChanged.next(this.percentage / 100);
		}
		else {
			this.onPercentageChanged.next(null);
		}
	}

	public displayError(): boolean {
		return this.didSubmitForm && !this.isValidPercentage() && this.isRequired;
	}
	private isValidPercentage(): boolean {
		return _.isNumber(this.percentage) && this.percentage >= 0 && this.percentage <= 100;
	}
}