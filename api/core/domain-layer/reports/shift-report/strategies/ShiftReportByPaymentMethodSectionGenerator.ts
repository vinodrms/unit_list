import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { InvoiceDO } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import { InvoicePaymentMethodType } from '../../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';

export class ShiftReportByPaymentMethodSectionGenerator extends AReportSectionGeneratorStrategy {

	constructor(appContext: AppContext, sessionContext: SessionContext,
		private _paidInvoiceGroupList: InvoiceGroupDO[]) {
		super(appContext, sessionContext);
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Payment method",
				"Transactions",
				"Amount"
			]
		};
	}

	protected getMeta(): ReportSectionMeta {
		return {
			title: "Transactions Grouped by Payment Method"
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		this.createPaymentMethodIdToNameMap().then((pmIdToNameMap) => {
			let mpmDetailsDict = this.getPaymentMethodsDetailsDict();
			var totalTransaction = 0;
			var totalAmount = 0;
			var data: any[] = [];
			Object.keys(mpmDetailsDict).forEach((pMethod) => {
				let pmName = pmIdToNameMap[pMethod];
				let transactions = mpmDetailsDict[pMethod].transactions;

				let amount = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[pMethod].amount);
				let row = [pmName, transactions, amount];

				totalTransaction += transactions;
				totalAmount += amount;

				data.push(row);
			});
			totalAmount = this._thUtils.roundNumberToTwoDecimals(totalAmount);
			data.push([this._appContext.thTranslate.translate('Total'), totalTransaction, totalAmount]);
			resolve(data);
		}).catch((e) => { reject(e) });
	}

	private createPaymentMethodIdToNameMap(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
			settingsRepository.getPaymentMethods().then((paymentMethodL) => {
				let pmIdToNameMap = {}
				paymentMethodL.forEach((pm) => { pmIdToNameMap[pm.id] = this._appContext.thTranslate.translate(pm.name) });
				pmIdToNameMap[InvoicePaymentMethodType.PayInvoiceByAgreement + ""] = this._appContext.thTranslate.translate("Paid By Agreement");
				resolve(pmIdToNameMap);
			});
		});
	}

	private getPaymentMethodsDetailsDict(): Object {
		let dic = {};
		this._paidInvoiceGroupList.forEach((ig) => {
			let ipayerL = this.getAggregatedPaidPayerList(ig);
			ipayerL.forEach((ipayer: InvoicePayerDO) => {
				let pMethod = ipayer.paymentMethod.value;
				if (ipayer.paymentMethod.type == InvoicePaymentMethodType.PayInvoiceByAgreement) {
					pMethod = InvoicePaymentMethodType.PayInvoiceByAgreement + "";
				}
				let pPrice = ipayer.priceToPay;
				if (!dic[pMethod]) {
					dic[pMethod] = {
						transactions: 1,
						amount: pPrice
					}
				}
				else {
					dic[pMethod].transactions++;
					dic[pMethod].amount += pPrice;
				}
			})
		});
		return dic;
	}

	private getAggregatedPaidPayerList(ig: InvoiceGroupDO) {
		return _.reduce(ig.invoiceList, (result, invoice: InvoiceDO) => {
			return _.union(result, invoice.payerList);
		}, []);
	}
}