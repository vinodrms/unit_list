import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../common/utils/components/modules/SharedComponentsModule';

import {BedSelectorModule} from './pages/room-edit/components/bed-selector/BedSelectorModule';
import {RoomsComponent} from './main/RoomsComponent';
import {RoomOverviewComponent} from './pages/room-overview/RoomOverviewComponent';
import {RoomEditComponent} from './pages/room-edit/RoomEditComponent';

const CommonRoomsComponentsDeclarations = [
    RoomsComponent,
    RoomOverviewComponent,
    RoomEditComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule, BedSelectorModule],
    declarations: [CommonRoomsComponentsDeclarations],
    exports: [RoomsComponent]
})
export class CommonRoomsModule { }