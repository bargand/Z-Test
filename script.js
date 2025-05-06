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
        populateConfidenceLevels();
    }

    // Populate confidence level options
    function populateConfidenceLevels() {
        const levels = [80, 85, 90, 95, 99];
        confidenceLevel.innerHTML = levels.map(level => 
            `<option value="${level}">${level}%</option>`
        ).join('');
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
        try {
            const testType = testTypeSelect.value;
            
            if (!testType) {
                throw new Error("Please select a test type");
            }
            
            if (testType.startsWith('ci')) {
                calculateConfidenceInterval(testType);
            } else {
                calculateHypothesisTest(testType);
            }
            
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error(error);
        }
    }

    // Calculate hypothesis test
    function calculateHypothesisTest(testType) {
        const alpha = parseFloat(significanceLevel.value);
        const tail = tailType.value;
        
        // Validate alpha
        if (isNaN(alpha) || alpha <= 0 || alpha >= 1) {
            throw new Error("Significance level must be between 0 and 1");
        }
        
        let zScore, pValue;
        
        switch (testType) {
            case TEST_TYPES.ONE_SAMPLE:
                zScore = calculateOneSampleZScore();
                break;
                
            case TEST_TYPES.TWO_SAMPLE:
                zScore = calculateTwoSampleZScore();
                break;
                
            case TEST_TYPES.PROPORTION_ONE:
                zScore = calculateProportionOneZScore();
                break;
                
            case TEST_TYPES.PROPORTION_TWO:
                zScore = calculateProportionTwoZScore();
                break;
        }
        
        // Calculate p-value based on tail type
        pValue = calculatePValue(zScore, tail);
        
        // Determine if result is significant
        const isSignificant = pValue < alpha;
        
        // Get critical value
        const criticalValue = getCriticalValue(alpha, tail);
        
        // Display results
        displayHypothesisResults(testType, zScore, pValue, alpha, isSignificant, criticalValue, tail);
        
        // Show results section
        resultsDiv.classList.remove('hidden');
    }

    // Calculate confidence interval
    function calculateConfidenceInterval(testType) {
        const confidence = parseInt(confidenceLevel.value);
        const alpha = (100 - confidence) / 100;
        
        let result;
        
        switch (testType) {
            case TEST_TYPES.CI_SINGLE_MEAN:
                result = calculateSingleMeanCI(alpha);
                break;
                
            case TEST_TYPES.CI_TWO_MEANS:
                result = calculateTwoMeansCI(alpha);
                break;
                
            case TEST_TYPES.CI_SINGLE_PROPORTION:
                result = calculateSingleProportionCI(alpha);
                break;
                
            case TEST_TYPES.CI_TWO_PROPORTIONS:
                result = calculateTwoProportionsCI(alpha);
                break;
        }
        
        // Display results
        displayCIResults(testType, confidence, result);
        
        // Show results section
        resultsDiv.classList.remove('hidden');
    }

    // Calculate one-sample Z-score
    function calculateOneSampleZScore() {
        const sampleMean = parseFloat(document.getElementById('sampleMean').value);
        const popMean = parseFloat(document.getElementById('popMean').value);
        const popStdDev = parseFloat(document.getElementById('popStdDev').value);
        const sampleSize = parseInt(document.getElementById('sampleSize').value);
        
        // Validate inputs
        if (isNaN(sampleMean)) throw new Error("Sample mean must be a number");
        if (isNaN(popMean)) throw new Error("Population mean must be a number");
        if (isNaN(popStdDev) || popStdDev <= 0) throw new Error("Population standard deviation must be a positive number");
        if (isNaN(sampleSize)) throw new Error("Sample size must be a number");
        if (sampleSize < 2) throw new Error("Sample size must be at least 2");
        
        return (sampleMean - popMean) / (popStdDev / Math.sqrt(sampleSize));
    }

    // Calculate two-sample Z-score
    function calculateTwoSampleZScore() {
        const sampleMean1 = parseFloat(document.getElementById('sampleMean1').value);
        const sampleMean2 = parseFloat(document.getElementById('sampleMean2').value);
        const popStdDev1 = parseFloat(document.getElementById('popStdDev1').value);
        const popStdDev2 = parseFloat(document.getElementById('popStdDev2').value);
        const sampleSize1 = parseInt(document.getElementById('sampleSize1').value);
        const sampleSize2 = parseInt(document.getElementById('sampleSize2').value);
        
        // Validate inputs
        if (isNaN(sampleMean1)) throw new Error("Sample 1 mean must be a number");
        if (isNaN(sampleMean2)) throw new Error("Sample 2 mean must be a number");
        if (isNaN(popStdDev1) || popStdDev1 <= 0) throw new Error("Population 1 standard deviation must be a positive number");
        if (isNaN(popStdDev2) || popStdDev2 <= 0) throw new Error("Population 2 standard deviation must be a positive number");
        if (isNaN(sampleSize1)) throw new Error("Sample 1 size must be a number");
        if (isNaN(sampleSize2)) throw new Error("Sample 2 size must be a number");
        if (sampleSize1 < 2) throw new Error("Sample 1 size must be at least 2");
        if (sampleSize2 < 2) throw new Error("Sample 2 size must be at least 2");
        
        const stdError = Math.sqrt(
            (Math.pow(popStdDev1, 2) / sampleSize1) + 
            (Math.pow(popStdDev2, 2) / sampleSize2)
        );
        
        if (stdError === 0) throw new Error("Standard error cannot be zero");
        
        return (sampleMean1 - sampleMean2) / stdError;
    }

    // Calculate one-proportion Z-score
    function calculateProportionOneZScore() {
        const sampleProp = parseFloat(document.getElementById('sampleProp').value);
        const popProp = parseFloat(document.getElementById('popProp').value);
        const sampleSize = parseInt(document.getElementById('propSampleSize').value);
        
        // Validate inputs
        if (isNaN(sampleProp) || sampleProp < 0 || sampleProp > 1) {
            throw new Error("Sample proportion must be between 0 and 1");
        }
        if (isNaN(popProp) || popProp < 0 || popProp > 1) {
            throw new Error("Population proportion must be between 0 and 1");
        }
        if (isNaN(sampleSize)) throw new Error("Sample size must be a number");
        if (sampleSize < 2) throw new Error("Sample size must be at least 2");
        
        // Check for edge cases
        if (popProp === 0 || popProp === 1) {
            throw new Error("Population proportion cannot be exactly 0 or 1 for this test");
        }
        
        const stdError = Math.sqrt(
            (popProp * (1 - popProp)) / sampleSize
        );
        
        if (stdError === 0) throw new Error("Standard error cannot be zero");
        
        return (sampleProp - popProp) / stdError;
    }

    // Calculate two-proportion Z-score
    function calculateProportionTwoZScore() {
        const sampleProp1 = parseFloat(document.getElementById('sampleProp1').value);
        const sampleProp2 = parseFloat(document.getElementById('sampleProp2').value);
        const sampleSize1 = parseInt(document.getElementById('propSampleSize1').value);
        const sampleSize2 = parseInt(document.getElementById('propSampleSize2').value);
        
        // Validate inputs
        if (isNaN(sampleProp1) || sampleProp1 < 0 || sampleProp1 > 1) {
            throw new Error("Sample 1 proportion must be between 0 and 1");
        }
        if (isNaN(sampleProp2) || sampleProp2 < 0 || sampleProp2 > 1) {
            throw new Error("Sample 2 proportion must be between 0 and 1");
        }
        if (isNaN(sampleSize1)) throw new Error("Sample 1 size must be a number");
        if (isNaN(sampleSize2)) throw new Error("Sample 2 size must be a number");
        if (sampleSize1 < 2) throw new Error("Sample 1 size must be at least 2");
        if (sampleSize2 < 2) throw new Error("Sample 2 size must be at least 2");
        
        const pooledProp = (sampleProp1 * sampleSize1 + sampleProp2 * sampleSize2) / (sampleSize1 + sampleSize2);
        
        const stdError = Math.sqrt(
            pooledProp * (1 - pooledProp) * (1/sampleSize1 + 1/sampleSize2)
        );
        
        if (stdError === 0) throw new Error("Standard error cannot be zero");
        
        return (sampleProp1 - sampleProp2) / stdError;
    }

    // Calculate single mean confidence interval
    function calculateSingleMeanCI(alpha) {
        const sampleMean = parseFloat(document.getElementById('ciSampleMean').value);
        const popStdDev = parseFloat(document.getElementById('ciPopStdDev').value);
        const sampleSize = parseInt(document.getElementById('ciSampleSize').value);
        
        // Validate inputs
        if (isNaN(sampleMean)) throw new Error("Sample mean must be a number");
        if (isNaN(popStdDev) || popStdDev <= 0) throw new Error("Population standard deviation must be a positive number");
        if (isNaN(sampleSize)) throw new Error("Sample size must be a number");
        if (sampleSize < 2) throw new Error("Sample size must be at least 2");
        
        const zCritical = getCriticalValue(alpha/2, TAIL_TYPES.TWO_TAILED);
        const marginOfError = zCritical * (popStdDev / Math.sqrt(sampleSize));
        
        return {
            lower: sampleMean - marginOfError,
            upper: sampleMean + marginOfError,
            marginOfError: marginOfError,
            zCritical: zCritical
        };
    }

    // Calculate two means confidence interval
    function calculateTwoMeansCI(alpha) {
        const sampleMean1 = parseFloat(document.getElementById('ciSampleMean1').value);
        const sampleMean2 = parseFloat(document.getElementById('ciSampleMean2').value);
        const popStdDev1 = parseFloat(document.getElementById('ciPopStdDev1').value);
        const popStdDev2 = parseFloat(document.getElementById('ciPopStdDev2').value);
        const sampleSize1 = parseInt(document.getElementById('ciSampleSize1').value);
        const sampleSize2 = parseInt(document.getElementById('ciSampleSize2').value);
        
        // Validate inputs
        if (isNaN(sampleMean1)) throw new Error("Sample 1 mean must be a number");
        if (isNaN(sampleMean2)) throw new Error("Sample 2 mean must be a number");
        if (isNaN(popStdDev1) || popStdDev1 <= 0) throw new Error("Population 1 standard deviation must be a positive number");
        if (isNaN(popStdDev2) || popStdDev2 <= 0) throw new Error("Population 2 standard deviation must be a positive number");
        if (isNaN(sampleSize1)) throw new Error("Sample 1 size must be a number");
        if (isNaN(sampleSize2)) throw new Error("Sample 2 size must be a number");
        if (sampleSize1 < 2) throw new Error("Sample 1 size must be at least 2");
        if (sampleSize2 < 2) throw new Error("Sample 2 size must be at least 2");
        
        const zCritical = getCriticalValue(alpha/2, TAIL_TYPES.TWO_TAILED);
        const stdError = Math.sqrt(
            (Math.pow(popStdDev1, 2) / sampleSize1) + 
            (Math.pow(popStdDev2, 2) / sampleSize2)
        );
        
        const difference = sampleMean1 - sampleMean2;
        const marginOfError = zCritical * stdError;
        
        return {
            lower: difference - marginOfError,
            upper: difference + marginOfError,
            marginOfError: marginOfError,
            zCritical: zCritical
        };
    }

    // Calculate single proportion confidence interval
    function calculateSingleProportionCI(alpha) {
        const sampleProp = parseFloat(document.getElementById('ciSampleProp').value);
        const sampleSize = parseInt(document.getElementById('ciPropSampleSize').value);
        
        // Validate inputs
        if (isNaN(sampleProp) || sampleProp < 0 || sampleProp > 1) {
            throw new Error("Sample proportion must be between 0 and 1");
        }
        if (isNaN(sampleSize)) throw new Error("Sample size must be a number");
        if (sampleSize < 2) throw new Error("Sample size must be at least 2");
        
        const zCritical = getCriticalValue(alpha/2, TAIL_TYPES.TWO_TAILED);
        const stdError = Math.sqrt(
            (sampleProp * (1 - sampleProp)) / sampleSize
        );
        
        const marginOfError = zCritical * stdError;
        
        return {
            lower: Math.max(0, sampleProp - marginOfError),
            upper: Math.min(1, sampleProp + marginOfError),
            marginOfError: marginOfError,
            zCritical: zCritical
        };
    }

    // Calculate two proportions confidence interval
    function calculateTwoProportionsCI(alpha) {
        const sampleProp1 = parseFloat(document.getElementById('ciSampleProp1').value);
        const sampleProp2 = parseFloat(document.getElementById('ciSampleProp2').value);
        const sampleSize1 = parseInt(document.getElementById('ciPropSampleSize1').value);
        const sampleSize2 = parseInt(document.getElementById('ciPropSampleSize2').value);
        
        // Validate inputs
        if (isNaN(sampleProp1) || sampleProp1 < 0 || sampleProp1 > 1) {
            throw new Error("Sample 1 proportion must be between 0 and 1");
        }
        if (isNaN(sampleProp2) || sampleProp2 < 0 || sampleProp2 > 1) {
            throw new Error("Sample 2 proportion must be between 0 and 1");
        }
        if (isNaN(sampleSize1)) throw new Error("Sample 1 size must be a number");
        if (isNaN(sampleSize2)) throw new Error("Sample 2 size must be a number");
        if (sampleSize1 < 2) throw new Error("Sample 1 size must be at least 2");
        if (sampleSize2 < 2) throw new Error("Sample 2 size must be at least 2");
        
        const zCritical = getCriticalValue(alpha/2, TAIL_TYPES.TWO_TAILED);
        const stdError = Math.sqrt(
            (sampleProp1 * (1 - sampleProp1) / sampleSize1) + 
            (sampleProp2 * (1 - sampleProp2) / sampleSize2)
        );
        
        const difference = sampleProp1 - sampleProp2;
        const marginOfError = zCritical * stdError;
        
        return {
            lower: Math.max(-1, difference - marginOfError),
            upper: Math.min(1, difference + marginOfError),
            marginOfError: marginOfError,
            zCritical: zCritical
        };
    }

    // Calculate p-value based on Z-score and tail type
    function calculatePValue(zScore, tail) {
        // Standard normal cumulative distribution function
        const cdf = (z) => {
            if (z < -8.0) return 0.0;
            if (z > 8.0) return 1.0;
            
            let sum = 0.0;
            let term = z;
            let i = 3;
            
            while (sum + term !== sum) {
                sum += term;
                term *= z * z / i;
                i += 2;
            }
            
            return 0.5 + sum * Math.exp(-0.5 * z * z - 0.9189385332046727);
        };
        
        switch (tail) {
            case TAIL_TYPES.LEFT_TAILED:
                return cdf(zScore);
                
            case TAIL_TYPES.RIGHT_TAILED:
                return 1 - cdf(zScore);
                
            case TAIL_TYPES.TWO_TAILED:
                return 2 * (1 - cdf(Math.abs(zScore)));
                
            default:
                throw new Error("Invalid tail type specified");
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
                       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1));
            } else if (p <= phigh) {
                // Rational approximation for central region
                q = p - 0.5;
                r = q * q;
                return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5] * q /
                       (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1));
            } else {
                // Rational approximation for upper region
                q = Math.sqrt(-2 * Math.log(1 - p));
                return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5] /
                       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1));
            }
        };
        
        switch (tail) {
            case TAIL_TYPES.LEFT_TAILED:
                return probit(alpha);
                
            case TAIL_TYPES.RIGHT_TAILED:
                return probit(1 - alpha);
                
            case TAIL_TYPES.TWO_TAILED:
                return Math.abs(probit(alpha / 2));
                
            default:
                throw new Error("Invalid tail type specified");
        }
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
                <strong>Critical Z-Value:</strong> ±${result.zCritical.toFixed(4)}
            </div>
            <div class="result-item">
                <strong>Margin of Error:</strong> ${result.marginOfError.toFixed(4)}
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
        resultsDiv.classList.add('hidden');
        inputForm.classList.add('hidden');
        testTypeSelect.value = '';
        zTestForm.reset();
    }

    // Initialize the application
    init();
});