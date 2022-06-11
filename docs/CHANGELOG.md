# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Change password flow.
- Version info section to profile view.
- Watchlist details view.
- Create and edit watchlist flow.
- Add and remove items from a watchlist flow.
- Add editor to add targets to watchlist items.
- Add `roic_since_inception` and `total_floating_pnl` KPIs to the dashboard.
- Cash view.
- Add cash, forex and stock transaction flow.
- Show next target information on the watchlist table.
- Show help message on empty views.

## [1.1.0] - 2022-04-19

### Added

- Portfolio create and edit flow.
- Stock transaction create flow.
- Asset allocation strategy create flow.
- Select target asset allocation strategy flow.

### Fixed

- Sidebar is closed when the user logs out.
- Display the proper annualized PnL values in the portfolio view.

### Changes

- Consume the unified snake_case API format.
- Modify layout to fit better on smaller screens.

## [1.0.1] - 2022-03-27

### Fixed

- The view streams don't break on the first empty event.
- Point to the correct API during staging build.

## [1.0.0] - 2022-03-26

### Added

- Setup project structure and basic devops utilities.
- Login flow.
- Portfolio summary and details view.
- Dashboard view with strategy and portfolio indicators.
