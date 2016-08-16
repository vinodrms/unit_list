import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export enum YieldViewModeState{
	Default,
	ExpandedYieldKeyMetrics,
	ExpandedYieldPriceProducts
}

class ViewModeButton{
	constructor(private _state: YieldViewModeState, private _active: boolean){
	}

	public get state() : YieldViewModeState {
		return this._state;
	}

	public set state(v : YieldViewModeState) {
		this._state = v;
	}
	
	public get active() : boolean {
		return this._active;
	}
	public set active(v : boolean) {
		this._active = v;
	}
	
	public getIcon():string{
		switch(this._state){
			case YieldViewModeState.Default : {
				return '-';
			}
			case YieldViewModeState.ExpandedYieldKeyMetrics :{
				return ',';
			}
			case YieldViewModeState.ExpandedYieldPriceProducts: {
				return '/';
			}
		}
	}
}
@Component({
	selector: 'yield-view-mode',
	templateUrl: 'client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-view-mode/template/yield-view-mode.html'
})
export class YieldViewModeComponent implements OnInit {
	public mouseHover: boolean;
	public buttonLeft: ViewModeButton;
	public buttonMiddle: ViewModeButton;
	public buttonRight: ViewModeButton;
	
	@Output() onStateChange = new EventEmitter<YieldViewModeState>();

	constructor() { 
		this.buttonLeft = new ViewModeButton(YieldViewModeState.ExpandedYieldKeyMetrics, false);
		this.buttonMiddle = new ViewModeButton(YieldViewModeState.Default, false);
		this.buttonRight = new ViewModeButton(YieldViewModeState.ExpandedYieldPriceProducts, false);
	}

	ngOnInit() { 
		this.changeState(this.buttonRight);
	}

	public changeState(button:ViewModeButton){
		var oldState = this.buttonMiddle.state;
		var newState = button.state;

		if (newState != oldState){
			switch(button.state){
				case YieldViewModeState.Default : {
					this.buttonLeft.state = YieldViewModeState.ExpandedYieldKeyMetrics;
					this.buttonMiddle.state = YieldViewModeState.Default;
					this.buttonRight.state = YieldViewModeState.ExpandedYieldPriceProducts;
					break;
				}
				case YieldViewModeState.ExpandedYieldKeyMetrics :{
					this.buttonLeft.state = YieldViewModeState.ExpandedYieldPriceProducts;
					this.buttonMiddle.state = YieldViewModeState.ExpandedYieldKeyMetrics;
					this.buttonRight.state = YieldViewModeState.Default;
					break;
				}
				case YieldViewModeState.ExpandedYieldPriceProducts: {
					this.buttonLeft.state = YieldViewModeState.Default;
					this.buttonMiddle.state = YieldViewModeState.ExpandedYieldPriceProducts;
					this.buttonRight.state = YieldViewModeState.ExpandedYieldKeyMetrics;
					break;
				}
			}

			this.onStateChange.emit(newState);
		}
	}

	public mouseOver(){
		this.mouseHover = true;
	}

	public mouseLeave(){
		this.mouseHover = false;
	}
}