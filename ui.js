/**
 * UI & Scenario Management
 */

const presets = {
    base: { cagr: 8.5, inflation: 3.0, withdrawAmt: 8000 },
    conservative: { cagr: 6.0, inflation: 4.0, withdrawAmt: 6000 },
    aggressive: { cagr: 11.0, inflation: 2.5, withdrawAmt: 12000 }
};

function getParams() {
    return {
        initial: parseFloat(document.getElementById('lump-num').value) || 0,
        sip: parseFloat(document.getElementById('sip-num').value) || 0,
        investYears: parseInt(document.getElementById('years-num').value) || 0,
        cagr: parseFloat(document.getElementById('cagr-num').value) || 0,
        inflation: parseFloat(document.getElementById('inflation-num').value) || 0,
        withdrawYears: parseInt(document.getElementById('withdraw-years-num').value) || 0,
        withdrawAmt: parseFloat(document.getElementById('withdraw-amt-num').value) || 0
    };
}

function setScenario(type, triggerCalculation) {
    const data = presets[type];
    if(!data) return;

    document.getElementById('cagr-num').value = data.cagr;
    document.getElementById('cagr-slider').value = data.cagr;
    document.getElementById('inflation-num').value = data.inflation;
    document.getElementById('inflation-slider').value = data.inflation;
    document.getElementById('withdraw-amt-num').value = data.withdrawAmt;
    document.getElementById('withdraw-amt-slider').value = data.withdrawAmt;

    document.querySelectorAll('.scenario-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-scenario="${type}"]`).classList.add('active');

    triggerCalculation();
}

function updateDashboardCards(results) {
    requestAnimationFrame(() => {
        // Render KPIs
        document.getElementById('kpi-peak-value').innerText = formatCurrency(results.peakCorpus);
        document.getElementById('kpi-peak-year').innerText = `Accumulation Phase (Yr ${results.peakYear})`;
        document.getElementById('kpi-invested').innerText = formatCurrency(results.totalInvested);
        document.getElementById('kpi-real-value').innerText = formatCurrency(results.peakRealValue);

        // Render Status
        const depEl = document.getElementById('kpi-depletion');
        const depSub = document.getElementById('kpi-depletion-sub');

        if (results.isDepleted) {
            depEl.innerText = `Fails Yr ${results.depletionYear}`;
            depEl.className = 'kpi-value status-alert';
            depSub.innerText = 'Capital depleted';
        } else {
            depEl.innerText = 'Sustainable';
            depEl.className = 'kpi-value status-safe';
            depSub.innerText = 'Survives timeline';
        }

        // Render Intelligence
        const banner = document.getElementById('insight-banner');
        const bannerText = document.getElementById('insight-text');
        
        banner.className = `intelligence-banner ${results.insight.type}`;
        bannerText.innerText = results.insight.text;
    });
}
