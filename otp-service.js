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

    // Simulate email sending (replace with actual email service)
    async sendEmailViaService(email, otp, purpose) {
        // For demonstration, we'll show the OTP in an alert
        // In production, use EmailJS, SendGrid, or Supabase Edge Functions

        const purposeText = purpose === 'booking' ? 'booking confirmation' : 'ground registration';

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show OTP in alert for testing (remove in production)
        alert(`📧 Email Verification\n\nYour OTP for ${purposeText} is: ${otp}\n\nThis OTP will expire in ${this.OTP_EXPIRY_MINUTES} minutes.\n\n(In production, this will be sent to ${email})`);

        return true;
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
