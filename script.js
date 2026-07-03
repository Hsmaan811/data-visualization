const DataStore = {
  deathCauses: [
    { cause: "Cardiovascular Diseases", icd10: "I00-I99", deaths: 17800000, percentage: 31.2, trend: "decreasing" },
    { cause: "Cancers", icd10: "C00-D49", deaths: 9600000, percentage: 16.8, trend: "increasing" },
    { cause: "Respiratory Diseases", icd10: "J00-J99", deaths: 3900000, percentage: 6.8, trend: "stable" },
    { cause: "Lower Respiratory Infections", icd10: "J09-J22", deaths: 2600000, percentage: 4.6, trend: "decreasing" },
    { cause: "Neonatal Conditions", icd10: "P00-P96", deaths: 2400000, percentage: 4.2, trend: "decreasing" },
    { cause: "Diabetes Mellitus", icd10: "E10-E14", deaths: 2000000, percentage: 3.5, trend: "increasing" },
    { cause: "Alzheimer's Disease", icd10: "G30", deaths: 1800000, percentage: 3.2, trend: "increasing" },
    { cause: "Diarrheal Diseases", icd10: "A00-A09", deaths: 1500000, percentage: 2.6, trend: "decreasing" },
    { cause: "Road Traffic Accidents", icd10: "V01-V89", deaths: 1350000, percentage: 2.4, trend: "stable" },
    { cause: "Liver Disease", icd10: "K70-K77", deaths: 1200000, percentage: 2.1, trend: "increasing" }
  ],

  trendData: {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    cardiovascular: [18500, 18200, 18000, 17900, 17800],
    cancer: [8800, 9000, 9200, 9400, 9600],
    respiratory: [4200, 4100, 4000, 3950, 3900],
    accidents: [1400, 1380, 1360, 1355, 1350]
  },

  regionData: {
    labels: ['Africa', 'Americas', 'Europe', 'Eastern Med.', 'South-East Asia', 'Western Pacific'],
    values: [8200, 6500, 4800, 3200, 8900, 7500],
    colors: ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899']
  },

  statsConfig: [
    { 
      title: "Total Annual Deaths", 
      key: "totalDeaths", 
      icon: "fa-skull",
      format: "number" 
    },
    { 
      title: "Leading Cause", 
      key: "leadingCause", 
      icon: "fa-heart-broken",
      format: "text" 
    },
    { 
      title: "Preventable Deaths", 
      key: "preventableDeaths", 
      icon: "fa-shield-virus",
      format: "number" 
    },
    { 
      title: "Mortality Rate", 
      key: "mortalityRate", 
      icon: "fa-chart-line",
      format: "decimal" 
    }
  ],

  getStats() {
    const totalDeaths = this.deathCauses.reduce((acc, c) => acc + c.deaths, 0);
    const leadingCause = this.deathCauses[0].cause;
    const preventableDeaths = Math.round(totalDeaths * 0.45);
    const mortalityRate = 7.8;

    return {
      totalDeaths,
      leadingCause,
      preventableDeaths,
      mortalityRate
    };
  },

  getDeathCauses() {
    return [...this.deathCauses];
  }
};

class DashboardApp {
  constructor() {
    this.charts = {};
    this.data = DataStore;
    this.init();
  }

  init() {
    this.setCurrentDate();
    this.renderStats();
    this.renderTable();
    this.initializeCharts();
    this.setupEventListeners();
  }

  setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
      dateElement.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  renderStats() {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    const stats = this.data.getStats();
    const config = this.data.statsConfig;

    container.innerHTML = config.map(item => {
      let value = stats[item.key];
      
      if (item.format === 'number') {
        value = value.toLocaleString();
      } else if (item.format === 'decimal') {
        value = `${value} per 1,000`;
      }
      
      return `
        <div class="stat-card">
          <div class="stat-info">
            <h3>${item.title}</h3>
            <div class="stat-number">${value}</div>
          </div>
          <i class="fas ${item.icon} stat-icon"></i>
        </div>
      `;
    }).join('');
  }

  renderTable() {
    const tbody = document.querySelector('#reportTable tbody');
    if (!tbody) return;

    const causes = this.data.getDeathCauses();
    
    tbody.innerHTML = causes.map(c => `
      <tr>
        <td><strong>${c.cause}</strong></td>
        <td>${c.icd10}</td>
        <td>${c.deaths.toLocaleString()}</td>
        <td>${c.percentage}%</td>
        <td>
          <span class="badge ${c.trend}">
            ${c.trend.charAt(0).toUpperCase() + c.trend.slice(1)}
          </span>
        </td>
      </tr>
    `).join('');
  }

  initializeCharts() {
    this.createBarChart();
    this.createPieChart();
    this.createTrendChart();
    this.createRegionChart();
  }

  createBarChart() {
    const ctx = document.getElementById('causesBarChart')?.getContext('2d');
    if (!ctx) return;

    if (this.charts.bar) this.charts.bar.destroy();

    const topCauses = this.data.deathCauses.slice(0, 6);
    
    this.charts.bar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topCauses.map(c => c.cause.split(' ')[0]),
        datasets: [{
          label: 'Deaths (millions)',
          data: topCauses.map(c => c.deaths / 1000000),
          backgroundColor: [
            '#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899'
          ],
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.parsed.y.toFixed(1)}M deaths`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Deaths (millions)' }
          }
        }
      }
    });
  }

  createPieChart() {
    const ctx = document.getElementById('mortalityPieChart')?.getContext('2d');
    if (!ctx) return;

    if (this.charts.pie) this.charts.pie.destroy();

    const topCauses = this.data.deathCauses.slice(0, 5);
    const others = this.data.deathCauses.slice(5).reduce((acc, c) => acc + c.percentage, 0);
    
    const labels = [...topCauses.map(c => c.cause), 'Other Causes'];
    const data = [...topCauses.map(c => c.percentage), Math.round(others * 10) / 10];
    
    this.charts.pie = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#94a3b8'
          ],
          borderWidth: 2,
          borderColor: 'white'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: { padding: 15, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    });
  }

  createTrendChart() {
    const ctx = document.getElementById('trendLineChart')?.getContext('2d');
    if (!ctx) return;

    if (this.charts.trend) this.charts.trend.destroy();

    const trendData = this.data.trendData;
    
    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: 'Cardiovascular',
            data: trendData.cardiovascular,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Cancer',
            data: trendData.cancer,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Respiratory',
            data: trendData.respiratory,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${(context.parsed.y/1000).toFixed(1)}K`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Deaths (thousands)' }
          }
        }
      }
    });
  }

  createRegionChart() {
    const ctx = document.getElementById('regionChart')?.getContext('2d');
    if (!ctx) return;

    if (this.charts.region) this.charts.region.destroy();

    const regionData = this.data.regionData;
    
    this.charts.region = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: regionData.labels,
        datasets: [{
          data: regionData.values,
          backgroundColor: regionData.colors.map(c => c + '99'),
          borderColor: regionData.colors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: { padding: 15 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${(context.parsed/1000).toFixed(1)}K deaths`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: { display: false }
          }
        }
      }
    });
  }

  exportToCSV() {
    const causes = this.data.getDeathCauses();
    const headers = ['Cause of Death', 'ICD-10 Code', 'Annual Deaths', 'Percentage', 'Trend'];
    const rows = causes.map(c => [
      c.cause,
      c.icd10,
      c.deaths,
      `${c.percentage}%`,
      c.trend
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, `mortality_data_${this.getFormattedDate()}.csv`, 'text/csv;charset=utf-8');
  }

  exportToExcel() {
    const causes = this.data.getDeathCauses();
    
    let tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <thead>
            <tr>
              <th>Cause of Death</th>
              <th>ICD-10 Code</th>
              <th>Annual Deaths</th>
              <th>Percentage</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    causes.forEach(c => {
      tableHTML += `
        <tr>
          <td>${c.cause}</td>
          <td>${c.icd10}</td>
          <td>${c.deaths}</td>
          <td>${c.percentage}%</td>
          <td>${c.trend}</td>
        </tr>
      `;
    });
    
    tableHTML += '</tbody></table></body></html>';
    
    this.downloadFile(tableHTML, `mortality_report_${this.getFormattedDate()}.xls`, 'application/vnd.ms-excel');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getFormattedDate() {
    return new Date().toISOString().slice(0, 10);
  }

  setupEventListeners() {
    document.getElementById('exportCSVBtn')?.addEventListener('click', () => this.exportToCSV());
    document.getElementById('exportExcelBtn')?.addEventListener('click', () => this.exportToExcel());
    document.getElementById('exportSideBtn')?.addEventListener('click', () => this.exportToCSV());

    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.addEventListener('click', (e) => {
        this.handleNavigation(item);
      });
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.initializeCharts(), 250);
    });
  }

  handleNavigation(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DashboardApp();
});