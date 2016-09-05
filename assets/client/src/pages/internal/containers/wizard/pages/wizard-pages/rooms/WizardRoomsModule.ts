import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {CommonRoomsModule} from '../../../../common/inventory/rooms/CommonRoomsModule';

import {wizardRoomsRouting} from './WizardRoomsRoutes';
import {WizardRoomsComponent} from './WizardRoomsComponent';


@NgModule({
    imports: [CommonModule, SharedPipesModule, CommonRoomsModule, wizardRoomsRouting],
    declarations: [WizardRoomsComponent],
    exports: [WizardRoomsComponent]
})
export class WizardRoomsModule { }