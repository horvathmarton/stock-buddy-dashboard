import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  SimpleChanges,
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
      selection: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
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

  @Input()
  public animate = true;

  @Input()
  public live = false;

  @ViewChild('chart', { static: true })
  public chart!: ChartComponent;

  public ngOnInit(): void {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    this.chartOptions.chart!.height = this.height;
    this.chartOptions.chart!.width = this.width;
    this.chartOptions.chart!.animations = {
      enabled: this.animate,
    };
    /* eslint-enable */

    this.chartOptions.title = {
      text: this.title,
      align: 'center',
    };
  }

  public ngAfterViewInit(): void {
    const { labels, series } = this.transformData(this.data);

    this.chart.series = series;
    this.chart.labels = labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.live && changes?.data?.currentValue) {
      const { series } = this.transformData(
        changes.data.currentValue as Record<string, number>
      );

      this.chartOptions.series = series;
    }
  }

  private transformData(data: Record<string, number>): {
    labels: string[];
    series: number[];
  } {
    const transformedData = Object.entries(data)
      .map(([key, value]) => ({ x: key, y: value }))
      .sort((a, b) => a.y - b.y);

    return {
      labels: transformedData.map((a) => a.x),
      series: transformedData.map((a) => a.y),
    };
  }
}
