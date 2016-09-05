import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {AssignRoomModalComponent} from './AssignRoomModalComponent';
import {PriceSelectionComponent} from './components/price-selection/PriceSelectionComponent';
import {RoomSelectionComponent} from './components/room-selection/RoomSelectionComponent';

import {SETTINGS_PROVIDERS} from '../../../../../../services/settings/SettingsProviders';
import {BookingOccupancyService} from '../../../../../../services/bookings/occupancy/BookingOccupancyService';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelAggregatorService} from '../../../../../../services/hotel/HotelAggregatorService';
import {HotelOperationsRoomService} from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {EagerCustomersService} from '../../../../../../services/customers/EagerCustomersService';
import {RoomCategoriesStatsService} from '../../../../../../services/room-categories/RoomCategoriesStatsService';
import {RoomsService} from '../../../../../../services/rooms/RoomsService';
import {EagerBookingsService} from '../../../../../../services/bookings/EagerBookingsService';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [AssignRoomModalComponent, PriceSelectionComponent, RoomSelectionComponent],
    exports: [AssignRoomModalComponent],
    providers: [SETTINGS_PROVIDERS, HotelService, HotelAggregatorService,
        RoomCategoriesStatsService, RoomsService, EagerCustomersService,
        EagerBookingsService, BookingOccupancyService,
        HotelOperationsRoomService]
})
export class AssignRoomModalModule { }