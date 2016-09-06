import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonRoomsModule} from '../../../../../../common/inventory/rooms/CommonRoomsModule';

import {settingsRoomsRouting} from './SettingsRoomsRoutes';
import {SettingsRoomsComponent} from './SettingsRoomsComponent';


@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonRoomsModule, settingsRoomsRouting],
    declarations: [SettingsRoomsComponent],
    exports: [SettingsRoomsComponent]
})
export class SettingsRoomsModule { }