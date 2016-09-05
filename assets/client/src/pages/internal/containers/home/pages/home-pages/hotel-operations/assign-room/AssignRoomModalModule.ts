import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {AssignRoomModalComponent} from './AssignRoomModalComponent';
import {PriceSelectionComponent} from './components/price-selection/PriceSelectionComponent';
import {RoomSelectionComponent} from './components/room-selection/RoomSelectionComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [AssignRoomModalComponent, PriceSelectionComponent, RoomSelectionComponent],
    exports: [AssignRoomModalComponent]
})
export class AssignRoomModalModule { }