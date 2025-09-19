import { PAYPAL_CLIENT_ID, PAYPAL_ENV } from '../paymentsConfig.js';

class PaymentsManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.payments = dataManager.getPayments();
    }

    render() {
        document.querySelector('#app').innerHTML = `
            <div class="dashboard" style="min-height:100vh;background:linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/assets/images/income.jpg') center/cover no-repeat fixed;">
                <header class="dashboard-header" style="background:rgba(255,255,255,0.9);backdrop-filter:saturate(140%) blur(6px);">
                    <div class="header-content" style="max-width:1200px;margin:0 auto;padding:0 1rem;display:flex;justify-content:space-between;align-items:center;">
                        <div class="header-logo" style="display:flex;align-items:center;gap:12px;">
                            <div class="header-logo-image" style="width:40px;height:40px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);color:#fff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                                <img src="/assets/images/bridge.jpg" alt="Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width:100%;height:100%;object-fit:cover;">
                                <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:1.2rem;">🏨</div>
                            </div>
                            <div class="header-logo-text" style="font-weight:800;background:linear-gradient(135deg,#dc2626 0%, #000000 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Payments</div>
                        </div>
                        <div class="user-info" style="display:flex;align-items:center;gap:12px;">
                            <button id="logoutBtn" class="logout-btn">Logout</button>
                        </div>
                    </div>
                </header>

                <main class="dashboard-main" style="max-width:1200px;margin:0 auto;padding:2rem 1rem;">
                    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-bottom:1.5rem;">
                        <div style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);">
                            <h3 style="margin:0 0 0.75rem 0;color:#111827;font-size:1.05rem;">Create Payment</h3>
                            <form id="paymentForm" style="display:flex;flex-direction:column;gap:0.75rem;">
                                <input type="number" id="amount" placeholder="Amount (ETB)" min="1" step="0.01" required style="padding:0.65rem;border:1px solid #e5e7eb;border-radius:10px;">
                                <input type="text" id="description" placeholder="Description (optional)" style="padding:0.65rem;border:1px solid #e5e7eb;border-radius:10px;">
                                <button type="submit" class="btn btn-primary">Create Payment</button>
                            </form>
                            <div id="paypal-container" style="margin-top:1rem;"></div>
                        </div>

                        <div style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.6);backdrop-filter:saturate(140%) blur(6px);padding:1.25rem;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);">
                            <h3 style="margin:0 0 0.75rem 0;color:#111827;font-size:1.05rem;">Recent Payments</h3>
                            <div id="paymentsList">
                                ${this.payments.map(p => this.renderRow(p)).join('')}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <script src="https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture" data-sdk-integration-source="button-factory"></script>
        `;

        this.attachHandlers();
        this.renderPayPal();
    }

    renderRow(p) {
        return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;border-bottom:1px solid #eee;">
                <div>
                    <div style="font-weight:700;">${parseFloat(p.amount).toFixed(2)} ${p.currency}</div>
                    <div style="font-size:0.9rem;color:#6b7280;">${p.description || ''}</div>
                </div>
                <div style="font-size:0.9rem;">${p.status}</div>
            </div>
        `;
    }

    attachHandlers() {
        const form = document.getElementById('paymentForm');
        form.addEventListener('submit', (e) => this.handleCreatePayment(e));

        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', async () => {
            await window.authManager.logout();
            window.router.navigate('/login');
        });
    }

    async handleCreatePayment(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const original = submitBtn.textContent;
        try {
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;

            const amount = parseFloat(document.getElementById('amount').value);
            const description = document.getElementById('description').value;
            const email = window.authManager.getUserEmail();

            const result = await this.dataManager.createPayment({ amount, currency: 'ETB', description, userEmail: email });
            if (!result.success) throw new Error(result.error);

            this.payments = this.dataManager.getPayments();
            this.render();
        } catch (err) {
            alert('Payment creation failed: ' + err.message);
        } finally {
            submitBtn.textContent = original;
            submitBtn.disabled = false;
        }
    }

    renderPayPal() {
        if (!window.paypal) return;
        const container = document.getElementById('paypal-container');
        if (!container) return;

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                const amount = parseFloat(document.getElementById('amount').value || '0');
                if (!amount || amount <= 0) {
                    alert('Enter a valid amount before paying.');
                    return;
                }
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: amount.toFixed(2), currency_code: 'USD' },
                        description: document.getElementById('description').value || 'Bridge Hotel Payment'
                    }]
                });
            },
            onApprove: async (data, actions) => {
                const details = await actions.order.capture();
                // Persist success to Supabase
                const amount = parseFloat(document.getElementById('amount').value || '0');
                const description = document.getElementById('description').value;
                const email = window.authManager.getUserEmail();
                const res = await this.dataManager.createPayment({
                    amount,
                    currency: 'USD',
                    description,
                    provider: 'paypal',
                    providerPaymentId: details?.id,
                    userEmail: email,
                    status: 'captured'
                });
                if (res.success) {
                    alert('Payment completed successfully');
                    this.payments = this.dataManager.getPayments();
                    this.render();
                } else {
                    alert('Failed to record payment: ' + res.error);
                }
            },
            onError: (err) => {
                console.error('PayPal error', err);
                alert('Payment failed');
            }
        }).render('#paypal-container');
    }
}

export default PaymentsManager;


