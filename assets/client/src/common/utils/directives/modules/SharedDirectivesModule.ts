import {NgModule} from '@angular/core';
import {CustomScroll} from '../CustomScroll';

const SharedDirectives = [
    CustomScroll
];
@NgModule({
    declarations: [SharedDirectives],
    exports: [SharedDirectives]
})
export class SharedDirectivesModule { }