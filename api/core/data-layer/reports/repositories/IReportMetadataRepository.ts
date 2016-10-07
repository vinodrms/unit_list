import {ReportMetadataDO, ReportType} from '../data-objects/ReportMetadataDO';

export interface IReportMetadataRepository {
    getAllReportMetadata(): Promise<ReportMetadataDO[]>;
    getReportMetadata(type: ReportType): Promise<ReportMetadataDO>;
}