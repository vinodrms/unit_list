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
	@Output() startedDragging = new EventEmitter();

	constructor(private _zone: NgZone, private _root: ElementRef) {
	}

	ngAfterViewInit() {
		$(this._root.nativeElement).draggable(
            {
                revert:     'invalid',
				cursorAt: { left: 12 , bottom: 6 },
				helper: () => {
					var helperHtml = `
					<arrival-helper class=" flex-row flex-center-v">
						<div class="left p-6 orange">
							<i class="fa fa-ellipsis-v"></i>
							<i class="fa fa-ellipsis-v"></i>
						</div>
						<div class="right flex-row flex-jc-sb p-6">
							<div class="client-name">`
								+ this.arrivalItemVM.ClientName +
							`</div>
							<div class="other-details gray-color">
								<span class="unitpal-font">:</span>` + this.arrivalItemVM.NumberOfPeople + 
								`<span class="unitpal-font">A</span>`+ this.arrivalItemVM.NumberOfNights +
							`</div>
						</div>
					</arrival-helper>
				`

					return $(helperHtml);
				},
				zIndex:     100,
				start: (event, ui) =>{
					this.startedDragging.emit(this.arrivalItemVM);
				}
            }
		);
	}
}