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
				"Amount (fee included)",
				"Amount (without fee)",
				"Transaction fee"
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
			var totalAmountWithoutFee = 0;
			var totalAmountWithFee = 0;
			var totalFees = 0;

			var data: any[] = [];
			Object.keys(mpmDetailsDict).forEach((pMethod) => {
				let pmName = pmIdToNameMap[pMethod];
				let transactions = mpmDetailsDict[pMethod].transactions;

				let amountWithoutFee = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[pMethod].amountWithoutFee);
				let amountWithFee = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[pMethod].amountWithFee);
				let fee = this._thUtils.roundNumberToTwoDecimals(amountWithFee - amountWithoutFee);
				
				let row = [pmName, transactions, amountWithFee, amountWithoutFee, fee];

				totalTransaction += transactions;
				totalAmountWithoutFee += amountWithoutFee;
				totalAmountWithFee += amountWithFee;
				totalFees += fee;

				data.push(row);
			});
			totalAmountWithoutFee = this._thUtils.roundNumberToTwoDecimals(totalAmountWithoutFee);
			totalAmountWithFee = this._thUtils.roundNumberToTwoDecimals(totalAmountWithFee);
			totalFees = this._thUtils.roundNumberToTwoDecimals(totalFees);
			
			data.push([this._appContext.thTranslate.translate('Total'), totalTransaction, totalAmountWithFee, totalAmountWithoutFee, totalFees]);
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
				let pPriceWithFeesIncluded = ipayer.priceToPayPlusTransactionFee;
				if (!dic[pMethod]) {
					dic[pMethod] = {
						transactions: 1,
						amountWithoutFee: pPrice,
						amountWithFee: pPriceWithFeesIncluded
					}
				}
				else {
					dic[pMethod].transactions++;
					dic[pMethod].amountWithoutFee += pPrice;
					dic[pMethod].amountWithFee += pPriceWithFeesIncluded;
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