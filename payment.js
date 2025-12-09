// Payment Integration with Stripe
// Handles online payments for bookings

class PaymentProcessor {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.isInitialized = false;
    }

    // Initialize Stripe
    async initialize(publishableKey) {
        try {
            if (typeof Stripe === 'undefined') {
                console.error('❌ Stripe.js not loaded');
                return false;
            }

            this.stripe = Stripe(publishableKey);
            this.isInitialized = true;
            console.log('✅ Stripe initialized');
            return true;
        } catch (error) {
            console.error('❌ Error initializing Stripe:', error);
            return false;
        }
    }

    // Create payment intent
    async createPaymentIntent(amount, currency = 'pkr', metadata = {}) {
        try {
            // Call your backend/edge function to create payment intent
            const { data, error } = await supabase.functions.invoke('create-payment-intent', {
                body: {
                    amount: Math.round(amount * 100), // Convert to cents/paisa
                    currency,
                    metadata
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error creating payment intent:', error);
            return null;
        }
    }

    // Setup payment form
    setupPaymentForm(clientSecret, elementId = 'payment-element') {
        if (!this.isInitialized) {
            console.error('❌ Stripe not initialized');
            return false;
        }

        const appearance = {
            theme: 'stripe',
            variables: {
                colorPrimary: '#f39c12',
                colorBackground: '#ffffff',
                colorText: '#1a1a2e',
                colorDanger: '#e74c3c',
                fontFamily: 'Outfit, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
            }
        };

        this.elements = this.stripe.elements({ clientSecret, appearance });

        const paymentElement = this.elements.create('payment');
        paymentElement.mount(`#${elementId}`);

        return true;
    }

    // Process payment
    async processPayment(returnUrl) {
        if (!this.stripe || !this.elements) {
            console.error('❌ Payment form not set up');
            return { success: false, error: 'Payment form not initialized' };
        }

        try {
            const { error } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: returnUrl
                }
            });

            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return { success: true };
        } catch (error) {
            console.error('❌ Payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Quick payment for saved cards
    async quickPay(paymentMethodId, amount, currency = 'pkr') {
        try {
            const { data, error } = await supabase.functions.invoke('process-payment', {
                body: {
                    paymentMethodId,
                    amount: Math.round(amount * 100),
                    currency
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Quick pay error:', error);
            return { success: false, error: error.message };
        }
    }

    // Format amount for display
    formatAmount(amount, currency = 'PKR') {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
}

// JazzCash/EasyPaisa Integration (Pakistan)
class LocalPaymentProcessor {
    constructor() {
        this.merchantId = null;
        this.password = null;
        this.integritySalt = null;
    }

    // Initialize JazzCash
    initializeJazzCash(merchantId, password, integritySalt) {
        this.merchantId = merchantId;
        this.password = password;
        this.integritySalt = integritySalt;
        console.log('✅ JazzCash initialized');
    }

    // Create JazzCash payment
    async createJazzCashPayment(amount, billReference, description) {
        try {
            const { data, error } = await supabase.functions.invoke('jazzcash-payment', {
                body: {
                    amount,
                    billReference,
                    description,
                    merchantId: this.merchantId
                }
            });

            if (error) throw error;

            // Redirect to JazzCash payment page
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }

            return { success: true, data };
        } catch (error) {
            console.error('❌ JazzCash error:', error);
            return { success: false, error: error.message };
        }
    }

    // Verify JazzCash payment
    async verifyJazzCashPayment(transactionId) {
        try {
            const { data, error } = await supabase.functions.invoke('verify-jazzcash', {
                body: { transactionId }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Verification error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global instances
window.paymentProcessor = new PaymentProcessor();
window.localPayment = new LocalPaymentProcessor();

// Helper function to show payment modal
function showPaymentModal(amount, groundName, onSuccess) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <span class="payment-close">&times;</span>
            <h2>💳 Complete Payment</h2>
            <div class="payment-summary">
                <p><strong>Ground:</strong> ${groundName}</p>
                <p><strong>Amount:</strong> PKR ${amount}</p>
            </div>
            <div class="payment-methods">
                <button class="payment-method-btn" data-method="stripe">
                    <span>💳</span> Credit/Debit Card
                </button>
                <button class="payment-method-btn" data-method="jazzcash">
                    <span>📱</span> JazzCash
                </button>
                <button class="payment-method-btn" data-method="easypaisa">
                    <span>📱</span> EasyPaisa
                </button>
            </div>
            <div id="payment-element"></div>
            <button id="submit-payment" class="btn btn-primary" style="display: none;">
                Pay PKR ${amount}
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.payment-close').onclick = () => modal.remove();

    // Payment method selection
    modal.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.onclick = async () => {
            const method = btn.dataset.method;
            if (method === 'stripe') {
                // Show Stripe payment form
                const intent = await window.paymentProcessor.createPaymentIntent(amount);
                if (intent && intent.clientSecret) {
                    window.paymentProcessor.setupPaymentForm(intent.clientSecret);
                    document.getElementById('submit-payment').style.display = 'block';
                }
            } else if (method === 'jazzcash') {
                // Redirect to JazzCash
                await window.localPayment.createJazzCashPayment(amount, 'BOOKING-' + Date.now(), groundName);
            }
        };
    });

    // Submit payment
    document.getElementById('submit-payment').onclick = async () => {
        const result = await window.paymentProcessor.processPayment(window.location.href + '?payment=success');
        if (result.success) {
            onSuccess();
            modal.remove();
        } else {
            alert('Payment failed: ' + result.error);
        }
    };
}

// Export for use in other files
window.showPaymentModal = showPaymentModal;
