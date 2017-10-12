import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {InvoiceSelectionModalInput} from './utils/InvoiceSelectionModalInput';
import {InvoiceSelectionModalComponent} from '../InvoiceSelectionModalComponent';
import { InvoiceSelectionModalModule } from '../InvoiceSelectionModalModule';
import { InvoiceDO } from "../../../../../../services/invoices/data-objects/InvoiceDO";

@Injectable()
export class InvoiceSelectionModalService {
	constructor(private _appContext: AppContext) { }

	public openInvoiceSelectionModal(multiSelection: boolean, onlyUnpaidInvoices: boolean, excludedInvoiceId?: string): Promise<ModalDialogRef<InvoiceDO[]>> {
		var invoiceSelectionModalInput = new InvoiceSelectionModalInput();
		invoiceSelectionModalInput.multiSelection = multiSelection;
		invoiceSelectionModalInput.onlyUnpaidInvoices = onlyUnpaidInvoices;
		if (excludedInvoiceId) {
			invoiceSelectionModalInput.excludedInvoiceId = excludedInvoiceId;
		}

		return this._appContext.modalService.open<any>(InvoiceSelectionModalModule, InvoiceSelectionModalComponent, ReflectiveInjector.resolve([
			{ provide: InvoiceSelectionModalInput, useValue: invoiceSelectionModalInput }
		]));
	}
}