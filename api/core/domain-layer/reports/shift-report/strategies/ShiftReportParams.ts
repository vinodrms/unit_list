import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';

export interface ShiftReportParams {
    dateInterval: ThDateIntervalDO;
    startTime: ThTimestampDO;
    endTime: ThTimestampDO;
}