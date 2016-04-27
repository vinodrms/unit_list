import {Injectable, ReflectiveInjector, provide} from 'angular2/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {BedsModalComponent} from '../BedsModalComponent';
import {BedDO} from '../../../../../../services/beds/data-objects/BedDO';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {BedSelectionVM} from './utils/BedSelectionVM'; 
import {BedsModalInput} from './utils/BedsModalInput';

@Injectable()
export class BedsModalService {

	constructor(private _appContext: AppContext) { }

	public openAllBedsModal(availableBedVMList: BedVM[], selectedBedVMList: BedVM[], minNoOfBeds: number, maxNoOfBeds: number): Promise<ModalDialogInstance<BedVM[]>> {
        var bedsModalInput = new BedsModalInput();
        bedsModalInput.availableBedVMList = availableBedVMList;
        bedsModalInput.selectedBedVMList = selectedBedVMList;
        bedsModalInput.minNoOfBeds = minNoOfBeds;
        bedsModalInput.maxNoOfBeds = maxNoOfBeds;
		return this._appContext.modalService.open<any>(<any>BedsModalComponent, ReflectiveInjector.resolve([ 
            provide(BedsModalInput, {useValue: bedsModalInput})
        ]));
	}
}