import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../common/utils/components/modules/SharedComponentsModule';

import {BedsComponent} from './main/BedsComponent';
import {BedOverviewComponent} from './pages/bed-overview/BedOverviewComponent';
import {BedEditComponent} from './pages/bed-edit/BedEditComponent';

const CommonBedsComponentsDeclarations = [
    BedsComponent,
    BedOverviewComponent,
    BedEditComponent,
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [CommonBedsComponentsDeclarations],
    exports: [BedsComponent]
})
export class CommonBedsModule { }