document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
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
    const confidenceLevel = document.getElementById('confidenceLevel');

    // Constants
    const TEST_TYPES = {
        ONE_SAMPLE: 'oneSample',
        TWO_SAMPLE: 'twoSample',
        PROPORTION_ONE: 'proportionOne',
        PROPORTION_TWO: 'proportionTwo',
        CI_SINGLE_MEAN: 'ciSingleMean',
        CI_TWO_MEANS: 'ciTwoMeans',
        CI_SINGLE_PROPORTION: 'ciSingleProportion',
        CI_TWO_PROPORTIONS: 'ciTwoProportions'
    };

    const TAIL_TYPES = {
        TWO_TAILED: 'twoTailed',
        LEFT_TAILED: 'leftTailed',
        RIGHT_TAILED: 'rightTailed'
    };

    // Initialize the application
    function init() {
        setupEventListeners();
    }

    // Set up all event listeners
    function setupEventListeners() {
        testTypeSelect.addEventListener('change', handleTestTypeChange);
        tailType.addEventListener('change', updateHypothesisText);
        calculateBtn.addEventListener('click', handleCalculateClick);
        newTestBtn.addEventListener('click', resetCalculator);
    }

    // Handle test type selection change
    function handleTestTypeChange() {
        const selectedTest = testTypeSelect.value;
        
        if (selectedTest) {
            inputForm.classList.remove('hidden');
            generateInputFields(selectedTest);
            updateHypothesisText();
            
            // Show/hide appropriate sections
            const isConfidenceInterval = selectedTest.startsWith('ci');
            document.getElementById('hypothesisSection').classList.toggle('hidden', isConfidenceInterval);
            document.getElementById('confidenceSection').classList.toggle('hidden', !isConfidenceInterval);
        } else {
            inputForm.classList.add('hidden');
        }
        
        resultsDiv.classList.add('hidden');
    }

    // Generate input fields based on selected test type
    function generateInputFields(testType) {
        zTestForm.innerHTML = '';
        
        switch (testType) {
            case TEST_TYPES.ONE_SAMPLE:
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
                        <input type="number" id="popStdDev" min="0.0001" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="sampleSize">Sample Size (n)</label>
                        <input type="number" id="sampleSize" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.TWO_SAMPLE:
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
                        <input type="number" id="popStdDev1" min="0.0001" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="popStdDev2">Population 2 Standard Deviation (σ₂)</label>
                        <input type="number" id="popStdDev2" min="0.0001" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="sampleSize1">Sample 1 Size (n₁)</label>
                        <input type="number" id="sampleSize1" min="2" required>
                    </div>
                    <div class="form-group">
                        <label for="sampleSize2">Sample 2 Size (n₂)</label>
                        <input type="number" id="sampleSize2" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.PROPORTION_ONE:
                zTestForm.innerHTML = `
                    <div class="form-group">
                        <label for="sampleProp">Sample Proportion (p̂)</label>
                        <input type="number" id="sampleProp" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="popProp">Population Proportion (p₀)</label>
                        <input type="number" id="popProp" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="propSampleSize">Sample Size (n)</label>
                        <input type="number" id="propSampleSize" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.PROPORTION_TWO:
                zTestForm.innerHTML = `
                    <div class="form-group">
                        <label for="sampleProp1">Sample 1 Proportion (p̂₁)</label>
                        <input type="number" id="sampleProp1" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="sampleProp2">Sample 2 Proportion (p̂₂)</label>
                        <input type="number" id="sampleProp2" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="propSampleSize1">Sample 1 Size (n₁)</label>
                        <input type="number" id="propSampleSize1" min="2" required>
                    </div>
                    <div class="form-group">
                        <label for="propSampleSize2">Sample 2 Size (n₂)</label>
                        <input type="number" id="propSampleSize2" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.CI_SINGLE_MEAN:
                zTestForm.innerHTML = `
                    <div class="form-group">
                        <label for="ciSampleMean">Sample Mean (x̄)</label>
                        <input type="number" id="ciSampleMean" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="ciPopStdDev">Population Standard Deviation (σ)</label>
                        <input type="number" id="ciPopStdDev" min="0.0001" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="ciSampleSize">Sample Size (n)</label>
                        <input type="number" id="ciSampleSize" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.CI_TWO_MEANS:
                zTestForm.innerHTML = `
                    <div class="form-group">
                        <label for="ciSampleMean1">Sample 1 Mean (x̄₁)</label>
                        <input type="number" id="ciSampleMean1" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="ciSampleMean2">Sample 2 Mean (x̄₂)</label>
                        <input type="number" id="ciSampleMean2" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="ciPopStdDev1">Population 1 Standard Deviation (σ₁)</label>
                        <input type="number" id="ciPopStdDev1" min="0.0001" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="ciPopStdDev2">Population 2 Standard Deviation (σ₂)</label>
                        <input type="number" id="ciPopStdDev2" min="0.0001" step="any" required>
                    </div>
                    <div class="form-group">
                        <label for="ciSampleSize1">Sample 1 Size (n₁)</label>
                        <input type="number" id="ciSampleSize1" min="2" required>
                    </div>
                    <div class="form-group">
                        <label for="ciSampleSize2">Sample 2 Size (n₂)</label>
                        <input type="number" id="ciSampleSize2" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.CI_SINGLE_PROPORTION:
                zTestForm.innerHTML = `
                    <div class="form-group">
                        <label for="ciSampleProp">Sample Proportion (p̂)</label>
                        <input type="number" id="ciSampleProp" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="ciPropSampleSize">Sample Size (n)</label>
                        <input type="number" id="ciPropSampleSize" min="2" required>
                    </div>
                `;
                break;
                
            case TEST_TYPES.CI_TWO_PROPORTIONS:
                zTestForm.innerHTML = `
                    <div class="form-group">
                        <label for="ciSampleProp1">Sample 1 Proportion (p̂₁)</label>
                        <input type="number" id="ciSampleProp1" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="ciSampleProp2">Sample 2 Proportion (p̂₂)</label>
                        <input type="number" id="ciSampleProp2" min="0" max="1" step="0.0001" required>
                    </div>
                    <div class="form-group">
                        <label for="ciPropSampleSize1">Sample 1 Size (n₁)</label>
                        <input type="number" id="ciPropSampleSize1" min="2" required>
                    </div>
                    <div class="form-group">
                        <label for="ciPropSampleSize2">Sample 2 Size (n₂)</label>
                        <input type="number" id="ciPropSampleSize2" min="2" required>
                    </div>
                `;
                break;
        }
    }

    // Update hypothesis text based on selected test and tail type
    function updateHypothesisText() {
        const testType = testTypeSelect.value;
        const tail = tailType.value;
        
        if (!testType || testType.startsWith('ci')) return;
        
        let nullText = '';
        let altText = '';
        
        switch (testType) {
            case TEST_TYPES.ONE_SAMPLE:
                nullText = "μ = μ₀ (population mean equals hypothesized value)";
                switch (tail) {
                    case TAIL_TYPES.LEFT_TAILED:
                        altText = "μ < μ₀ (population mean is less than hypothesized value)";
                        break;
                    case TAIL_TYPES.RIGHT_TAILED:
                        altText = "μ > μ₀ (population mean is greater than hypothesized value)";
                        break;
                    default:
                        altText = "μ ≠ μ₀ (population mean differs from hypothesized value)";
                }
                break;
                
            case TEST_TYPES.TWO_SAMPLE:
                nullText = "μ₁ = μ₂ (population means are equal)";
                switch (tail) {
                    case TAIL_TYPES.LEFT_TAILED:
                        altText = "μ₁ < μ₂ (population 1 mean is less than population 2 mean)";
                        break;
                    case TAIL_TYPES.RIGHT_TAILED:
                        altText = "μ₁ > μ₂ (population 1 mean is greater than population 2 mean)";
                        break;
                    default:
                        altText = "μ₁ ≠ μ₂ (population means are not equal)";
                }
                break;
                
            case TEST_TYPES.PROPORTION_ONE:
                nullText = "p = p₀ (population proportion equals hypothesized value)";
                switch (tail) {
                    case TAIL_TYPES.LEFT_TAILED:
                        altText = "p < p₀ (population proportion is less than hypothesized value)";
                        break;
                    case TAIL_TYPES.RIGHT_TAILED:
                        altText = "p > p₀ (population proportion is greater than hypothesized value)";
                        break;
                    default:
                        altText = "p ≠ p₀ (population proportion differs from hypothesized value)";
                }
                break;
                
            case TEST_TYPES.PROPORTION_TWO:
                nullText = "p₁ = p₂ (population proportions are equal)";
                switch (tail) {
                    case TAIL_TYPES.LEFT_TAILED:
                        altText = "p₁ < p₂ (population 1 proportion is less than population 2 proportion)";
                        break;
                    case TAIL_TYPES.RIGHT_TAILED:
                        altText = "p₁ > p₂ (population 1 proportion is greater than population 2 proportion)";
                        break;
                    default:
                        altText = "p₁ ≠ p₂ (population proportions are not equal)";
                }
                break;
        }
        
        nullHypothesis.textContent = nullText;
        altHypothesis.textContent = altText;
    }

    // Handle calculate button click
    function handleCalculateClick() {
        const testType = testTypeSelect.value;
        
        if (!testType) {
            alert("Please select a test type");
            return;
        }
        
        // Collect form data
        const formData = {
            test_type: testType
        };
        
        // Get common elements
        const formElements = zTestForm.elements;
        
        // Add all input values to formData
        for (let element of formElements) {
            if (element.id && element.value) {
                formData[element.id] = element.value;
            }
        }
        
        // Add hypothesis test specific data
        if (!testType.startsWith('ci')) {
            formData.alpha = significanceLevel.value;
            formData.tail = tailType.value;
        } else {
            formData.confidence_level = confidenceLevel.value;
        }
        
        // Send data to Python backend
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (testType.startsWith('ci')) {
                    displayCIResults(testType, data.confidence_level, data.result);
                } else {
                    displayHypothesisResults(
                        testType, 
                        data.result.z_score, 
                        data.result.p_value, 
                        data.alpha, 
                        data.result.is_significant, 
                        data.result.critical_value, 
                        data.tail
                    );
                }
                resultsDiv.classList.remove('hidden');
            } else {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
            console.error(error);
        });
    }

    // Display hypothesis test results
    function displayHypothesisResults(testType, zScore, pValue, alpha, isSignificant, criticalValue, tail) {
        const testName = getTestName(testType);
        const comparison = getComparisonText(criticalValue, tail);
        const tailDescription = getTailDescription(tail);
        
        resultContent.innerHTML = `
            <div class="result-item">
                <strong>Test Performed:</strong> ${testName}
            </div>
            <div class="result-item">
                <strong>Z-Score:</strong> ${zScore.toFixed(4)}
            </div>
            <div class="result-item">
                <strong>p-value:</strong> ${pValue.toExponential(4)}
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
                <p>A ${tailDescription} test was performed at α = ${alpha} level of significance.</p>
                <p>The calculated p-value (${pValue.toExponential(4)}) is ${pValue < alpha ? 'less' : 'greater'} than α.</p>
                <p>Z-score of ${zScore.toFixed(4)} ${isSignificant ? 'falls in the critical region' : 'does not fall in the critical region'}.</p>
            </div>
        `;
        
        // Generate Python chart
        generatePythonChart({
            test_type: testType,
            z_score: zScore,
            critical_value: criticalValue,
            tail: tail,
            alpha: alpha
        });
    }

    // Display confidence interval results
    function displayCIResults(testType, confidence, result) {
        const testName = getTestName(testType);
        
        resultContent.innerHTML = `
            <div class="result-item">
                <strong>Analysis Performed:</strong> ${testName}
            </div>
            <div class="result-item">
                <strong>Confidence Level:</strong> ${confidence}%
            </div>
            <div class="result-item">
                <strong>Critical Z-Value:</strong> ±${result.z_critical.toFixed(4)}
            </div>
            <div class="result-item">
                <strong>Margin of Error:</strong> ${result.margin_of_error.toFixed(4)}
            </div>
            <div class="result-item significant">
                <strong>Confidence Interval:</strong> 
                (${result.lower.toFixed(4)}, ${result.upper.toFixed(4)})
            </div>
            <div class="critical-value">
                <strong>Interpretation:</strong> 
                <p>We are ${confidence}% confident that the true population parameter falls between 
                ${result.lower.toFixed(4)} and ${result.upper.toFixed(4)}.</p>
            </div>
        `;
        
        // Generate Python chart
        generatePythonChart({
            test_type: testType,
            z_critical: result.z_critical,
            confidence_level: confidence
        });
    }

    // Generate Python chart using Plotly
    function generatePythonChart(chartData) {
        const graphContainer = document.getElementById('graphContainer');
        graphContainer.classList.remove('hidden');
        
        // Clear previous chart
        document.getElementById('pythonChart').innerHTML = '';
        
        fetch('/generate_chart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chartData)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('pythonChart').innerHTML = data.chart;
        })
        .catch(error => {
            console.error('Error generating chart:', error);
            document.getElementById('pythonChart').innerHTML = 
                '<p>Error loading visualization. Please try again.</p>';
        });
    }

    // Helper function to get test name
    function getTestName(testType) {
        switch (testType) {
            case TEST_TYPES.ONE_SAMPLE: return 'One-Sample Z-Test';
            case TEST_TYPES.TWO_SAMPLE: return 'Two-Sample Z-Test';
            case TEST_TYPES.PROPORTION_ONE: return 'Z-Test for One Proportion';
            case TEST_TYPES.PROPORTION_TWO: return 'Z-Test for Two Proportions';
            case TEST_TYPES.CI_SINGLE_MEAN: return 'Confidence Interval for Single Mean';
            case TEST_TYPES.CI_TWO_MEANS: return 'Confidence Interval for Difference of Two Means';
            case TEST_TYPES.CI_SINGLE_PROPORTION: return 'Confidence Interval for Single Proportion';
            case TEST_TYPES.CI_TWO_PROPORTIONS: return 'Confidence Interval for Difference of Two Proportions';
            default: return 'Statistical Analysis';
        }
    }

    // Helper function to get comparison text
    function getComparisonText(criticalValue, tail) {
        switch (tail) {
            case TAIL_TYPES.LEFT_TAILED: return `Z < ${criticalValue.toFixed(4)}`;
            case TAIL_TYPES.RIGHT_TAILED: return `Z > ${criticalValue.toFixed(4)}`;
            case TAIL_TYPES.TWO_TAILED: return `|Z| > ${criticalValue.toFixed(4)}`;
            default: return '';
        }
    }

    // Helper function to get tail description
    function getTailDescription(tail) {
        switch (tail) {
            case TAIL_TYPES.LEFT_TAILED: return 'left-tailed';
            case TAIL_TYPES.RIGHT_TAILED: return 'right-tailed';
            case TAIL_TYPES.TWO_TAILED: return 'two-tailed';
            default: return '';
        }
    }

    // Reset the calculator
    function resetCalculator() {
        document.getElementById('graphContainer').classList.add('hidden');
        document.getElementById('pythonChart').innerHTML = '';
        resultsDiv.classList.add('hidden');
        inputForm.classList.add('hidden');
        testTypeSelect.value = '';
        zTestForm.reset();
    }

    // Initialize the application
    init();
});