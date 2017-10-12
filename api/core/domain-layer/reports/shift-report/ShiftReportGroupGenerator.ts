import _ = require("underscore");
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThError } from '../../../utils/th-responses/ThError';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { BookingValidationStructures } from '../../bookings/validators/BookingValidationStructures';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { ShiftReportParams } from './ShiftReportParams';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { AddOnProductLoader, AddOnProductItemContainer } from '../../add-on-products/validators/AddOnProductLoader';
import { ShiftReportByPaymentMethodSectionGenerator } from './strategies/ShiftReportByPaymentMethodSectionGenerator';
import { ShiftReportByCategorySectionGenerator } from './strategies/ShiftReportByCategorySectionGenerator';
import { ShiftReportByAopNameSectionGenerator } from './strategies/ShiftReportByAopNameSectionGenerator';
import { ShiftReportPaidInvoicesSectionGenerator } from './strategies/ShiftReportPaidInvoicesSectionGenerator';
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ShiftReportPaidByAgreementSectionGenerator } from "./strategies/ShiftReportPaidByAgreementSectionGenerator";
import { ShiftReportLossAcceptedByManagementInvoicesSectionGenerator } from "./strategies/ShiftReportLossAcceptedByManagementInvoicesSectionGenerator";
import { InvoiceDO } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceSearchResultRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceRepository";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";

export class ShiftReportGroupGenerator extends AReportGeneratorStrategy {
    private _shiftReportParams: ShiftReportParams;
    private _allInvoiceList: InvoiceDO[];
    private _paidInvoiceList: InvoiceDO[];
    private _lossAcceptedByManagementInvoiceList: InvoiceDO[];
    private _aopContainer: AddOnProductItemContainer;
    private _hotel: HotelDO;

    protected getParamsValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "startDate",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "endDate",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "startDateTime",
                validationStruct: BookingValidationStructures.getThHourDOValidationStructure()
            },
            {
                key: "endDateTime",
                validationStruct: BookingValidationStructures.getThHourDOValidationStructure()
            }
        ]);
    }

    protected loadParameters(params: any) {
        var startDate = new ThDateDO();
        startDate.buildFromObject(params.startDate);
        var endDate = new ThDateDO();
        endDate.buildFromObject(params.endDate);

        let startHour = new ThHourDO();
        startHour.buildFromObject(params.startDateTime);
        let endHour = new ThHourDO();
        endHour.buildFromObject(params.endDateTime);

        this._shiftReportParams = {
            dateInterval: ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate),
            startTime: ThTimestampDO.buildThTimestampDO(startDate, startHour),
            endTime: ThTimestampDO.buildThTimestampDO(endDate, endHour)
        }
    }

    protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {

        let hotelRepo = this._appContext.getRepositoryFactory().getHotelRepository();
        hotelRepo.getHotelById(this._sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
            this._hotel = hotel;
            let invoiceRepository = this._appContext.getRepositoryFactory().getInvoiceRepository();
            let igMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
            let searchCriteria = {
                paidInterval: this._shiftReportParams.dateInterval
            };
            return invoiceRepository.getInvoiceList(igMeta, searchCriteria)
        }).then((result: InvoiceSearchResultRepoDO) => {
            let startTimestamp = this._shiftReportParams.startTime.getTimestamp(this._hotel.timezone);
            let endTimestamp = this._shiftReportParams.endTime.getTimestamp(this._hotel.timezone);
            let invoiceList = _.filter(result.invoiceList, (invoice: InvoiceDO) => {
                return invoice.paidTimestamp >= startTimestamp && invoice.paidTimestamp <= endTimestamp;
            });
            this._allInvoiceList = invoiceList;
            this._paidInvoiceList = _.filter(invoiceList, (invoice: InvoiceDO) => {
                return invoice.isPaid();
            });
            this._lossAcceptedByManagementInvoiceList = _.filter(invoiceList, (invoice: InvoiceDO) => {
                return invoice.isLossAcceptedByManagement();
            });

            let aopLoader = new AddOnProductLoader(this._appContext, this._sessionContext);
            return aopLoader.loadAll();
        }).then((aopContainer: AddOnProductItemContainer) => {
            this._aopContainer = aopContainer;
            resolve(true);
        }).catch((e) => {
            reject(e);
        });
    }

    protected getMeta(): ReportGroupMeta {
        var startNameKey: string = this._appContext.thTranslate.translate("Start Time");
        var endNameKey: string = this._appContext.thTranslate.translate("End Time");
        var displayParams = {};
        displayParams[startNameKey] = this._shiftReportParams.startTime;
        displayParams[endNameKey] = this._shiftReportParams.endTime;
        return {
            name: "Shift Report",
            displayParams: displayParams
        }
    }
    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        return [
            new ShiftReportByPaymentMethodSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceList),
            new ShiftReportPaidByAgreementSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceList),
            new ShiftReportPaidInvoicesSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._allInvoiceList, this._paidInvoiceList, this._hotel),
            new ShiftReportByCategorySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceList, this._aopContainer, {
                title: "Transactions Grouped by Category"
            }),
            new ShiftReportByAopNameSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceList),
            new ShiftReportByCategorySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._lossAcceptedByManagementInvoiceList, this._aopContainer, {
                title: "Loss Accepted By Management Transactions Grouped by Category"
            }),
            new ShiftReportLossAcceptedByManagementInvoicesSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._allInvoiceList,
                this._lossAcceptedByManagementInvoiceList, this._hotel),

        ];
    }
}
