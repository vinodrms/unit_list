import { NgModule } from '@angular/core';
import { CustomScroll } from '../CustomScroll';
import { ThClickableDirective } from '../ThClickable';

const SharedDirectives = [
    CustomScroll,
    ThClickableDirective,
];
@NgModule({
    declarations: [SharedDirectives],
    exports: [SharedDirectives]
})
export class SharedDirectivesModule { }
