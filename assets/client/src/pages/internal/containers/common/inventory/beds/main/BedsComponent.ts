import {Component, ViewChild, AfterViewInit, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {BedVM} from '../../../../../services/beds/view-models/BedVM';
import {BedTableMetaBuilderService} from './services/BedTableMetaBuilderService';
@Component({
    selector: 'beds',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/beds/main/template/beds.html',
    providers: [],
    directives: []
})
export class BedsComponent implements BaseComponent {
    
    @ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<BedVM>;
    
    constructor() { }

    ngOnInit() { }

}