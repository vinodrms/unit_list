import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {HotelOperationsDashboardComponent} from './HotelOperationsDashboardComponent';
import {ArrivalsPaneComponent} from './components/arrivals-pane/ArrivalsPaneComponent';
import {ArrivalItemComponent} from './components/arrivals-pane/components/arrival-item/ArrivalItemComponent';
import {DeparturesPaneComponent} from './components/departures-pane/DeparturesPaneComponent';
import {DepartureItemComponent} from './components/departures-pane/components/departure-item/DepartureItemComponent';
import {RoomsCanvasComponent} from './components/rooms-canvas/RoomsCanvasComponent';
import {RoomCardComponent} from './components/rooms-canvas/components/room-card/RoomCardComponent';

import {HOTEL_OPERATIONS_DASHBOARD_PROVIDERS} from '../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardProviders';
import {EagerCustomersService} from '../../../../../../services/customers/EagerCustomersService';
import {HotelOperationsRoomService} from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomModalService} from '../assign-room/services/AssignRoomModalService';
import {HotelOperationsModalService} from '../operations-modal/services/HotelOperationsModalService';
import {HotelDashboardModalService} from './services/HotelDashboardModalService';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [HotelOperationsDashboardComponent,
        ArrivalsPaneComponent, ArrivalItemComponent,
        DeparturesPaneComponent, DepartureItemComponent,
        RoomsCanvasComponent, RoomCardComponent],
    exports: [HotelOperationsDashboardComponent],
    providers: [HOTEL_OPERATIONS_DASHBOARD_PROVIDERS, EagerCustomersService, HotelOperationsRoomService,
        AssignRoomModalService, HotelOperationsModalService, HotelDashboardModalService]
})
export class HotelOperationsDashboardModule { }