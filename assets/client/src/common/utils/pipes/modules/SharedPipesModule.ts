import {NgModule} from '@angular/core';
import {PercentagePipe} from '../PercentagePipe';
import {PricePipe} from '../PricePipe';
import {ThDateIntervalPipe} from '../ThDateIntervalPipe';
import {ThDatePipe} from '../ThDatePipe';
import {ThHourPipe} from '../ThHourPipe';
import {ThLongDateIntervalPipe} from '../ThLongDateIntervalPipe';
import {ThTimestampDistanceFromNowPipe} from '../ThTimestampDistanceFromNowPipe';
import {ThTimestampPipe} from '../ThTimestampPipe';
import {ThTrimPipe} from '../ThTrimPipe';
import {TranslationPipe} from '../../localization/TranslationPipe';

const SharedPipes = [
    PercentagePipe,
    PricePipe,
    ThDateIntervalPipe,
    ThDatePipe,
    ThHourPipe,
    ThLongDateIntervalPipe,
    ThTimestampDistanceFromNowPipe,
    ThTimestampPipe,
    ThTrimPipe,
    TranslationPipe
];
@NgModule({
    declarations: [SharedPipes],
    exports: [SharedPipes]
})
export class SharedPipesModule { }