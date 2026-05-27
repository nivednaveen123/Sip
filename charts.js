/**
 * Chart.js Orchestration
 * Optimized for minimal redraws and high framerates.
 */

let projectionChartInstance = null;

function initChart() {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    
    // Fintech dark theme settings
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    projectionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Portfolio Value',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    pointHitRadius: 10,
                    tension: 0.1
                },
                {
                    label: 'Capital Invested',
                    data: [],
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    pointHitRadius: 10,
                    tension: 0.1
                },
                {
                    label: 'Inflation Adj. Value',
                    data: [],
                    borderColor: '#8b5cf6',
                    borderWidth: 1.5,
                    fill: false,
                    pointRadius: 0,
                    pointHitRadius: 10,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Critical for performance during slider drag
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(21, 26, 34, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#2a3140',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: { boxWidth: 12, usePointStyle: true }
                }
            },
            scales: {
                x: {
                    grid: { color: '#2a3140', drawBorder: false },
                    title: { display: true, text: 'Years from Today' }
                },
                y: {
                    grid: { color: '#2a3140', drawBorder: false },
                    ticks: {
                        callback: function(value) {
                            return formatCompactCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function updateChart(simulationData) {
    if (!projectionChartInstance) return;

    const labels = simulationData.timelineData.map(d => `Year ${d.year}`);
    const corpusData = simulationData.timelineData.map(d => d.corpus);
    const investedData = simulationData.timelineData.map(d => d.invested);
    const realData = simulationData.timelineData.map(d => d.realValue);

    projectionChartInstance.data.labels = labels;
    projectionChartInstance.data.datasets[0].data = corpusData;
    projectionChartInstance.data.datasets[1].data = investedData;
    projectionChartInstance.data.datasets[2].data = realData;

    // Use fast rendering mechanism
    projectionChartInstance.update('none'); 
}
