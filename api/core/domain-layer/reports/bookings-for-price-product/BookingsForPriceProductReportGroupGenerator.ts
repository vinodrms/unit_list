import { ThError } from "../../../utils/th-responses/ThError";
import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { NumberInListValidationRule } from "../../../utils/th-validation/rules/NumberInListValidationRule";
import { BookingDOConstraints } from "../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingConfirmationStatus } from "../../../data-layer/bookings/data-objects/BookingDO";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { ReportSection } from "../common/result/ReportSection";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { BookingsForPriceProductReportSectionGenerator } from "./BookingsForPriceProductReportSectionGenerator";
import { PriceProductDO } from "../../../data-layer/price-products/data-objects/PriceProductDO";

export class BookingsForPriceProductReportGroupGenerator extends AReportGeneratorStrategy {
    private _priceProductId: string;
    private _priceProduct: PriceProductDO;
    private _confirmationStatusList: BookingConfirmationStatus[];

    protected getParamsValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "priceProductId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "confirmationStatusList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new NumberInListValidationRule(BookingDOConstraints.ConfirmationStatuses_All)))
            }
        ]);
    }

    protected loadParameters(params: any) {
        this._priceProductId = params.priceProductId;
        this._confirmationStatusList = params.confirmationStatusList;
    }

    protected getMeta(): ReportGroupMeta {
        return {
            name: "Reservations Booked for Price Product"
        }
    }

    protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        let ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
        ppRepo.getPriceProductById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._priceProductId)
            .then(pp => {
                this._priceProduct = pp;
                resolve(true);
            }).catch(e => {
                reject(e);
            })
    }

    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        return [
            new BookingsForPriceProductReportSectionGenerator(this._appContext, this._sessionContext,
                this._priceProduct, this._confirmationStatusList)
        ];
    }
}