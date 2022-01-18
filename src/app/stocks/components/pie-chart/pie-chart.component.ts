import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'sb-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit {
  public readonly chartOptions: any = {
    series: [],
    chart: {
      type: 'pie',
      height: 400,
      width: 400,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
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
      .sort((a, b) => a.y - b.y);

    const labels = transformedData.map((a) => a.x);
    const series = transformedData.map((a) => a.y);

    this.chart.series = series;
    this.chart.labels = labels;
  }
}
