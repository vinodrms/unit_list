import { ThError } from "../../../utils/th-responses/ThError";
import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { NumberInListValidationRule } from "../../../utils/th-validation/rules/NumberInListValidationRule";
import { BookingDOConstraints } from "../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingConfirmationStatus, BookingConfirmationStatusDisplayString } from "../../../data-layer/bookings/data-objects/BookingDO";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { ReportSection } from "../common/result/ReportSection";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { BookingsReportSectionGenerator } from "./BookingsReportSectionGenerator";
import { PriceProductDO } from "../../../data-layer/price-products/data-objects/PriceProductDO";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";

import _ = require("underscore");

export class BookingsReportGroupGenerator extends AReportGeneratorStrategy {
    private _priceProductIdList: string[];
    private _priceProductList: PriceProductDO[];
    private _confirmationStatusList: BookingConfirmationStatus[];
    private _startDate: ThDateDO;
    private _endDate: ThDateDO;
    private _bookingCreationStartDate: ThDateDO;
    private _bookingCreationEndDate: ThDateDO;


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
                key: "confirmationStatusList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new NumberInListValidationRule(BookingDOConstraints.ConfirmationStatuses_All)))
            },
            {
                key: "priceProductIdList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
            },
        ]);
    }

    protected loadParameters(params: any) {
        this._priceProductIdList = params.priceProductIdList;
        this._confirmationStatusList = params.confirmationStatusList;
        this._startDate = new ThDateDO();
        this._startDate.buildFromObject(params.startDate);
        this._endDate = new ThDateDO();
        this._endDate.buildFromObject(params.endDate);
        this.loadOptionalParameters(params);
    }

    private loadOptionalParameters(params: any) {
        if (params.bookingCreationStartDate) {
            var date: ThDateDO = new ThDateDO();
            date.buildFromObject(params.bookingCreationStartDate);
            if (date.isValid()) {
                this._bookingCreationStartDate = date;
            }
        }
        if (params.bookingCreationEndDate) {
            date = new ThDateDO();
            date.buildFromObject(params.bookingCreationEndDate);
            if (date.isValid()) {
                this._bookingCreationEndDate = date;
            }
        }
    }

    protected getMeta(): ReportGroupMeta {
        var startDateKey: string = this._appContext.thTranslate.translate("Start Date");
        var endDateKey: string = this._appContext.thTranslate.translate("End Date");        
        var priceProductListKey: string = this._appContext.thTranslate.translate("Price Products");
        var bookingStatusesKey: string = this._appContext.thTranslate.translate("Booking Statuses");
        var displayParams = {};
        displayParams[startDateKey] = this._startDate;
        displayParams[endDateKey] = this._endDate;
        displayParams[priceProductListKey] = "";
        this._priceProductList.forEach((pp, index) => {
            displayParams[priceProductListKey] += pp.name;
            displayParams[priceProductListKey] += (index != (this._priceProductList.length -1)) ? ", ": "";
        });
        displayParams[bookingStatusesKey] = "";
        this._confirmationStatusList.forEach((bookingStatus, index) => {
            displayParams[bookingStatusesKey] += BookingConfirmationStatusDisplayString[bookingStatus];
            displayParams[bookingStatusesKey] += (index != (this._confirmationStatusList.length -1)) ? ", ": "";
        });

        if (this._bookingCreationStartDate) {
            var bookingCreationStartDateKey = this._appContext.thTranslate.translate("Booking Created From");
            displayParams[bookingCreationStartDateKey] = this._bookingCreationStartDate;
        }
        if (this._bookingCreationEndDate) {
            var bookingCreationEndDateKey = this._appContext.thTranslate.translate("Booking Created Until");
            displayParams[bookingCreationEndDateKey] = this._bookingCreationEndDate;
        }
        return {
            name: "Bookings Report",
            pageOrientation: PageOrientation.Landscape,
            displayParams: displayParams
        }
    }

    protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        let ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
        ppRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {priceProductIdList: this._priceProductIdList})
            .then(ppList => {
                this._priceProductList = ppList.priceProductList;
                resolve(true);
            }).catch(e => {
                reject(e);
            })
    }

    private orderPriceProductListByName() {
        this._priceProductList = _.sortBy(this._priceProductList, 'name');
    }

    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        this.orderPriceProductListByName();
        var sectionGenerators: BookingsReportSectionGenerator[] = [];
        _.forEach(this._priceProductList, (pp: PriceProductDO) => {
            sectionGenerators.push( (this._bookingCreationStartDate && this._bookingCreationEndDate) ?
            new BookingsReportSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, pp, this._confirmationStatusList, this._startDate, this._endDate, this._bookingCreationStartDate, this._bookingCreationEndDate)
            : new BookingsReportSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, pp, this._confirmationStatusList, this._startDate, this._endDate));
        });
        return sectionGenerators;
    }
}