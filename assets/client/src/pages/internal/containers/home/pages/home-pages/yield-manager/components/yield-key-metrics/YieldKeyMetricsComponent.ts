import { Component, OnInit } from '@angular/core';
import {LazyLoadingTableComponent} from '../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';

import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe'

@Component({
	selector: 'yield-key-metrics',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-key-metrics/template/yield-key-metrics.html',
	directives : [LazyLoadingTableComponent]
})
export class YieldKeyMetricsComponent implements OnInit {
	constructor() { }

	ngOnInit() { }

}