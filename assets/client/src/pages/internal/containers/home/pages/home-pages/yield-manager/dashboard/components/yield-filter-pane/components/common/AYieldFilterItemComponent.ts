import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TextFilterVM}  from '../../../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';

export abstract class AYieldFilterItemComponent implements OnInit {
	public selected: boolean;
	constructor() { }

	ngOnInit() {
		this.selected = false;
	}

	public toggleSelection() {
		this.selected = !this.selected;
		if (this.selected){
			this.triggerOnSelectEvent();
		}
	}

	public triggerOnSelectEvent(){
		throw new Error("Trigger onSelect event not implemented")
	}

	public deselect(){
		this.selected = false;
	}
}