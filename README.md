# Data Insights Dashboard

A dynamic, interactive data visualization web application built using vanilla HTML, CSS, and JavaScript. This project converts raw, complex datasets into clean, actionable visual intelligence through a responsive dashboard layout featuring interactive filtering, multi-metric charts, and performance breakdown matrices.

---

## Features

### Dynamic Visualizations
* **Trend Analysis:** Line and area charts tracking performance over configurable historical timeframes.
* **Composition Breakdown:** Donut and pie distributions detailing segment shares, category weights, and resource allocations.
* **Comparative Analytics:** Horizontal and vertical bar structures to benchmark performance indicators side-by-side.

### Interactive Controls & Filtering
* **Global Date Adjustments:** Instantly pivot visuals across standard intervals (e.g., last 7 days, 30 days, or custom parameters).
* **Segment Isolation:** Filter entire dashboard layouts by specific attributes like regions, product tiers, or demographic metrics.
* **Dynamic Search:** Live-query structural data tables to drill down into specific transaction rows without refreshing the view.

### Metric Performance Matrices
* **KPI Snapshot Blocks:** High-level metric summary cards reflecting aggregate volume totals, percentage deltas, and run-rate goals.
* **Conditional Data Grids:** Data lists emphasizing outliers, targets met, or critical thresholds using structural visual flags.

### Pure Client-Side Architecture
* Zero heavy backend installations required—runs natively in modern web browsers by parsing serialized client data arrays or localized JSON targets.

---

## Project Structure

The codebase relies on standard frontend architecture:

```text
├── index.html     # Application structures, grid-containers, and semantic modal viewframes
├── app.js         # Chart configurations, state filters, and data manipulation handlers
└── styles.css     # Dashboard layouts, sidebar controls, canvas containers, and theme variables
