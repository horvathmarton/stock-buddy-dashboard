import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Strategy, StrategyItem } from '../../interfaces';
import { StrategiesService } from '../../services';
import { StrategiesQuery } from '../../state';

@Component({
  templateUrl: './strategy-selector-dialog.component.html',
  styleUrls: ['./strategy-selector-dialog.component.scss'],
})
export class StrategySelectorDialogComponent implements OnInit {
  public readonly displayedColumns = ['name'];
  public readonly isLoading = this.strategiesQuery.selectLoading();
  public readonly error = this.strategiesQuery.selectError();
  public readonly strategies = this.strategiesQuery.strategies;

  constructor(
    private readonly dialogRef: MatDialogRef<StrategySelectorDialogComponent>,
    private readonly strategiesService: StrategiesService,
    private readonly strategiesQuery: StrategiesQuery
  ) {}

  public ngOnInit(): void {
    // We need to make this async to avoid Angular change detection issue.
    void Promise.resolve().then(() => this.strategiesService.list());
  }

  public save(strategy: Strategy): void {
    this.dialogRef.close(strategy);
  }

  public transformItems(items: StrategyItem[]): Record<string, number> {
    return items.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.name] = curr.size;

      return acc;
    }, {});
  }
}
