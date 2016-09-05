import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {RoomPreviewModule} from '../../../../../../../../common/inventory/rooms/pages/room-preview/RoomPreviewModule';

import {RoomOperationsPageComponent} from './RoomOperationsPageComponent';
import {RoomMaintenanceStatusEditorComponent} from './components/maintenance-status/RoomMaintenanceStatusEditorComponent';
import {RoomBookingPreviewComponent} from './components/booking-preview/RoomBookingPreviewComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule, RoomPreviewModule],
    declarations: [RoomOperationsPageComponent,
        RoomMaintenanceStatusEditorComponent, RoomBookingPreviewComponent],
    exports: [RoomOperationsPageComponent]
})
export class RoomOperationsPageModule { }