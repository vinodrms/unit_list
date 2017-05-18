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
                new ArrivalsReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
                new StayoversReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
                new DeparturesReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
            ];
        } else {
            var strategies = [];
            var isFirstArrivalsSection = true;
            var isFirstDeparturesSection = true;
            var isFirstStayoversSection = true;

            _.forEach(this._floors, (floor: number) => {
                strategies.push(
                    new ArrivalsReportSectionGeneratorStrategy(this._appContext, this._sessionContext, !isFirstArrivalsSection, floor),
                    new StayoversReportSectionGeneratorStrategy(this._appContext, this._sessionContext, !isFirstStayoversSection, floor),
                    new DeparturesReportSectionGeneratorStrategy(this._appContext, this._sessionContext, !isFirstDeparturesSection, floor));
                isFirstArrivalsSection = false;
                isFirstStayoversSection = false;
                isFirstDeparturesSection = false;
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