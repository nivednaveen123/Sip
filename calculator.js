/**
 * Financial Engine
 * Fixed: Strict mathematical formulas and an intelligence layer.
 */

function runFinancialSimulation(params) {
    const { initial, sip, cagr, inflation, investYears, withdrawYears, withdrawAmt } = params;

    let corpus = initial;
    let totalInvested = initial;
    
    // Rates
    const monthlyRate = Math.pow(1 + (cagr / 100), 1 / 12) - 1;
    const inflationRate = inflation / 100;
    
    let timelineData = [];
    let isDepleted = false;
    let depletionYear = null;
    let peakCorpus = corpus;
    
    const totalYears = investYears + withdrawYears;

    for (let year = 1; year <= totalYears; year++) {
        let isWithdrawalPhase = year > investYears;

        if (!isWithdrawalPhase) {
            // Accumulation
            for (let m = 0; m < 12; m++) {
                corpus += sip;
                totalInvested += sip;
                corpus *= (1 + monthlyRate);
            }
        } else {
            // Distribution (Monthly withdrawal correctly aligned)
            for (let m = 0; m < 12; m++) {
                corpus -= withdrawAmt;
                if (corpus < 0) {
                    corpus = 0;
                    if (!isDepleted) {
                        isDepleted = true;
                        depletionYear = year;
                    }
                    break;
                }
                corpus *= (1 + monthlyRate); 
            }
        }

        // FIXED: Correct inflation discounting formula -> Present Value = Future Value / (1+r)^t
        let realValue = corpus / Math.pow(1 + inflationRate, year);

        if (corpus > peakCorpus) peakCorpus = corpus;

        timelineData.push({
            year,
            corpus: Math.max(0, corpus),
            invested: totalInvested,
            realValue: Math.max(0, realValue),
            phase: isWithdrawalPhase ? 'Distribution' : 'Accumulation'
        });
    }

    // Intelligence Generation
    const terminalData = timelineData[timelineData.length - 1];
    let insight = {};

    if (isDepleted) {
        let shortfallYrs = totalYears - depletionYear;
        insight.type = 'warning';
        insight.text = `Critical Risk: Strategy breaks down in Year ${depletionYear}. You face a ${shortfallYrs}-year capital shortfall during retirement under current inflation assumptions.`;
    } else {
        let cushion = (terminalData.corpus / peakCorpus) * 100;
        if (cushion > 50) {
            insight.type = 'success';
            insight.text = `High Confidence: Portfolio absorbs withdrawals efficiently, leaving a legacy of ${formatCompactCurrency(terminalData.corpus)} (Nominal) at end of projection.`;
        } else {
            insight.type = 'neutral';
            insight.text = `Moderate Confidence: Plan survives until end of period, but capital is decaying. Terminal real value is heavily eroded by inflation.`;
        }
    }

    return {
        timelineData,
        isDepleted,
        depletionYear,
        peakCorpus,
        peakYear: investYears,
        totalInvested,
        peakRealValue: timelineData[investYears - 1]?.realValue || 0,
        insight
    };
}
