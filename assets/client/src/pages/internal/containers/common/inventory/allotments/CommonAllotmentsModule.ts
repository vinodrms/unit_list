import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../common/utils/components/modules/SharedComponentsModule';

import {AllotmentsComponent} from './main/AllotmentsComponent';
import {AllotmentOverviewComponent} from './pages/allotment-overview/AllotmentOverviewComponent';
import {AllotmentEditContainerComponent} from './pages/allotment-edit/container/AllotmentEditContainerComponent';
import {AllotmentEditTopSectionComponent} from './pages/allotment-edit/sections/top-section/AllotmentEditTopSectionComponent';
import {AllotmentOpenIntervalSectionComponent} from './pages/allotment-edit/sections/open-interval/AllotmentOpenIntervalSectionComponent';
import {AllotmentAvailabilitySectionComponent} from './pages/allotment-edit/sections/availability/AllotmentAvailabilitySectionComponent';
import {AllotmentEditConstraintsSectionComponent} from './pages/allotment-edit/sections/constraints/constraint-list/AllotmentEditConstraintsSectionComponent';
import {AllotmentNotesSectionComponent} from './pages/allotment-edit/sections/notes/AllotmentNotesSectionComponent';

const CommonAllotmentsComponentsDeclarations = [
    AllotmentsComponent,
    AllotmentOverviewComponent,
    AllotmentEditContainerComponent,
    AllotmentEditTopSectionComponent,
    AllotmentOpenIntervalSectionComponent,
    AllotmentAvailabilitySectionComponent,
    AllotmentEditConstraintsSectionComponent,
    AllotmentNotesSectionComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [CommonAllotmentsComponentsDeclarations],
    exports: [AllotmentsComponent]
})
export class CommonAllotmentsModule { }