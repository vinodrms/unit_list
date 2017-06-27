import { IRevenueForDate } from "./IRevenueForDate";

export enum RevenueSegment {
    BusinessIndividual,
    BusinessGroup,
    LeisureIndividual,
    LeisureGroup,
    All,
    
}

export interface ISegmentedRevenueForDate {
    segment: RevenueSegment;
    revenue: IRevenueForDate;    
}