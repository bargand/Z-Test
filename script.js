document.addEventListener('DOMContentLoaded', function() {
    const testTypeSelect = document.getElementById('testType');
    const inputForm = document.getElementById('inputForm');
    const zTestForm = document.getElementById('zTestForm');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('resultContent');
    const calculateBtn = document.getElementById('calculateBtn');
    const newTestBtn = document.getElementById('newTestBtn');
    const nullHypothesis = document.getElementById('nullHypothesis');
    const altHypothesis = document.getElementById('altHypothesis');
    const tailType = document.getElementById('tailType');
    const significanceLevel = document.getElementById('significanceLevel');

    // Show appropriate input form based on test type selection
    testTypeSelect.addEventListener('change', function() {
        if (this.value) {
            inputForm.classList.remove('hidden');
            generateInputFields(this.value);
            updateHypothesisText(this.value);
        } else {
            inputForm.classList.add('hidden');
        }
        resultsDiv.classList.add('hidden');
    });

    // Generate input fields based on test type
    function generateInputFields(testType) {
        zTestForm.innerHTML = '';
        
        if (testType === 'oneSample') {
            zTestForm.innerHTML = `
                <div class="form-group">
                    <label for="sampleMean">Sample Mean (x̄)</label>
                    <input type="number" id="sampleMean" step="any" required>
                </div>
                <div class="form-group">
                    <label for="popMean">Population Mean (μ)</label>
                    <input type="number" id="popMean" step="any" required>
                </div>
                <div class="form-group">
                    <label for="popStdDev">Population Standard Deviation (σ)</label>
                    <input type="number" id="popStdDev" step="any" required>
                </div>
                <div class="form-group">
                    <label for="sampleSize">Sample Size (n)</label>
                    <input type="number" id="sampleSize" min="1" required>
                </div>
            `;
        } else if (testType === 'twoSample') {
            zTestForm.innerHTML = `
                <div class="form-group">
                    <label for="sampleMean1">Sample 1 Mean (x̄₁)</label>
                    <input type="number" id="sampleMean1" step="any" required>
                </div>
                <div class="form-group">
                    <label for="sampleMean2">Sample 2 Mean (x̄₂)</label>
                    <input type="number" id="sampleMean2" step="any" required>
                </div>
                <div class="form-group">
                    <label for="popStdDev1">Population 1 Standard Deviation (σ₁)</label>
                    <input type="number" id="popStdDev1" step="any" required>
                </div>
                <div class="form-group">
                    <label for="popStdDev2">Population 2 Standard Deviation (σ₂)</label>
                    <input type="number" id="popStdDev2" step="any" required>
                </div>
                <div class="form-group">
                    <label for="sampleSize1">Sample 1 Size (n₁)</label>
                    <input type="number" id="sampleSize1" min="1" required>
                </div>
                <div class="form-group">
                    <label for="sampleSize2">Sample 2 Size (n₂)</label>
                    <input type="number" id="sampleSize2" min="1" required>
                </div>
            `;
        } else if (testType === 'proportion') {
            zTestForm.innerHTML = `
                <div class="form-group">
                    <label for="sampleProp">Sample Proportion (p̂)</label>
                    <input type="number" id="sampleProp" min="0" max="1" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="popProp">Population Proportion (p₀)</label>
                    <input type="number" id="popProp" min="0" max="1" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="propSampleSize">Sample Size (n)</label>
                    <input type="number" id="propSampleSize" min="1" required>
                </div>
            `;
        }
    }

    // Update hypothesis text based on test type
    function updateHypothesisText(testType) {
        if (testType === 'oneSample') {
            nullHypothesis.textContent = "μ = μ₀ (population mean equals hypothesized value)";
            altHypothesis.textContent = "μ ≠ μ₀ (population mean differs from hypothesized value)";
        } else if (testType === 'twoSample') {
            nullHypothesis.textContent = "μ₁ = μ₂ (population means are equal)";
            altHypothesis.textContent = "μ₁ ≠ μ₂ (population means are not equal)";
        } else if (testType === 'proportion') {
            nullHypothesis.textContent = "p = p₀ (population proportion equals hypothesized value)";
            altHypothesis.textContent = "p ≠ p₀ (population proportion differs from hypothesized value)";
        }
    }

    // Update alternative hypothesis based on tail type
    tailType.addEventListener('change', function() {
        const testType = testTypeSelect.value;
        if (!testType) return;
        
        if (testType === 'oneSample') {
            if (this.value === 'leftTailed') {
                altHypothesis.textContent = "μ < μ₀ (population mean is less than hypothesized value)";
            } else if (this.value === 'rightTailed') {
                altHypothesis.textContent = "μ > μ₀ (population mean is greater than hypothesized value)";
            } else {
                altHypothesis.textContent = "μ ≠ μ₀ (population mean differs from hypothesized value)";
            }
        } else if (testType === 'twoSample') {
            if (this.value === 'leftTailed') {
                altHypothesis.textContent = "μ₁ < μ₂ (population 1 mean is less than population 2 mean)";
            } else if (this.value === 'rightTailed') {
                altHypothesis.textContent = "μ₁ > μ₂ (population 1 mean is greater than population 2 mean)";
            } else {
                altHypothesis.textContent = "μ₁ ≠ μ₂ (population means are not equal)";
            }
        } else if (testType === 'proportion') {
            if (this.value === 'leftTailed') {
                altHypothesis.textContent = "p < p₀ (population proportion is less than hypothesized value)";
            } else if (this.value === 'rightTailed') {
                altHypothesis.textContent = "p > p₀ (population proportion is greater than hypothesized value)";
            } else {
                altHypothesis.textContent = "p ≠ p₀ (population proportion differs from hypothesized value)";
            }
        }
    });

    // Calculate Z-test when button is clicked
    calculateBtn.addEventListener('click', function() {
        const testType = testTypeSelect.value;
        const alpha = parseFloat(significanceLevel.value);
        const tail = tailType.value;
        
        let zScore, pValue;
        
        try {
            if (testType === 'oneSample') {
                const sampleMean = parseFloat(document.getElementById('sampleMean').value);
                const popMean = parseFloat(document.getElementById('popMean').value);
                const popStdDev = parseFloat(document.getElementById('popStdDev').value);
                const sampleSize = parseInt(document.getElementById('sampleSize').value);
                
                zScore = (sampleMean - popMean) / (popStdDev / Math.sqrt(sampleSize));
            } 
            else if (testType === 'twoSample') {
                const sampleMean1 = parseFloat(document.getElementById('sampleMean1').value);
                const sampleMean2 = parseFloat(document.getElementById('sampleMean2').value);
                const popStdDev1 = parseFloat(document.getElementById('popStdDev1').value);
                const popStdDev2 = parseFloat(document.getElementById('popStdDev2').value);
                const sampleSize1 = parseInt(document.getElementById('sampleSize1').value);
                const sampleSize2 = parseInt(document.getElementById('sampleSize2').value);
                
                const stdError = Math.sqrt(
                    (Math.pow(popStdDev1, 2) / sampleSize1) + 
                    (Math.pow(popStdDev2, 2) / sampleSize2)
                );
                
                zScore = (sampleMean1 - sampleMean2) / stdError;
            } 
            else if (testType === 'proportion') {
                const sampleProp = parseFloat(document.getElementById('sampleProp').value);
                const popProp = parseFloat(document.getElementById('popProp').value);
                const sampleSize = parseInt(document.getElementById('propSampleSize').value);
                
                const stdError = Math.sqrt(
                    (popProp * (1 - popProp)) / sampleSize
                );
                
                zScore = (sampleProp - popProp) / stdError;
            }
            
            // Calculate p-value based on tail type
            pValue = calculatePValue(zScore, tail);
            
            // Determine if result is significant
            const isSignificant = pValue < alpha;
            
            // Get critical value
            const criticalValue = getCriticalValue(alpha, tail);
            
            // Display results
            displayResults(zScore, pValue, alpha, isSignificant, criticalValue, tail);
            
            // Show results section
            resultsDiv.classList.remove('hidden');
        } catch (error) {
            alert("Error in calculation: " + error.message);
        }
    });

    // Calculate p-value based on z-score and tail type
    function calculatePValue(zScore, tail) {
        // Standard normal cumulative distribution function
        const cdf = (z) => {
            return 0.5 * (1 + erf(z / Math.sqrt(2)));
        };
        
        // Error function approximation
        function erf(x) {
            // Save the sign of x
            const sign = (x >= 0) ? 1 : -1;
            x = Math.abs(x);
            
            // Constants
            const a1 =  0.254829592;
            const a2 = -0.284496736;
            const a3 =  1.421413741;
            const a4 = -1.453152027;
            const a5 =  1.061405429;
            const p  =  0.3275911;
            
            // A&S formula 7.1.26
            const t = 1.0 / (1.0 + p * x);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
            
            return sign * y;
        }
        
        if (tail === 'leftTailed') {
            return cdf(zScore);
        } else if (tail === 'rightTailed') {
            return 1 - cdf(zScore);
        } else { // two-tailed
            return 2 * (1 - cdf(Math.abs(zScore)));
        }
    }

    // Get critical value based on alpha and tail type
    function getCriticalValue(alpha, tail) {
        // Inverse standard normal cumulative distribution function
        const probit = (p) => {
            if (p <= 0 || p >= 1) {
                throw new Error("Probability must be between 0 and 1");
            }
            
            // Coefficients in rational approximations
            const a = [-3.969683028665376e+01,  2.209460984245205e+02,
                       -2.759285104469687e+02,  1.383577518672690e+02,
                       -3.066479806614716e+01,  2.506628277459239e+00];
            
            const b = [-5.447609879822406e+01,  1.615858368580409e+02,
                       -1.556989798598866e+02,  6.680131188771972e+01,
                       -1.328068155288572e+01];
            
            const c = [-7.784894002430293e-03, -3.223964580411365e-01,
                       -2.400758277161838e+00, -2.549732539343734e+00,
                       4.374664141464968e+00,  2.938163982698783e+00];
            
            const d = [7.784695709041462e-03, 3.224671290700398e-01,
                       2.445134137142996e+00,  3.754408661907416e+00];
            
            // Define break-points
            const plow = 0.02425;
            const phigh = 1 - plow;
            
            let q, r;
            
            if (p < plow) {
                // Rational approximation for lower region
                q = Math.sqrt(-2 * Math.log(p));
                return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5] /
                       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            } else if (p <= phigh) {
                // Rational approximation for central region
                q = p - 0.5;
                r = q * q;
                return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5] * q /
                       (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
            } else {
                // Rational approximation for upper region
                q = Math.sqrt(-2 * Math.log(1 - p));
                return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5] /
                       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            }
        };
        
        if (tail === 'leftTailed') {
            return probit(alpha);
        } else if (tail === 'rightTailed') {
            return probit(1 - alpha);
        } else { // two-tailed
            return Math.abs(probit(alpha / 2));
        }
    }

    // Display results
    function displayResults(zScore, pValue, alpha, isSignificant, criticalValue, tail) {
        const testType = testTypeSelect.value;
        let testName = '';
        
        if (testType === 'oneSample') {
            testName = 'One-Sample Z-Test';
        } else if (testType === 'twoSample') {
            testName = 'Two-Sample Z-Test';
        } else if (testType === 'proportion') {
            testName = 'Z-Test for Proportions';
        }
        
        let comparison;
        if (tail === 'leftTailed') {
            comparison = `Z < ${criticalValue.toFixed(4)}`;
        } else if (tail === 'rightTailed') {
            comparison = `Z > ${criticalValue.toFixed(4)}`;
        } else {
            comparison = `|Z| > ${criticalValue.toFixed(4)}`;
        }
        
        resultContent.innerHTML = `
            <div class="result-item">
                <strong>Test Performed:</strong> ${testName}
            </div>
            <div class="result-item">
                <strong>Z-Score:</strong> ${zScore.toFixed(4)}
            </div>
            <div class="result-item">
                <strong>p-value:</strong> ${pValue.toFixed(6)}
            </div>
            <div class="result-item">
                <strong>Significance Level (α):</strong> ${alpha}
            </div>
            <div class="result-item">
                <strong>Critical Value:</strong> ${comparison}
            </div>
            <div class="result-item ${isSignificant ? 'significant' : 'not-significant'}">
                <strong>Conclusion:</strong> ${isSignificant ? 
                    'Reject the null hypothesis (H₀). The result is statistically significant.' : 
                    'Fail to reject the null hypothesis (H₀). The result is not statistically significant.'}
            </div>
            <div class="critical-value">
                <strong>Interpretation:</strong> 
                <p>A ${tail === 'twoTailed' ? 'two-tailed' : tail === 'leftTailed' ? 'left-tailed' : 'right-tailed'} 
                test was performed at α = ${alpha} level of significance.</p>
                <p>The calculated p-value (${pValue.toFixed(6)}) is ${pValue < alpha ? 'less' : 'greater'} than α.</p>
            </div>`
    }

    // Reset for new test
    newTestBtn.addEventListener('click', function() {
        resultsDiv.classList.add('hidden');
        inputForm.classList.add('hidden');
        testTypeSelect.value = '';
        zTestForm.reset();
    });
});