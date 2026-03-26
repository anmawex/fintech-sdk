import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('fintech-payment')
export class FintechPayment extends LitElement {
  static styles = css`
    :host {
      /* Public CSS Tokens (Theming API) */
      --fintech-primary: var(--ft-primary-color, #6366f1);
      --fintech-primary-hover: var(--ft-primary-hover-color, #4f46e5);
      --fintech-radius: var(--ft-border-radius, 24px);
      --fintech-inner-radius: var(--ft-inner-border-radius, 12px);
      --fintech-font: var(--ft-font-family, 'Inter', system-ui, sans-serif);
      --fintech-bg: var(--ft-widget-bg, rgba(255, 255, 255, 0.7));
      --fintech-blur: var(--ft-widget-blur, 16px);
      --fintech-text: var(--ft-text-color, #1e293b);
      --fintech-text-light: var(--ft-text-light-color, #64748b);
      --fintech-card-gradient: var(--ft-card-gradient, linear-gradient(135deg, #6366f1 0%, #a855f7 100%));

      display: block;
      font-family: var(--fintech-font);
      max-width: 400px;
      margin: 2rem auto;
    }

    .widget-container {
      background: var(--fintech-bg);
      backdrop-filter: blur(var(--fintech-blur));
      -webkit-backdrop-filter: blur(var(--fintech-blur));
      border: 1px solid rgba(226, 232, 240, 0.5);
      border-radius: var(--fintech-radius);
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .widget-container:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--fintech-text);
    }

    .header p {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      color: var(--fintech-text-light);
    }

    .card-preview {
      width: 100%;
      height: 180px;
      background: var(--fintech-card-gradient);
      border-radius: var(--fintech-inner-radius);
      margin-bottom: 2rem;
      padding: 1.5rem;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
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

    .card-holder, .card-expiry {
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
      color: var(--fintech-text-light);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: var(--fintech-inner-radius);
      background: white;
      font-size: 1rem;
      color: var(--fintech-text);
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: var(--fintech-primary);
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
      background: var(--fintech-primary);
      color: white;
      border: none;
      border-radius: var(--fintech-inner-radius);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      margin-top: 1rem;
    }

    .pay-btn:hover {
      background: var(--fintech-primary-hover);
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
      background: var(--fintech-bg);
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: var(--fintech-radius);
      z-index: 10;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      color: var(--fintech-text);
      text-align: center;
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
      detail: { amount: this.amount, currency: this.currency, clientId: this.clientId },
      bubbles: true,
      composed: true
    }));

    setTimeout(() => {
      this.isSuccess = false;
    }, 3000);
  }

  render() {
    return html`
      <div class="widget-container" part="container">
        <div class="header" part="header">
          <h2 part="title">Pago Seguro</h2>
          <p part="subtitle">Completa los detalles de tu tarjeta para procesar el pago de <strong>${this.amount} ${this.currency}</strong>.</p>
        </div>

        <div class="card-preview" part="card">
          <div class="card-chip"></div>
          <div class="card-number">${this.cardNumber}</div>
          <div class="card-footer">
            <div class="card-holder">
              <label style="color: white; font-size: 0.6rem; margin-bottom: 2px; opacity: 0.7;">Titular</label>
              <div>${this.cardName}</div>
            </div>
            <div class="card-expiry">
              <label style="color: white; font-size: 0.6rem; margin-bottom: 2px; opacity: 0.7;">Expira</label>
              <div>${this.cardExpiry}</div>
            </div>
          </div>
        </div>

        <form @submit=${this.handleSubmit} part="form">
          <div class="form-group" part="form-group">
            <label for="card-number" part="label">Número de tarjeta</label>
            <input 
              id="card-number" 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              maxlength="19" 
              @input=${this.handleCardUpdate}
              required
              part="input"
            >
          </div>
          <div class="form-group" part="form-group">
            <label for="card-name" part="label">Nombre en la tarjeta</label>
            <input 
              id="card-name" 
              type="text" 
              placeholder="Ej. Juan Pérez" 
              @input=${this.handleCardUpdate}
              required
              part="input"
            >
          </div>
          <div class="row">
            <div class="form-group" part="form-group">
              <label for="card-expiry" part="label">Expiración</label>
              <input 
                id="card-expiry" 
                type="text" 
                placeholder="MM/YY" 
                maxlength="5" 
                @input=${this.handleCardUpdate}
                required
                part="input"
              >
            </div>
            <div class="form-group" part="form-group">
              <label for="card-cvv" part="label">CVV</label>
              <input id="card-cvv" type="password" placeholder="123" maxlength="3" required part="input">
            </div>
          </div>

          <button type="submit" class="pay-btn" ?disabled=${this.isProcessing} part="button">
            ${this.isProcessing ? 'Procesando...' : `Pagar ${this.amount} ${this.currency}`}
          </button>
        </form>

        <div class="success-overlay ${this.isSuccess ? 'show' : ''}" part="success-overlay">
          <div class="checkmark">✓</div>
          <h3 part="success-title">¡Pago Exitoso!</h3>
          <p part="success-message">Tu transacción ha sido confirmada.</p>
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
