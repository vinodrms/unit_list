import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedPipesModule} from "../../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule";
import {RoomAvailabilityModalComponent} from "./RoomAvailabilityModalComponent";

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule],
    declarations: [RoomAvailabilityModalComponent],
    exports: [RoomAvailabilityModalComponent]
})
export class RoomAvailabilityModalModule { }
