import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';

@Component({
	selector: 'new-booking-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/container/template/new-booking-container.html',
	pipes: [TranslationPipe]
})
export class NewBookingContainerComponent implements OnInit {
	@Input() showCloseButton: boolean = false;

	@Output() onCloseButtonPressed = new EventEmitter();
	public triggerOnCloseButtonPressed() {
		this.onCloseButtonPressed.next(null);
	}

	constructor() { }

	ngOnInit() { }

}