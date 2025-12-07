// supabase is available globally via init-supabase.js

// OTP Verification State for Owner
let isOwnerEmailVerified = false;
let currentOwnerEmail = '';

// Send OTP Button for Owner
document.getElementById('sendOwnerOtpBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('ownerEmail').value.trim();

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    const sendBtn = document.getElementById('sendOwnerOtpBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    try {
        const result = await otpService.sendOTP(email, 'ground registration');

        if (result.success) {
            currentOwnerEmail = email;
            document.getElementById('ownerOtpSection').style.display = 'block';
            document.getElementById('ownerEmail').disabled = true;
            sendBtn.textContent = 'OTP Sent ✓';

            // Show success message
            const otpStatus = document.getElementById('ownerOtpStatus');
            otpStatus.textContent = `✅ ${result.message}`;
            otpStatus.style.color = 'var(--success)';
        } else {
            alert(result.message);
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send OTP';
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send OTP';
    }
});

// Verify OTP Button for Owner
document.getElementById('verifyOwnerOtpBtn')?.addEventListener('click', () => {
    const otpInput = document.getElementById('ownerOtpInput').value.trim();

    if (!otpInput || otpInput.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    const result = otpService.verifyOTP(currentOwnerEmail, otpInput);
    const otpStatus = document.getElementById('ownerOtpStatus');

    if (result.success) {
        isOwnerEmailVerified = true;
        otpStatus.textContent = `✅ ${result.message}`;
        otpStatus.style.color = 'var(--success)';

        // Enable submit button
        document.getElementById('submitGroundBtn').disabled = false;
        document.getElementById('ownerVerificationWarning').style.display = 'none';

        // Disable OTP inputs
        document.getElementById('ownerOtpInput').disabled = true;
        document.getElementById('verifyOwnerOtpBtn').disabled = true;
        document.getElementById('resendOwnerOtpBtn').disabled = true;

        // Show success feedback
        document.getElementById('verifyOwnerOtpBtn').textContent = 'Verified ✓';
        document.getElementById('verifyOwnerOtpBtn').style.background = 'var(--success)';
    } else {
        otpStatus.textContent = `❌ ${result.message}`;
        otpStatus.style.color = 'var(--danger)';
    }
});

// Resend OTP Button for Owner
document.getElementById('resendOwnerOtpBtn')?.addEventListener('click', async () => {
    const resendBtn = document.getElementById('resendOwnerOtpBtn');
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    try {
        const result = await otpService.resendOTP(currentOwnerEmail, 'ground registration');
        const otpStatus = document.getElementById('ownerOtpStatus');

        if (result.success) {
            otpStatus.textContent = `✅ ${result.message}`;
            otpStatus.style.color = 'var(--success)';
            document.getElementById('ownerOtpInput').value = '';
            resendBtn.textContent = 'Resend';
            resendBtn.disabled = false;
        } else {
            otpStatus.textContent = `❌ ${result.message}`;
            otpStatus.style.color = 'var(--danger)';
            resendBtn.textContent = 'Resend';
            resendBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error resending OTP:', error);
        alert('Failed to resend OTP. Please try again.');
        resendBtn.textContent = 'Resend';
        resendBtn.disabled = false;
    }
});

document.getElementById('groundSubmissionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if email is verified
    if (!isOwnerEmailVerified) {
        alert('⚠️ Please verify your email with OTP before submitting');
        return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const facilities = document.getElementById('facilities').value;
    const facilitiesArray = facilities ? facilities.split(',').map(f => f.trim()) : [];

    const groundData = {
        ownerName: document.getElementById('ownerName').value,
        ownerEmail: document.getElementById('ownerEmail').value,
        ownerPhone: document.getElementById('ownerPhone').value,
        groundName: document.getElementById('groundName').value,
        location: document.getElementById('location').value,
        city: document.getElementById('city').value,
        groundType: document.getElementById('groundType').value,
        dimensions: document.getElementById('dimensions').value,
        pricePerHour: parseInt(document.getElementById('pricePerHour').value),
        facilities: facilitiesArray,
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
    };

    try {
        const { error } = await supabase
            .from('grounds')
            .insert([groundData]);

        if (error) throw error;

        // Clear OTP after successful submission
        otpService.clearOTP(currentOwnerEmail);

        document.getElementById('groundSubmissionForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting ground: ' + error.message);
        submitButton.disabled = false;
        submitButton.textContent = 'Submit for Approval';
    }
});
