import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../common/utils/components/modules/SharedComponentsModule';

import {BasicInfoOverviewEditComponent} from './overview/main/BasicInfoOverviewEditComponent';
import {BasicInfoPaymentsAndPoliciesEditComponent} from './payments-policies/main/BasicInfoPaymentsAndPoliciesEditComponent';
import {BasicInfoTaxListComponent} from './payments-policies/pages/tax-list/BasicInfoTaxListComponent';
import {BasicInfoPropertyDetailsEditComponent} from './property-details/main/BasicInfoPropertyDetailsEditComponent';

const CommonBasicInfoComponentsDeclarations = [
    BasicInfoOverviewEditComponent,
    BasicInfoPaymentsAndPoliciesEditComponent,
    BasicInfoTaxListComponent,
    BasicInfoPropertyDetailsEditComponent
];
const CommonBasicInfoComponentsExports = [
    BasicInfoOverviewEditComponent,
    BasicInfoPaymentsAndPoliciesEditComponent,
    BasicInfoPropertyDetailsEditComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: CommonBasicInfoComponentsDeclarations,
    exports: CommonBasicInfoComponentsExports
})
export class CommonBasicInfoModule { }