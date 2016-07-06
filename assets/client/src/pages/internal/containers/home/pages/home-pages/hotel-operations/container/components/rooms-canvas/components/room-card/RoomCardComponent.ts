import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';
import {RoomDropHandlerFactory} from './drop-handlers/RoomDropHandlerFactory';

// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';

declare var $: any;
@Component({
	selector: 'room-card',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/rooms-canvas/components/room-card/template/room-card.html'
})

export class RoomCardComponent {
	@Input() roomVM: any;
	@Output() dropped = new EventEmitter();
	
	constructor(private _zone: NgZone, private _root: ElementRef) {
	}

	ngAfterViewInit() {
		$(this._root.nativeElement).find('.room-card').droppable(
			{
				accept: 'arrival-item',
				drop: (event : Event, ui : Object) => {
					this._zone.run(()=>{
						var dropHandler = RoomDropHandlerFactory.get(this.roomVM.Status);
						var outcome = {
							accepted : dropHandler.handle("test"),
							roomVM: this.roomVM
						}

						if (outcome.accepted == true){
							this.roomVM.Status = "Occupied";
							this.dropped.emit(outcome)
						}
						else {
							this.dropped.emit(outcome)
						}
					})
				}
			}
		);
	}
}