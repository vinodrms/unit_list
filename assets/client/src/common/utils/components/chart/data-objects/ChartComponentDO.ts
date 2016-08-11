import {ChartComponentSubsetDO} from './ChartComponentSubsetDO';

export class ChartComponentDO {
    title: string;
    subtitle: string;
    xAxisLabels: string[];
    subset1: ChartComponentSubsetDO;
    subset2: ChartComponentSubsetDO;
}