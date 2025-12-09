// OTP Service for Email Verification
// This service handles OTP generation, sending, and verification

class OTPService {
    constructor() {
        this.otpStore = new Map(); // Store OTPs temporarily (email -> {otp, expiry, verified})
        this.OTP_EXPIRY_MINUTES = 10; // OTP valid for 10 minutes
    }

    // Generate a 6-digit OTP
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP to email (using a simple email service)
    async sendOTP(email, purpose = 'verification') {
        try {
            const otp = this.generateOTP();
            const expiry = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

            // Store OTP
            this.otpStore.set(email, {
                otp: otp,
                expiry: expiry,
                verified: false,
                purpose: purpose
            });

            // Send email using EmailJS or similar service
            // For now, we'll use a simple alert/console for demonstration
            // In production, integrate with EmailJS, SendGrid, or Supabase Edge Functions

            console.log(`OTP for ${email}: ${otp} (Valid until ${expiry.toLocaleTimeString()})`);

            // Simulate sending email
            await this.sendEmailViaService(email, otp, purpose);

            return {
                success: true,
                message: `OTP sent to ${email}. Please check your email.`,
                expiryMinutes: this.OTP_EXPIRY_MINUTES
            };

        } catch (error) {
            console.error('Error sending OTP:', error);
            return {
                success: false,
                message: 'Failed to send OTP. Please try again.'
            };
        }
    }

    // Send email using EmailJS
    async sendEmailViaService(email, otp, purpose) {
        const purposeText = purpose === 'booking' ? 'booking confirmation' : 'ground registration';

        // OPTION 1: Using EmailJS (Recommended - Free & Easy)
        // Sign up at https://www.emailjs.com/ and get your credentials
        // Uncomment and configure the following:

        /*
        try {
            const serviceID = 'YOUR_SERVICE_ID'; // Get from EmailJS dashboard
            const templateID = 'YOUR_TEMPLATE_ID'; // Get from EmailJS dashboard
            const publicKey = 'YOUR_PUBLIC_KEY'; // Get from EmailJS dashboard

            const templateParams = {
                to_email: email,
                otp_code: otp,
                purpose: purposeText,
                expiry_minutes: this.OTP_EXPIRY_MINUTES
            };

            await emailjs.send(serviceID, templateID, templateParams, publicKey);
            return true;
        } catch (error) {
            console.error('EmailJS error:', error);
            throw error;
        }
        */

        // OPTION 2: Using Supabase Edge Function (if you set it up)
        /*
        try {
            const { data, error } = await _supabase.functions.invoke('send-otp-email', {
                body: { email, otp, purpose: purposeText, expiryMinutes: this.OTP_EXPIRY_MINUTES }
            });
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Supabase function error:', error);
            throw error;
        }
        */

        // TEMPORARY: For testing without email service
        // This shows OTP on screen - REMOVE when you set up email service
        await new Promise(resolve => setTimeout(resolve, 500));

        // Display OTP in console for testing
        console.log(`📧 OTP for ${email}: ${otp}`);

        // Show notification instead of alert
        this.showOTPNotification(email, otp, purposeText);

        return true;
    }

    // Show OTP notification (temporary - for testing)
    showOTPNotification(email, otp, purpose) {
        // Create a better notification instead of alert
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                📧 Email Verification
            </div>
            <div style="margin-bottom: 10px;">
                Your OTP for ${purpose}:
            </div>
            <div style="font-size: 2rem; font-weight: bold; letter-spacing: 5px; text-align: center; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin: 10px 0;">
                ${otp}
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
                Valid for ${this.OTP_EXPIRY_MINUTES} minutes
            </div>
            <div style="font-size: 0.8rem; margin-top: 10px; opacity: 0.7;">
                ⚠️ In production, this will be sent to ${email}
            </div>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
            ">×</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 15000);
    }

    // Verify OTP
    verifyOTP(email, enteredOTP) {
        const stored = this.otpStore.get(email);

        if (!stored) {
            return {
                success: false,
                message: 'No OTP found for this email. Please request a new OTP.'
            };
        }

        // Check if OTP expired
        if (new Date() > stored.expiry) {
            this.otpStore.delete(email);
            return {
                success: false,
                message: 'OTP has expired. Please request a new OTP.'
            };
        }

        // Check if OTP matches
        if (stored.otp !== enteredOTP.trim()) {
            return {
                success: false,
                message: 'Invalid OTP. Please try again.'
            };
        }

        // Mark as verified
        stored.verified = true;
        this.otpStore.set(email, stored);

        return {
            success: true,
            message: 'Email verified successfully!'
        };
    }

    // Check if email is verified
    isVerified(email) {
        const stored = this.otpStore.get(email);
        return stored && stored.verified && new Date() <= stored.expiry;
    }

    // Clear OTP after successful submission
    clearOTP(email) {
        this.otpStore.delete(email);
    }

    // Resend OTP
    async resendOTP(email, purpose = 'verification') {
        // Clear existing OTP
        this.otpStore.delete(email);
        // Send new OTP
        return await this.sendOTP(email, purpose);
    }
}

// Create global instance
window.otpService = new OTPService();
