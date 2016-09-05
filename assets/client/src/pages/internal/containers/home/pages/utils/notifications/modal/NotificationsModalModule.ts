import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {NotificationsModalComponent} from './NotificationsModalComponent';

@NgModule({
    imports: [CommonModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [NotificationsModalComponent],
    exports: [NotificationsModalComponent],
})
export class NotificationsModalModule { }