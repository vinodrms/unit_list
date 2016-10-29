import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';

import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';

export class ShiftReportUtils {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext){
	}

	public invoicePaidInTimeFrame(invoice:InvoiceDO, startTime:ThTimestampDO, endTime:ThTimestampDO){
		return (invoice.paidDateTimeUtcTimestamp >= startTime.getUtcTimestamp() && invoice.paidDateTimeUtcTimestamp < endTime.getUtcTimestamp());
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