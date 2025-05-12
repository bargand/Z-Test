from flask import Flask, render_template, request, jsonify
import plotly
import plotly.graph_objects as go
import numpy as np
from scipy.stats import norm

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    test_type = data['test_type']
    
    try:
        if test_type.startswith('ci'):
            # Confidence interval calculations
            confidence = int(data['confidence_level'])
            alpha = (100 - confidence) / 100
            
            if test_type == 'ciSingleMean':
                sample_mean = float(data['sample_mean'])
                pop_std_dev = float(data['pop_std_dev'])
                sample_size = int(data['sample_size'])
                
                z_critical = norm.ppf(1 - alpha/2)
                margin_of_error = z_critical * (pop_std_dev / np.sqrt(sample_size))
                
                result = {
                    'lower': sample_mean - margin_of_error,
                    'upper': sample_mean + margin_of_error,
                    'margin_of_error': margin_of_error,
                    'z_critical': z_critical
                }
                
            # Add other CI calculations here...
            
            return jsonify({
                'success': True,
                'result': result,
                'test_type': test_type,
                'confidence_level': confidence
            })
            
        else:
            # Hypothesis test calculations
            alpha = float(data['alpha'])
            tail = data['tail']
            
            if test_type == 'oneSample':
                sample_mean = float(data['sample_mean'])
                pop_mean = float(data['pop_mean'])
                pop_std_dev = float(data['pop_std_dev'])
                sample_size = int(data['sample_size'])
                
                z_score = (sample_mean - pop_mean) / (pop_std_dev / np.sqrt(sample_size))
            
            # Add other test calculations here...
            
            # Calculate p-value
            if tail == 'twoTailed':
                p_value = 2 * (1 - norm.cdf(abs(z_score)))
                critical_value = norm.ppf(1 - alpha/2)
            elif tail == 'leftTailed':
                p_value = norm.cdf(z_score)
                critical_value = norm.ppf(alpha)
            else:  # rightTailed
                p_value = 1 - norm.cdf(z_score)
                critical_value = norm.ppf(1 - alpha)
            
            is_significant = p_value < alpha
            
            return jsonify({
                'success': True,
                'result': {
                    'z_score': z_score,
                    'p_value': p_value,
                    'critical_value': critical_value,
                    'is_significant': is_significant
                },
                'test_type': test_type,
                'tail': tail,
                'alpha': alpha
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/generate_chart', methods=['POST'])
def generate_chart():
    data = request.json
    test_type = data['test_type']
    tail = data.get('tail', 'twoTailed')
    
    # Create x values
    x = np.linspace(-4, 4, 1000)
    y = norm.pdf(x)
    
    fig = go.Figure()
    
    # Add normal curve
    fig.add_trace(go.Scatter(
        x=x, y=y,
        mode='lines',
        name='Normal Distribution',
        line=dict(color='green')
    ))
    
    # Handle different test types
    if test_type.startswith('ci'):
        # Confidence interval visualization
        z_critical = data['z_critical']
        fig.add_trace(go.Scatter(
            x=x, y=y,
            fill='tozeroy',
            mode='none',
            fillcolor='rgba(100, 149, 237, 0.5)',
            name=f"{data['confidence_level']}% Confidence"
        ))
        fig.add_trace(go.Scatter(
            x=x[np.abs(x) > z_critical], y=y[np.abs(x) > z_critical],
            fill='tozeroy',
            mode='none',
            fillcolor='rgba(255, 99, 71, 0.5)',
            name='Rejection Region'
        ))
    else:
        # Hypothesis test visualization
        z_score = data['z_score']
        critical_value = data['critical_value']
        
        if tail == 'twoTailed':
            mask = (x <= -critical_value) | (x >= critical_value)
            fig.add_trace(go.Scatter(
                x=x[mask], y=y[mask],
                fill='tozeroy',
                mode='none',
                name='Critical Region',
                fillcolor='rgba(255, 99, 71, 0.5)'
            ))
        elif tail == 'leftTailed':
            mask = x <= -critical_value
            fig.add_trace(go.Scatter(
                x=x[mask], y=y[mask],
                fill='tozeroy',
                mode='none',
                name='Critical Region',
                fillcolor='rgba(255, 99, 71, 0.5)'
            ))
        else:  # rightTailed
            mask = x >= critical_value
            fig.add_trace(go.Scatter(
                x=x[mask], y=y[mask],
                fill='tozeroy',
                mode='none',
                name='Critical Region',
                fillcolor='rgba(255, 99, 71, 0.5)'
            ))
        
        # Add z-score marker
        fig.add_trace(go.Scatter(
            x=[z_score], y=[norm.pdf(z_score)],
            mode='markers',
            marker=dict(size=10, color='purple'),
            name='Z-Score'
        ))
    
    fig.update_layout(
        title='Z-Test Visualization',
        xaxis_title='Z-Score',
        yaxis_title='Probability Density',
        showlegend=True
    )
    
    return jsonify({'chart': fig.to_html(full_html=False)})

if __name__ == '__main__':
    app.run(debug=True)