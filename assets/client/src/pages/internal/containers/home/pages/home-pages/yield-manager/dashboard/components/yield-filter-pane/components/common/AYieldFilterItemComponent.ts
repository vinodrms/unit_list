import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TextFilterVM}  from '../../../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';

export abstract class AYieldFilterItemComponent implements OnInit {
	public selected: boolean;
	
	constructor() { }

	ngOnInit() {
		this.selected = false;
	}

	public toggleSelection() {
		debugger;
		this.selected = !this.selected;
		this.triggerOnToggleSelectionEvent(this.selected);
	}

	public triggerOnToggleSelectionEvent(selected: boolean){
		throw new Error("Trigger onSelect event not implemented")
	}

	public deselect(){
		this.selected = false;
	}
}