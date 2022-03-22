import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'sb-treemap-chart',
  templateUrl: './treemap-chart.component.html',
  styleUrls: ['./treemap-chart.component.scss'],
})
export class TreemapChartComponent implements OnInit, AfterViewInit {
  public readonly chartOptions: ApexOptions = {
    series: [],
    legend: {
      show: false,
    },
    chart: {
      height: 350,
      width: 500,
      type: 'treemap',
      toolbar: {
        show: false,
      },
    },
    colors: [
      '#3B93A5',
      '#F7B844',
      '#ADD8C7',
      '#EC3C65',
      '#CDD7B6',
      '#C1F666',
      '#D43F97',
      '#1E5D8C',
      '#421243',
      '#7F94B0',
      '#EF6537',
      '#C0ADDB',
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
  };

  @Input()
  public title!: string;

  @Input()
  public data!: Record<string, number>;

  @ViewChild('chart')
  public chart!: ChartComponent;

  public ngOnInit(): void {
    this.chartOptions.title = {
      text: this.title,
      align: 'center',
    };
  }

  public ngAfterViewInit(): void {
    const transformedData = Object.entries(this.data)
      .map(([key, value]) => ({ x: key, y: value }))
      .sort((a, b) => b.y - a.y);

    this.chart.series = [{ data: transformedData }];
  }
}
