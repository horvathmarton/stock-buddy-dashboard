import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'sb-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, AfterViewInit {
  public readonly chartOptions: any = {
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
  public height: number = 400;

  @Input()
  public width: number = 400;

  @Input()
  public data!: Record<string, number>;

  @ViewChild('chart')
  public chart!: ChartComponent;

  public ngOnInit(): void {
    this.chartOptions.chart.height = this.height;
    this.chartOptions.chart.width = this.width;

    this.chartOptions.title = {
      text: this.title,
      align: 'center',
    };
  }

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
