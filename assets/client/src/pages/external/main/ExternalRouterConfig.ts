import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from '../pages/log-in/LogInComponent';
import { ResetPasswordComponent } from '../pages/reset-password/ResetPasswordComponent';
import { UpdatePasswordComponent } from '../pages/update-password/UpdatePasswordComponent';
import { SignUpComponent } from '../pages/sign-up/SignUpComponent';
import { AccountWasCreatedComponent } from '../pages/account-was-created/AccountWasCreatedComponent';

const externalRoutes: Routes = [
	{ path: '', component: LogInComponent },
	{ path: 'login/:loginStatusCode', component: LogInComponent },
	{ path: 'reset', component: ResetPasswordComponent },
	{ path: 'update-password/:activationCode/:email', component: UpdatePasswordComponent },
	{ path: 'sign-up', component: SignUpComponent },
	{ path: 'signed-up', component: AccountWasCreatedComponent },
	{ path: '**', redirectTo: "" }
];
export const ExternalRouting = RouterModule.forRoot(externalRoutes);