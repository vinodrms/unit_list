import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedComponentsModule} from '../../../../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import {SharedPipesModule} from "../../../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule";
import {RoomMaintenanceStatusModalComponent} from "./RoomMaintenanceStatusModalComponent";


@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule, SharedComponentsModule],
    declarations: [RoomMaintenanceStatusModalComponent],
    exports: [RoomMaintenanceStatusModalComponent]
})
export class RoomMaintenanceStatusModalModule { }
