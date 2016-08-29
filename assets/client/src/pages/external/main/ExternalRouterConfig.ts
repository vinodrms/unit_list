import {Routes, RouterModule} from '@angular/router';
import {LogInComponent} from '../pages/log-in/LogInComponent';
import {ResetPasswordComponent} from '../pages/reset-password/ResetPasswordComponent';
import {UpdatePasswordComponent} from '../pages/update-password/UpdatePasswordComponent';
import {SignUpComponent} from '../pages/sign-up/SignUpComponent';

export const ExternalRouterModules = [
	LogInComponent,
	ResetPasswordComponent,
	UpdatePasswordComponent,
	SignUpComponent
]

const externalRoutes: Routes = [
	{ path: '', component: LogInComponent },
	{ path: 'login/:loginStatusCode', component: LogInComponent },
	{ path: 'reset', component: ResetPasswordComponent },
	{ path: 'update-password/:activationCode/:email', component: UpdatePasswordComponent },
	{ path: 'sign-up', component: SignUpComponent },
	{ path: '**', redirectTo: "" }
];
export const ExternalRouting = RouterModule.forRoot(externalRoutes);