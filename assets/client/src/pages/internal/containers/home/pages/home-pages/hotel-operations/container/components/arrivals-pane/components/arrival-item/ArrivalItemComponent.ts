import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';

// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
// client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/arrivals-pane/components/arrival-item/template/arrival-item.html

declare var $: any;
@Component({
	selector: 'arrival-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/arrivals-pane/components/arrival-item/template/arrival-item.html'
})

export class ArrivalItemComponent {
	@Input() arrivalItemVM: any;

	constructor(private _zone: NgZone, private _root: ElementRef) {
	}

	ngAfterViewInit() {
		$(this._root.nativeElement).draggable(
            {
                revert:     'invalid', 
                helper:     'clone', 
                zIndex:     100
            }			
		);		
	}
}