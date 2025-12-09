// Smart Pricing with Machine Learning
// Uses TensorFlow.js for browser-based ML

class SmartPricingEngine {
    constructor() {
        this.model = null;
        this.isModelReady = false;
    }

    // Initialize TensorFlow model
    async initializeModel() {
        try {
            // Create a simple neural network for price prediction
            this.model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [6], units: 16, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.dense({ units: 8, activation: 'relu' }),
                    tf.layers.dense({ units: 1, activation: 'linear' })
                ]
            });

            this.model.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'meanSquaredError',
                metrics: ['mae']
            });

            this.isModelReady = true;
            console.log('✅ Smart Pricing Model initialized');
        } catch (error) {
            console.error('❌ Error initializing model:', error);
        }
    }

    // Train model with historical data
    async trainModel(historicalBookings) {
        if (!this.isModelReady) {
            await this.initializeModel();
        }

        try {
            // Prepare training data
            const features = [];
            const labels = [];

            historicalBookings.forEach(booking => {
                const feature = this.extractFeatures(booking);
                features.push(feature);
                labels.push(booking.finalPrice || booking.basePrice);
            });

            const xs = tf.tensor2d(features);
            const ys = tf.tensor2d(labels, [labels.length, 1]);

            // Train the model
            await this.model.fit(xs, ys, {
                epochs: 50,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        if (epoch % 10 === 0) {
                            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
                        }
                    }
                }
            });

            console.log('✅ Model trained successfully');

            // Clean up tensors
            xs.dispose();
            ys.dispose();
        } catch (error) {
            console.error('❌ Error training model:', error);
        }
    }

    // Extract features from booking data
    extractFeatures(booking) {
        const date = new Date(booking.bookingDate);

        return [
            date.getDay(), // Day of week (0-6)
            date.getHours(), // Hour of day
            this.getSeasonFactor(date), // Season (0-3)
            booking.demandScore || 0.5, // Historical demand
            booking.weatherScore || 0.7, // Weather factor
            booking.competitionNearby || 0 // Nearby competition
        ];
    }

    // Get season factor
    getSeasonFactor(date) {
        const month = date.getMonth();
        // 0: Winter, 1: Spring, 2: Summer, 3: Fall
        if (month >= 11 || month <= 1) return 0; // Winter
        if (month >= 2 && month <= 4) return 1; // Spring
        if (month >= 5 && month <= 7) return 2; // Summer
        return 3; // Fall
    }

    // Predict optimal price
    async predictPrice(groundId, bookingDate, timeSlot, basePrice) {
        if (!this.isModelReady) {
            console.warn('⚠️ Model not ready, using base price');
            return basePrice;
        }

        try {
            // Get historical data for this ground
            const { data: bookings } = await supabase
                .from('bookings')
                .select('*')
                .eq('groundId', groundId)
                .limit(100);

            // Get weather data
            const weatherScore = await this.getWeatherScore(bookingDate);

            // Get demand score
            const demandScore = this.calculateDemandScore(bookings, bookingDate, timeSlot);

            // Prepare features
            const date = new Date(bookingDate);
            const hour = parseInt(timeSlot.split(':')[0]);

            const features = [
                date.getDay(),
                hour,
                this.getSeasonFactor(date),
                demandScore,
                weatherScore,
                0.5 // Competition factor (can be enhanced)
            ];

            // Predict
            const input = tf.tensor2d([features]);
            const prediction = this.model.predict(input);
            const predictedPrice = (await prediction.data())[0];

            // Clean up
            input.dispose();
            prediction.dispose();

            // Apply constraints (don't deviate too much from base price)
            const minPrice = basePrice * 0.8; // Max 20% discount
            const maxPrice = basePrice * 1.5; // Max 50% increase
            const finalPrice = Math.max(minPrice, Math.min(maxPrice, predictedPrice));

            console.log(`💰 Smart Price: PKR ${Math.round(finalPrice)} (Base: PKR ${basePrice})`);

            return Math.round(finalPrice);
        } catch (error) {
            console.error('❌ Error predicting price:', error);
            return basePrice;
        }
    }

    // Calculate demand score based on historical bookings
    calculateDemandScore(bookings, targetDate, targetTimeSlot) {
        if (!bookings || bookings.length === 0) return 0.5;

        const targetDay = new Date(targetDate).getDay();
        const targetHour = parseInt(targetTimeSlot.split(':')[0]);

        // Count similar bookings
        const similarBookings = bookings.filter(b => {
            const bDate = new Date(b.bookingDate);
            const bHour = parseInt(b.timeSlot.split(':')[0]);
            return bDate.getDay() === targetDay && Math.abs(bHour - targetHour) <= 1;
        });

        // Normalize to 0-1 scale
        return Math.min(1, similarBookings.length / 20);
    }

    // Get weather score (simplified - can integrate real weather API)
    async getWeatherScore(date) {
        // TODO: Integrate with OpenWeatherMap API
        // For now, return a default good weather score
        return 0.8;

        /* Real implementation:
        const apiKey = 'YOUR_OPENWEATHER_API_KEY';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=Islamabad&appid=${apiKey}`
        );
        const data = await response.json();
        // Analyze weather and return score 0-1
        */
    }

    // Get price recommendation with explanation
    async getPriceRecommendation(groundId, bookingDate, timeSlot, basePrice) {
        const predictedPrice = await this.predictPrice(groundId, bookingDate, timeSlot, basePrice);
        const difference = predictedPrice - basePrice;
        const percentChange = ((difference / basePrice) * 100).toFixed(1);

        let reason = '';
        if (difference > 0) {
            reason = `High demand expected (+${percentChange}%)`;
        } else if (difference < 0) {
            reason = `Low demand, offering discount (${percentChange}%)`;
        } else {
            reason = 'Standard pricing';
        }

        return {
            basePrice,
            recommendedPrice: predictedPrice,
            difference,
            percentChange,
            reason
        };
    }
}

// Create global instance
window.smartPricing = new SmartPricingEngine();

// Auto-initialize on load
window.addEventListener('load', () => {
    if (typeof tf !== 'undefined') {
        window.smartPricing.initializeModel();
    } else {
        console.warn('⚠️ TensorFlow.js not loaded. Smart pricing disabled.');
    }
});
