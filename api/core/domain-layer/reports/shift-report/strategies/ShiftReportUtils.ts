import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';

export class ShiftReportUtils {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext){
	}

	public invoicePaidInTimeFrame(invoice:InvoiceDO, startTime, endTime){
		return (invoice.paidDateTimeUtcTimestamp >= startTime && invoice.paidDateTimeUtcTimestamp < endTime);
	}

	public preetyPrintInvoice(invoice: InvoiceDO){
		let itemsSummary = [];
		invoice.itemList.forEach((item) => {
			itemsSummary.push({
				name: item.meta.getDisplayName(this._appContext.thTranslate),
				units: item.meta.getNumberOfItems()
			})
		});

		let summaryObject = {
			items: itemsSummary,
			time: invoice.paidDateTimeUtcTimestamp
		};

		console.log(JSON.stringify(summaryObject, null, 2));
	}
}