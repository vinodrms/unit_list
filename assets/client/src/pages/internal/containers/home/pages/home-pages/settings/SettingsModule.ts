import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {SettingsNavbarService} from './subcomponents/navbar/services/SettingsNavbarService';
import {SettingsNavbarComponent} from './subcomponents/navbar/SettingsNavbarComponent';

import {SettingsContainerComponent} from './container/SettingsContainerComponent';
import {settingsRouting} from './SettingsRoutes';

const SettingsModuleDeclarations = [
    SettingsContainerComponent,
    SettingsNavbarComponent
];

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        settingsRouting],
    declarations: [SettingsModuleDeclarations],
    exports: [SettingsContainerComponent],
    providers: [SettingsNavbarService]
})
export class SettingsModule { }