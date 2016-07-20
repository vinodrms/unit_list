import {Component, OnInit, Output, EventEmitter, Inject} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {HotelOperationsPageController} from './services/utils/HotelOperationsPageController';
import {IHotelOperationsPageParam, HotelOperationsPageTitleMeta} from '../services/utils/IHotelOperationsPageParam';
import {HotelOperationsPageType} from '../services/utils/HotelOperationsPageType';
import {RoomOperationsPageComponent} from './components/room-operations/RoomOperationsPageComponent';

@Component({
    selector: 'hotel-operations',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/template/hotel-operations.html',
    directives: [RoomOperationsPageComponent],
    pipes: [TranslationPipe]
})
export class HotelOperationsComponent {
    @Output() onRoomChanged = new EventEmitter<boolean>();
    @Output() onBookingChanged = new EventEmitter<boolean>();
    @Output() onInvoiceChanged = new EventEmitter<boolean>();
    @Output() onExit = new EventEmitter<boolean>();
    public triggerOnExit() {
        this.onExit.next(true);
    }

    private _hotelOperationsPageController: HotelOperationsPageController;

    constructor( @Inject(IHotelOperationsPageParam) public hotelOperationsPageParam: IHotelOperationsPageParam) {
        this._hotelOperationsPageController = new HotelOperationsPageController(hotelOperationsPageParam);
    }

    public canGoBack() {
        return this._hotelOperationsPageController.canGoBack();
    }
    public goBack() {
        this._hotelOperationsPageController.goBack();
    }

    public get titleMeta(): HotelOperationsPageTitleMeta {
        return this.currentHotelOperationsPageParam.titleMeta;
    }

    public isRoomOperationsPage(): boolean {
        return this.currentHotelOperationsPageParam.pageType === HotelOperationsPageType.RoomOperations;
    }

    private get currentHotelOperationsPageParam(): IHotelOperationsPageParam {
        return this._hotelOperationsPageController.currentHotelOperationsPageParam;
    }
}