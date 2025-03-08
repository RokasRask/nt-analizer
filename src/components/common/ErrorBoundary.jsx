import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Atnaujinti state, kad būtų rodomas atsarginis UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Galima registruoti klaidą kokiame nors klaidos registravimo servise
    console.error("Klaida komponentuose:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Galite sukurti bet kokį atsarginį UI
      return (
        <div className="error-boundary">
          <h2>Įvyko klaida</h2>
          <p>Atsiprašome, įvyko klaida. Bandykite perkrauti puslapį.</p>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
              <summary>Klaidos informacija (skirta kūrėjams)</summary>
              <p>{this.state.error.toString()}</p>
              <p>{this.state.errorInfo?.componentStack}</p>
            </details>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px' }}
          >
            Perkrauti puslapį
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;