import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../common/utils/components/modules/SharedComponentsModule';

import {CustomerRegisterComponent} from './main/CustomerRegisterComponent';
import {CustomerRegisterOverviewComponent} from './pages/customer-overview/CustomerRegisterOverviewComponent';
import {CustomerRegisterEditContainerComponent} from './pages/customer-edit/container/CustomerRegisterEditContainerComponent';
import {CorporateCustomerDetailsComponent} from './pages/customer-edit/customer-details/corporate/CorporateCustomerDetailsComponent';
import {IndividualCustomerDetailsComponent} from './pages/customer-edit/customer-details/individual/IndividualCustomerDetailsComponent';

const CommonCustomerRegisterComponentsDeclarations = [
    CustomerRegisterComponent,
    CustomerRegisterOverviewComponent,
    CustomerRegisterEditContainerComponent,
    CorporateCustomerDetailsComponent,
    IndividualCustomerDetailsComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [CommonCustomerRegisterComponentsDeclarations],
    exports: [CustomerRegisterComponent]
})
export class CommonCustRegisterModule { }