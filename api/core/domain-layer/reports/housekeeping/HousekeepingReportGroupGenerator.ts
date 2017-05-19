import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { ArrivalsReportSectionGeneratorStrategy } from "./strategies/ArrivalsReportSectionGeneratorStrategy";
import { DeparturesReportSectionGeneratorStrategy } from "./strategies/DeparturesReportSectionGeneratorStrategy";
import { StayoversReportSectionGeneratorStrategy } from "./strategies/StayoversReportSectionGeneratorStrategy";
import { ThError } from "../../../utils/th-responses/ThError";
import { RoomSearchResultRepoDO } from "../../../data-layer/rooms/repositories/IRoomRepository";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";

enum HousekeepingReportGroupByType {
    NOTHING,
    FLOOR
};

export class HousekeepingReportGroupGenerator extends AReportGeneratorStrategy {

    private _groupBy: HousekeepingReportGroupByType = HousekeepingReportGroupByType.NOTHING;
    private _floors: number[];
    
    protected getParamsValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([]);
    }
    protected loadParameters(params: any) {
        this._groupBy = params.groupBy;
     }

    protected getMeta(): ReportGroupMeta {
        return {
			name: "Housekeeping Report",
			pageOrientation: PageOrientation.Landscape
		}
    }
    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        if (this._groupBy == HousekeepingReportGroupByType.NOTHING) {
            return [
                new ArrivalsReportSectionGeneratorStrategy(this._appContext, this._sessionContext, this._globalSummary),
                new StayoversReportSectionGeneratorStrategy(this._appContext, this._sessionContext, this._globalSummary),
                new DeparturesReportSectionGeneratorStrategy(this._appContext, this._sessionContext, this._globalSummary),
            ];
        } else {
            var strategies = [];
            _.forEach(this._floors, (floor: number) => {
                strategies.push(
                    new ArrivalsReportSectionGeneratorStrategy(this._appContext, this._sessionContext, this._globalSummary, floor),
                    new StayoversReportSectionGeneratorStrategy(this._appContext, this._sessionContext, this._globalSummary, floor),
                    new DeparturesReportSectionGeneratorStrategy(this._appContext, this._sessionContext, this._globalSummary, floor));
            });
            return strategies;
        }
    }

    protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        if (this._groupBy == HousekeepingReportGroupByType.NOTHING) {
            resolve(true);
            return;
        }
        let floors: number[] = [];
        let roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        roomRepository.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id }).then((roomSearchResult: RoomSearchResultRepoDO) => {
            _.forEach(roomSearchResult.roomList, ((roomDO: RoomDO) =>{
                floors.push(roomDO.floor);
            }));
            floors = _.unique(floors);
            this._floors = floors;
            resolve(true);
        }).catch((error: any) => {
            reject(error);
        });
    }

}