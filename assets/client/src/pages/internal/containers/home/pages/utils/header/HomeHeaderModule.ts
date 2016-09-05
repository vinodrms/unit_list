import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {MainHeaderComponent} from './container/MainHeaderComponent';
import {HeaderSettingsComponent} from './subcomponents/settings/HeaderSettingsComponent';
import {HeaderNotificationsComponent} from './subcomponents/notifications/HeaderNotificationsComponent';


@NgModule({
    imports: [CommonModule, FormsModule, RouterModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [MainHeaderComponent, HeaderSettingsComponent, HeaderNotificationsComponent],
    exports: [MainHeaderComponent, HeaderSettingsComponent, HeaderNotificationsComponent]
})
export class HomeHeaderModule { }