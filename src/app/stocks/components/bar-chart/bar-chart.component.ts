import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'sb-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit {
  public readonly chartOptions: any = {
    series: [],
    chart: {
      height: 350,
      width: 800,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          ranges: [
            {
              from: -100,
              to: 0,
              color: '#F15B46',
            },
          ],
        },
      },
    },
  };

  @Input()
  public data!: Record<string, number>;

  @ViewChild('chart')
  public chart!: ChartComponent;

  public ngAfterViewInit(): void {
    const transformedData = Object.entries(this.data)
      .map(([key, value]: any) => ({
        x: key,
        y: value,
      }))
      .sort((a, b) => b.y - a.y);

    this.chart.series = [{ data: transformedData }];
  }
}
