import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedComponentsModule} from '../../../common/utils/components/modules/SharedComponentsModule';
import {ExternalFooterModule} from './common/footer/ExternalFooterModule';
import {LogInComponent} from './log-in/LogInComponent';
import {ResetPasswordComponent} from './reset-password/ResetPasswordComponent';
import {SignUpComponent} from './sign-up/SignUpComponent';
import {UpdatePasswordComponent} from './update-password/UpdatePasswordComponent';

@NgModule({
    imports: [CommonModule, RouterModule, ReactiveFormsModule,
        SharedPipesModule, SharedComponentsModule, ExternalFooterModule],
    declarations: [LogInComponent, ResetPasswordComponent, SignUpComponent, UpdatePasswordComponent],
    exports: [LogInComponent, ResetPasswordComponent, SignUpComponent, UpdatePasswordComponent],
})
export class ExternalPagesModule { }