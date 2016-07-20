import {Component, Input, OnInit} from '@angular/core';
import {HotelRoomOperationsPageParam} from './services/utils/HotelRoomOperationsPageParam';

@Component({
    selector: 'room-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/template/room-operations-page.html'
})
export class RoomOperationsPageComponent implements OnInit {
    @Input() roomOperationsPageParam: HotelRoomOperationsPageParam;

    constructor() { }

    ngOnInit() {
    }

}