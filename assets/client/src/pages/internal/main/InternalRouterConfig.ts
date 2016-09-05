import {Routes, RouterModule} from '@angular/router';
import {WizardModule} from '../containers/wizard/WizardModule';

const internalRoutes: Routes = [
    { path: 'wizard', loadChildren: () => WizardModule },
];
export const InternalRouting = RouterModule.forRoot(internalRoutes);