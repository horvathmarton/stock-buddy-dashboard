import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChartComponent, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'sb-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, AfterViewInit {
  public readonly chartOptions: ApexOptions = {
    series: [],
    chart: {
      height: 350,
      width: 500,
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
  public title!: string;

  @Input()
  public data!: Record<string, number>;

  @Input()
  public filterZeroes = false;

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
      .filter(({ y }) => !(this.filterZeroes && y === 0))
      .sort((a, b) => b.y - a.y);

    this.chart.series = [{ data: transformedData }];
  }
}
