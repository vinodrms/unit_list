import {Component, Input, ElementRef, AfterViewInit, Inject} from '@angular/core';
import {ChartComponentSubsetDO} from './data-objects/ChartComponentSubsetDO';
import {ChartComponentDO} from './data-objects/ChartComponentDO';

declare var echarts: any;

@Component({
    selector: 'chart-component',
    template:
    `   
        <div id="{{chartHtmlIdName}}" style="height:350px;"></div>
    `
})
export class ChartComponent implements AfterViewInit {
    private static Subset1Color = "#fb6708";
    private static Subset2Color = "#36ce8d";
    private chartHtmlIdName = "chart-component-id";
    private static MaxCharsOnTitleFirstRow = 22;

    private _htmlElement: HTMLElement;

    @Input() chartDetails: ChartComponentDO;

    constructor( @Inject(ElementRef) elementRef: ElementRef) {
        this._htmlElement = elementRef.nativeElement;
    }

    ngAfterViewInit() {
        this.generateChart();
    }

    private generateChart() {
        var chart = this.initChart();
        chart.setOption({
            // title: this.getChartOptionTitle(this.chartDetails),
            tooltip: { trigger: 'axis' },
            legend: this.getChartLegend(this.chartDetails),
            toolbox: { show: false },
            calculable: false,
            xAxis: this.getChartXAxis(this.chartDetails),
            yAxis: [{ type: 'value' }],
            series: [
                this.getChartSeriesFor(this.chartDetails.subset1, ChartComponent.Subset1Color),
                this.getChartSeriesFor(this.chartDetails.subset2, ChartComponent.Subset2Color)
            ]
        });
    }
    private initChart(): any {
        var htmlElement = this.getChartHtmlElement();
        return echarts.init(htmlElement);
    }
    private getChartHtmlElement(): any {
        return document.getElementById(this.chartHtmlIdName);
    }
    private getChartOptionTitle(chatDO: ChartComponentDO): Object {
        return {
            text: (chatDO.title.length > ChartComponent.MaxCharsOnTitleFirstRow) ? (chatDO.title.substr(0, ChartComponent.MaxCharsOnTitleFirstRow) + "\n" + chatDO.title.substr(ChartComponent.MaxCharsOnTitleFirstRow)) : chatDO.title,
            subtext: chatDO.subtitle
        };
    }
    private getChartLegend(chatDO: ChartComponentDO): Object {
        return {
            data: [chatDO.subset1.name, chatDO.subset2.name]
        };
    }
    private getChartXAxis(chatDO: ChartComponentDO): Object {
        return [
            {
                type: 'category',
                data: chatDO.xAxisLabels
            }
        ];
    }
    private getChartSeriesFor(chatSubset: ChartComponentSubsetDO, colorName: string): Object {
        return {
            name: chatSubset.name,
            type: 'bar',
            data: chatSubset.data,
            itemStyle: { normal: { color: colorName } },
            markPoint: {
                data: [
                    {
                        type: 'max',
                        name: chatSubset.maxLabel
                    },
                    {
                        type: 'min',
                        name: chatSubset.minLabel
                    }
                ]
            },
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: chatSubset.avgLabel
                    }
                ]
            }
        }
    }
}