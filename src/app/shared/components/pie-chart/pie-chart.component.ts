import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'sb-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, AfterViewInit {
  public readonly chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'pie',
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
  };

  @Input()
  public title!: string;

  @Input()
  public height = 400;

  @Input()
  public width = 400;

  @Input()
  public data!: Record<string, number>;

  @ViewChild('chart')
  public chart!: ChartComponent;

  public ngOnInit(): void {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    this.chartOptions.chart!.height = this.height;
    this.chartOptions.chart!.width = this.width;
    /* eslint-enable */

    this.chartOptions.title = {
      text: this.title,
      align: 'center',
    };
  }

  public ngAfterViewInit(): void {
    const transformedData = Object.entries(this.data)
      .map(([key, value]) => ({ x: key, y: value }))
      .sort((a, b) => a.y - b.y);

    const labels = transformedData.map((a) => a.x);
    const series = transformedData.map((a) => a.y);

    this.chart.series = series;
    this.chart.labels = labels;
  }
}
