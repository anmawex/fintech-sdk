import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('fintech-payment')
export class FintechPayment extends LitElement {
  static styles = css`
    :host {
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --bg-glass: rgba(255, 255, 255, 0.7);
      --bg-blur: 16px;
      --text: #1e293b;
      --text-light: #64748b;
      --border: rgba(226, 232, 240, 0.5);
      --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

      display: block;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      max-width: 400px;
      margin: 2rem auto;
    }

    .widget-container {
      background: var(--bg-glass);
      backdrop-filter: blur(var(--bg-blur));
      -webkit-backdrop-filter: blur(var(--bg-blur));
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: var(--shadow);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .widget-container:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }

    .header p {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      color: var(--text-light);
    }

    .card-preview {
      width: 100%;
      height: 180px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      border-radius: 16px;
      margin-bottom: 2rem;
      padding: 1.5rem;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
      position: relative;
      overflow: hidden;
    }

    .card-preview::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .card-chip {
      width: 40px;
      height: 30px;
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .card-number {
      font-size: 1.25rem;
      letter-spacing: 2px;
      font-family: 'Courier New', monospace;
      margin-bottom: 1rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .card-holder {
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .card-expiry {
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-light);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: white;
      font-size: 1rem;
      color: var(--text);
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .pay-btn {
      width: 100%;
      padding: 1rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      margin-top: 1rem;
    }

    .pay-btn:hover {
      background: var(--primary-hover);
    }

    .pay-btn:active {
      transform: scale(0.98);
    }

    .success-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 24px;
      z-index: 10;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .success-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }

    .checkmark {
      width: 60px;
      height: 60px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      margin-bottom: 1rem;
      animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes scaleUp {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
  `;

  @property({ type: String }) amount = '0.00';
  @property({ type: String }) currency = 'USD';
  @property({ type: String, attribute: 'client-id' }) clientId = '';
  
  @state() private cardNumber = '**** **** **** ****';
  @state() private cardName = 'NOMBRE DEL TITULAR';
  @state() private cardExpiry = 'MM/YY';
  @state() private isProcessing = false;
  @state() private isSuccess = false;

  private handleCardUpdate(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    if (input.id === 'card-number') {
      this.cardNumber = value || '**** **** **** ****';
    } else if (input.id === 'card-name') {
      this.cardName = (value || 'NOMBRE DEL TITULAR').toUpperCase();
    } else if (input.id === 'card-expiry') {
      this.cardExpiry = value || 'MM/YY';
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    this.isProcessing = true;
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.isProcessing = false;
    this.isSuccess = true;

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('payment-success', {
      detail: { amount: this.amount, currency: this.currency },
      bubbles: true,
      composed: true
    }));

    setTimeout(() => {
      this.isSuccess = false;
    }, 3000);
  }

  render() {
    return html`
      <div class="widget-container">
        <div class="header">
          <h2>Pago Seguro</h2>
          <p>Completa los detalles de tu tarjeta para procesar el pago de <strong>${this.amount} ${this.currency}</strong>.</p>
        </div>

        <div class="card-preview">
          <div class="card-chip"></div>
          <div class="card-number">${this.cardNumber}</div>
          <div class="card-footer">
            <div class="card-holder">
              <label style="color: white; font-size: 0.6rem; margin-bottom: 2px;">Titular</label>
              <div>${this.cardName}</div>
            </div>
            <div class="card-expiry">
              <label style="color: white; font-size: 0.6rem; margin-bottom: 2px;">Expira</label>
              <div>${this.cardExpiry}</div>
            </div>
          </div>
        </div>

        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label for="card-number">Número de tarjeta</label>
            <input 
              id="card-number" 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              maxlength="19" 
              @input=${this.handleCardUpdate}
              required
            >
          </div>
          <div class="form-group">
            <label for="card-name">Nombre en la tarjeta</label>
            <input 
              id="card-name" 
              type="text" 
              placeholder="Ej. Juan Pérez" 
              @input=${this.handleCardUpdate}
              required
            >
          </div>
          <div class="row">
            <div class="form-group">
              <label for="card-expiry">Expiración</label>
              <input 
                id="card-expiry" 
                type="text" 
                placeholder="MM/YY" 
                maxlength="5" 
                @input=${this.handleCardUpdate}
                required
              >
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV</label>
              <input id="card-cvv" type="password" placeholder="123" maxlength="3" required>
            </div>
          </div>

          <button type="submit" class="pay-btn" ?disabled=${this.isProcessing}>
            ${this.isProcessing ? 'Procesando...' : `Pagar ${this.amount} ${this.currency}`}
          </button>
        </form>

        <div class="success-overlay ${this.isSuccess ? 'show' : ''}">
          <div class="checkmark">✓</div>
          <h3>¡Pago Exitoso!</h3>
          <p>Tu transacción ha sido confirmada.</p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fintech-payment': FintechPayment;
  }
}
