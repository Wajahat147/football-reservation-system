// supabase is available globally via init-supabase.js

const urlParams = new URLSearchParams(window.location.search);
const groundId = urlParams.get('id');

async function loadGroundDetails() {
    if (!groundId) {
        alert('No ground selected');
        window.location.href = 'grounds.html';
        return;
    }

    try {
        const { data: ground, error } = await supabase
            .from('grounds')
            .select('*')
            .eq('id', groundId)
            .single();

        if (error) throw error;

        if (ground) {
            document.getElementById('groundDetails').innerHTML = `
                <img src="${ground.imageUrl}" alt="${ground.groundName}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                <h2>${ground.groundName}</h2>
                <p><strong>Location:</strong> ${ground.location}, ${ground.city}</p>
                <p><strong>Price:</strong> PKR ${ground.pricePerHour}/hour</p>
                <p><strong>Type:</strong> ${ground.groundType}</p>
                <p><strong>Dimensions:</strong> ${ground.dimensions}</p>
            `;
        } else {
            alert('Ground not found');
            window.location.href = 'grounds.html';
        }
    } catch (error) {
        console.error('Error loading ground:', error);
        alert('Error loading ground details: ' + error.message);
    }
}

// OTP Verification State
let isEmailVerified = false;
let currentEmail = '';

// Send OTP Button
document.getElementById('sendOtpBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('playerEmail').value.trim();

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    const sendBtn = document.getElementById('sendOtpBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    try {
        const result = await otpService.sendOTP(email, 'booking');

        if (result.success) {
            currentEmail = email;
            document.getElementById('otpSection').style.display = 'block';
            document.getElementById('playerEmail').disabled = true;
            sendBtn.textContent = 'OTP Sent ✓';

            // Show success message
            const otpStatus = document.getElementById('otpStatus');
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

// Verify OTP Button
document.getElementById('verifyOtpBtn')?.addEventListener('click', () => {
    const otpInput = document.getElementById('otpInput').value.trim();

    if (!otpInput || otpInput.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    const result = otpService.verifyOTP(currentEmail, otpInput);
    const otpStatus = document.getElementById('otpStatus');

    if (result.success) {
        isEmailVerified = true;
        otpStatus.textContent = `✅ ${result.message}`;
        otpStatus.style.color = 'var(--success)';

        // Enable booking button
        document.getElementById('confirmBookingBtn').disabled = false;
        document.getElementById('verificationWarning').style.display = 'none';

        // Disable OTP inputs
        document.getElementById('otpInput').disabled = true;
        document.getElementById('verifyOtpBtn').disabled = true;
        document.getElementById('resendOtpBtn').disabled = true;

        // Show success feedback
        document.getElementById('verifyOtpBtn').textContent = 'Verified ✓';
        document.getElementById('verifyOtpBtn').style.background = 'var(--success)';
    } else {
        otpStatus.textContent = `❌ ${result.message}`;
        otpStatus.style.color = 'var(--danger)';
    }
});

// Resend OTP Button
document.getElementById('resendOtpBtn')?.addEventListener('click', async () => {
    const resendBtn = document.getElementById('resendOtpBtn');
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    try {
        const result = await otpService.resendOTP(currentEmail, 'booking');
        const otpStatus = document.getElementById('otpStatus');

        if (result.success) {
            otpStatus.textContent = `✅ ${result.message}`;
            otpStatus.style.color = 'var(--success)';
            document.getElementById('otpInput').value = '';
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

document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if email is verified
    if (!isEmailVerified) {
        alert('⚠️ Please verify your email with OTP before booking');
        return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    const bookingData = {
        groundId: parseInt(groundId),
        playerName: document.getElementById('playerName').value,
        playerEmail: document.getElementById('playerEmail').value,
        playerPhone: document.getElementById('playerPhone').value,
        bookingDate: document.getElementById('bookingDate').value,
        timeSlot: document.getElementById('timeSlot').value,
        teamSize: parseInt(document.getElementById('teamSize').value) || 0,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    console.log('Attempting to save booking:', bookingData);

    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select();

        if (error) throw error;

        console.log('✅ Booking saved successfully');

        // Clear OTP after successful booking
        otpService.clearOTP(currentEmail);

        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('bookingSuccess').style.display = 'block';
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        alert('Error creating booking: ' + error.message);
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Booking';
    }
});

loadGroundDetails();

