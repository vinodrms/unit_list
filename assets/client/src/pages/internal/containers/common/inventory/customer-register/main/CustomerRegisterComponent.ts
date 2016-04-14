import {Component, Output, EventEmitter} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {CustomerRegisterTableMetaBuilderService} from './services/CustomerRegisterTableMetaBuilderService';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';

@Component({
    selector: 'customer-register',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/main/template/customer-register.html',
    providers: [CustomerRegisterTableMetaBuilderService],
    directives: [LazyLoadingTableComponent]
})
export class CustomerRegisterComponent extends BaseComponent {
    @Output() protected onScreenStateTypeChanged = new EventEmitter();


    constructor(private _appContext: AppContext,
        private _tableBuilder: CustomerRegisterTableMetaBuilderService) {
        super();
    }

}