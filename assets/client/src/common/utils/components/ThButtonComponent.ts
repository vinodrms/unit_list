import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'th-button',
	template: `
		<a class="btn th-button-box" [ngClass]="{'pull-right': pullRight}" (click)="triggerOnButtonClick()" th-clickable>
			<i class="fa fa-2x unitpal-font">{{ upFont }}</i>
			<span>{{ text | translate }}</span>
		</a>
	`
})
export class ThButtonComponent {
	@Input() pullRight: boolean = false;

	private _upFont: string;
	public get upFont(): string {
		return this._upFont;
	}
	@Input()
	public set upFont(upFont: string) {
		this._upFont = upFont;
	}

	private _text: string;
	public get text(): string {
		return this._text;
	}
	@Input()
	public set text(text: string) {
		this._text = text;
	}

	@Output() onButtonClick = new EventEmitter();
	public triggerOnButtonClick() {
		this.onButtonClick.next(null);
	}

	constructor() {
		this._upFont = '8';
	}
}
