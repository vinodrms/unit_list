import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerSelectorComponent } from "./customer-selector/CustomerSelectorComponent";
import { SharedPipesModule } from "../../../../../../../common/utils/pipes/modules/SharedPipesModule";
import { SharedDirectivesModule } from "../../../../../../../common/utils/directives/modules/SharedDirectivesModule";
import { SharedComponentsModule } from "../../../../../../../common/utils/components/modules/SharedComponentsModule";
import { CustomerRegisterModalService } from "../modal/services/CustomerRegisterModalService";

const CommonCustomerRegisterComponentsDeclarations = [
    CustomerSelectorComponent,
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [CustomerSelectorComponent],
    exports: [CustomerSelectorComponent],
})
export class CustomerSelectorModule { }