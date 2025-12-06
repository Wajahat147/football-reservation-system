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

document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

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
