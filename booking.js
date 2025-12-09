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
            // Set ground image as hero background
            const heroSection = document.getElementById('groundHero');
            heroSection.style.backgroundImage = `url('${ground.imageUrl}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';

            // Update hero content with ground details
            document.getElementById('groundHeroContent').innerHTML = `
                <h1>${ground.groundName}</h1>
                <div class="ground-details-grid">
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <div>
                            <strong>Location</strong>
                            <p>${ground.location}, ${ground.city}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">💰</span>
                        <div>
                            <strong>Price</strong>
                            <p>PKR ${ground.pricePerHour}/hour</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⚽</span>
                        <div>
                            <strong>Type</strong>
                            <p>${ground.groundType}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📏</span>
                        <div>
                            <strong>Dimensions</strong>
                            <p>${ground.dimensions}</p>
                        </div>
                    </div>
                </div>
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
        // Get ground details
        const { data: ground, error: groundError } = await supabase
            .from('grounds')
            .select('*')
            .eq('id', groundId)
            .single();

        if (groundError) throw groundError;

        // Save booking directly (no payment fields)
        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select();

        if (error) throw error;

        console.log('✅ Booking saved successfully');

        // Clear OTP after successful booking
        otpService.clearOTP(currentEmail);

        // Send notification if available
        if (window.pwaUtils) {
            window.pwaUtils.showToast('Booking confirmed! 🎉', 'success');
        }

        // Update success message with payment info
        const successDiv = document.getElementById('bookingSuccess');
        successDiv.innerHTML = `
            <div class="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <div style="background: rgba(243, 156, 18, 0.1); padding: 2rem; border-radius: 12px; margin: 2rem 0;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">📋 Booking Details</h3>
                <p style="margin: 0.5rem 0;"><strong>Ground:</strong> ${ground.groundName}</p>
                <p style="margin: 0.5rem 0;"><strong>Date:</strong> ${bookingData.bookingDate}</p>
                <p style="margin: 0.5rem 0;"><strong>Time:</strong> ${bookingData.timeSlot}</p>
                <p style="margin: 0.5rem 0;"><strong>Amount:</strong> PKR ${ground.pricePerHour}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px; margin: 2rem 0; border: 1px solid #e9ecef; text-align: left;">
                <h3 style="color: #2c3e50; margin-bottom: 1.5rem; text-align: center;">💳 Payment Options</h3>
                
                <!-- Account Details -->
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; flex-wrap: wrap;">
                    <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); flex: 1; min-width: 250px; text-align: center;">
                        <span style="font-size: 2rem; margin-bottom: 0.5rem; display: block;">📱</span>
                        <h4 style="margin: 0.5rem 0; color: #f39c12;">NayaPay / SadaPay</h4>
                        <p style="font-size: 1.25rem; font-weight: bold; color: #2c3e50; margin: 0.5rem 0;">0313 1563820</p>
                        <p style="font-size: 0.9rem; color: #7f8c8d;">Account Title: Wajahat</p>
                    </div>
                </div>

                <!-- Verification Form -->
                <div style="max-width: 400px; margin: 0 auto;">
                    <h4 style="margin-bottom: 1rem; color: #2c3e50;">Submit Payment Proof</h4>
                    <p style="font-size: 0.9rem; color: #7f8c8d; margin-bottom: 1rem;">After sending payment, please enter the reference below:</p>
                    
                    <div class="form-group">
                        <label for="trxId" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Transaction ID (Trx ID)</label>
                        <input type="text" id="trxId" placeholder="e.g. 123456789" style="width: 100%; padding: 0.8rem; border: 1px solid #ced4da; border-radius: 8px; margin-bottom: 1rem;">
                    </div>

                    <div class="form-group">
                        <label for="paymentScreenshot" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Payment Screenshot</label>
                        <input type="file" id="paymentScreenshot" accept="image/*" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
                    </div>

                    <button onclick="window.submitPaymentProof('${data[0].id}')" class="btn btn-primary" style="width: 100%;">Submit Payment Details</button>
                    <p id="uploadStatus" style="margin-top: 1rem; text-align: center; font-size: 0.9rem;"></p>
                </div>
            </div>

            <p style="color: var(--gray); margin: 1rem 0;">A confirmation email will be sent to ${bookingData.playerEmail}</p>
            <a href="grounds.html" class="btn btn-secondary" style="margin-top: 1rem;">Back to Grounds</a>
        `;

        document.getElementById('bookingForm').style.display = 'none';
        successDiv.style.display = 'block';

    } catch (error) {
        console.error('❌ Error creating booking:', error);
        alert('Error creating booking: ' + error.message);
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Booking';
    }
});

// Function to handle payment proof submission
window.submitPaymentProof = async (bookingId) => {
    const trxId = document.getElementById('trxId').value;
    const screenshot = document.getElementById('paymentScreenshot').files[0];
    const statusMsg = document.getElementById('uploadStatus');

    if (!trxId) {
        alert('Please enter a Transaction ID');
        return;
    }

    try {
        statusMsg.style.color = 'blue';
        statusMsg.textContent = 'Uploading proof...';

        let screenshotUrl = null;

        // 1. Upload Screenshot if selected
        if (screenshot) {
            const fileExt = screenshot.name.split('.').pop();
            const fileName = `${bookingId}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('payment-proofs')
                .upload(filePath, screenshot);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw new Error('Failed to upload image: ' + uploadError.message);
            }

            // Get Public URL
            const { data: publicData } = supabase.storage
                .from('payment-proofs')
                .getPublicUrl(filePath);

            screenshotUrl = publicData.publicUrl;
        }

        statusMsg.textContent = 'Saving details...';

        // 2. Update Booking with Transaction ID and Screenshot URL
        const updateData = {
            "transactionId": trxId,
            status: 'pending_verification'
        };

        if (screenshotUrl) {
            updateData["paymentScreenshotUrl"] = screenshotUrl;
        }

        const { error } = await supabase
            .from('bookings')
            .update(updateData)
            .eq('id', bookingId);

        if (error) throw error;

        statusMsg.style.color = 'green';
        statusMsg.innerHTML = '✅ Payment details submitted successfully! We will verify and confirm shortly.';

        // Disable inputs
        document.getElementById('trxId').disabled = true;
        document.getElementById('paymentScreenshot').disabled = true;
        document.querySelector('button[onclick^="window.submitPaymentProof"]').disabled = true;
        document.querySelector('button[onclick^="window.submitPaymentProof"]').textContent = 'Submitted';

    } catch (error) {
        console.error('Error submitting payment:', error);
        statusMsg.style.color = 'red';
        statusMsg.textContent = 'Error: ' + error.message;

        if (error.message.includes('bucket not found')) {
            alert('System Setup Required: Please create a storage bucket named "payment-proofs" in Supabase dashboard.');
        } else if (error.message.includes('column "transactionId"')) {
            alert('Database update required: Please run the "add-payment-columns.sql" script.');
        }
    }
};

loadGroundDetails();
