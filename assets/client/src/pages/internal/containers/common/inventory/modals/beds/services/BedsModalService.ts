import {Injectable, Injector, provide} from 'angular2/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {BedsModalComponent} from '../BedsModalComponent';
import {BedDO} from '../../../../../../services/beds/data-objects/BedDO';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {BedsModalInput} from './utils/BedsModalInput';

@Injectable()
export class BedsModalService {

	constructor(private _appContext: AppContext) { }

	public openAllBedsModal(bedVMList: BedVM[]): Promise<ModalDialogInstance<BedVM>> {
        var bedsModalInput = new BedsModalInput();
        bedsModalInput.bedVMList = bedVMList;
		return this._appContext.modalService.open<any>(<any>BedsModalComponent, Injector.resolve([ 
            provide(BedsModalInput, {useValue: bedsModalInput})
        ]));
	}
}