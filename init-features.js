// Complete Feature Integration
// Initializes all advanced features automatically

(function () {
    'use strict';

    console.log('🚀 Initializing Football Reservation System...');

    // Configuration
    const CONFIG = {
        stripe: {
            // Use test key for now - replace with your actual key
            publishableKey: 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz' // REPLACE THIS
        },
        features: {
            pwa: true,
            smartPricing: true,
            payments: false, // Set to true when you have Stripe key
            analytics: true,
            notifications: true
        }
    };

    // Initialize on page load
    window.addEventListener('load', async () => {
        console.log('📦 Loading advanced features...');

        // 1. PWA Initialization
        if (CONFIG.features.pwa && 'serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('✅ PWA: Service Worker registered');

                // Request notification permission after a delay
                setTimeout(async () => {
                    if (window.pwaUtils && CONFIG.features.notifications) {
                        const granted = await window.pwaUtils.requestNotificationPermission();
                        if (granted) {
                            console.log('✅ PWA: Notifications enabled');
                        }
                    }
                }, 3000);
            } catch (error) {
                console.warn('⚠️ PWA: Service Worker registration failed:', error);
            }
        }

        // 2. Smart Pricing Initialization
        if (CONFIG.features.smartPricing && window.smartPricing && typeof tf !== 'undefined') {
            try {
                await window.smartPricing.initializeModel();
                console.log('✅ ML: Smart Pricing initialized');

                // Load historical data for training
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select('*')
                    .limit(100);

                if (bookings && bookings.length > 0) {
                    await window.smartPricing.trainModel(bookings);
                    console.log('✅ ML: Model trained with historical data');
                }
            } catch (error) {
                console.warn('⚠️ ML: Smart Pricing initialization failed:', error);
            }
        }

        // 3. Payment Initialization
        if (CONFIG.features.payments && window.paymentProcessor && typeof Stripe !== 'undefined') {
            try {
                const initialized = await window.paymentProcessor.initialize(CONFIG.stripe.publishableKey);
                if (initialized) {
                    console.log('✅ Payments: Stripe initialized');
                } else {
                    console.warn('⚠️ Payments: Stripe initialization failed');
                }
            } catch (error) {
                console.warn('⚠️ Payments: Error:', error);
            }
        }

        // 4. Analytics Initialization
        if (CONFIG.features.analytics && window.analytics) {
            try {
                // Auto-load analytics on admin page
                if (window.location.pathname.includes('admin.html')) {
                    const dashboardEl = document.getElementById('analytics-dashboard');
                    if (dashboardEl) {
                        await window.analytics.renderDashboard('analytics-dashboard');
                        console.log('✅ Analytics: Dashboard loaded');
                    }
                }

                // Subscribe to real-time updates
                window.analytics.subscribeToRealTimeUpdates((payload) => {
                    console.log('📊 Real-time update:', payload);
                    // Refresh analytics if on admin page
                    if (window.location.pathname.includes('admin.html')) {
                        window.analytics.renderDashboard('analytics-dashboard');
                    }
                });

                console.log('✅ Analytics: Real-time updates enabled');
            } catch (error) {
                console.warn('⚠️ Analytics: Error:', error);
            }
        }

        // 5. Show welcome message for first-time visitors
        if (!localStorage.getItem('visited')) {
            localStorage.setItem('visited', 'true');
            setTimeout(() => {
                if (window.pwaUtils) {
                    window.pwaUtils.showToast('Welcome to Football Reservation System! 🎉', 'success');
                }
            }, 1000);
        }

        // 6. Check for updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (window.pwaUtils) {
                    window.pwaUtils.showToast('App updated! Refresh for new features.', 'info');
                }
            });
        }

        console.log('✅ All features initialized successfully!');

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('frs:ready', {
            detail: { config: CONFIG }
        }));
    });

    // Add install prompt button to navbar
    const addInstallButton = () => {
        const navbar = document.querySelector('.nav-links');
        if (navbar && !document.getElementById('installPWA')) {
            const installBtn = document.createElement('li');
            installBtn.innerHTML = '<button id="installPWA" class="btn btn-secondary" style="display: none;">📱 Install App</button>';
            navbar.appendChild(installBtn);
        }
    };

    // Add install button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addInstallButton);
    } else {
        addInstallButton();
    }

    // Expose config for debugging
    window.FRS_CONFIG = CONFIG;

})();
