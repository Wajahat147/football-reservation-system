// Delete Booking Function
window.deleteBooking = async (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Booking deleted successfully');
            loadBookings();
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting booking: ' + error.message);
        }
    }
};

// Enhanced Load Bookings with Past Bookings
async function loadBookingsEnhanced() {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .order('bookingDate', { ascending: false });

        if (error) throw error;

        const list = document.getElementById('bookingsList');

        if (!bookings || bookings.length === 0) {
            list.innerHTML = '<p>No bookings yet</p>';
            return;
        }

        // Separate active and past bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate >= today;
        });

        const pastBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate < today;
        });

        // Display active and past bookings
        list.innerHTML = `
            <div style="margin-bottom: 3rem;">
                <h3 style="color: var(--primary); margin-bottom: 1.5rem; font-size: 1.5rem;">📅 Active Bookings (${activeBookings.length})</h3>
                ${activeBookings.length === 0 ? '<p style="color: var(--gray);">No active bookings</p>' : activeBookings.map(booking => `
                    <div class="admin-card" style="border-left: 4px solid var(--success);">
                        <h4>${booking.playerName}</h4>
                        <p><strong>📅 Date:</strong> ${booking.bookingDate}</p>
                        <p><strong>⏰ Time:</strong> ${booking.timeSlot}</p>
                        <p><strong>📧 Email:</strong> ${booking.playerEmail}</p>
                        <p><strong>📱 Phone:</strong> ${booking.playerPhone}</p>
                        <p><strong>👥 Team Size:</strong> ${booking.teamSize || 'Not specified'}</p>
                        <p><strong>✅ Status:</strong> <span style="color: var(--success); font-weight: 600;">${booking.status}</span></p>
                        <div class="admin-actions" style="margin-top: 1rem;">
                            <button class="btn btn-danger" onclick="window.deleteBooking('${booking.id}')">🗑️ Delete Booking</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div>
                <h3 style="color: var(--gray); margin-bottom: 1.5rem; font-size: 1.5rem;">📜 Past Bookings (${pastBookings.length})</h3>
                ${pastBookings.length === 0 ? '<p style="color: var(--gray);">No past bookings</p>' : pastBookings.map(booking => `
                    <div class="admin-card" style="opacity: 0.7; background: #f8f9fa; border-left: 4px solid var(--gray);">
                        <h4>${booking.playerName} <span style="color: red; font-size: 0.9rem;">(Expired)</span></h4>
                        <p><strong>📅 Date:</strong> ${booking.bookingDate}</p>
                        <p><strong>⏰ Time:</strong> ${booking.timeSlot}</p>
                        <p><strong>📧 Email:</strong> ${booking.playerEmail}</p>
                        <p><strong>📱 Phone:</strong> ${booking.playerPhone}</p>
                        <p><strong>👥 Team Size:</strong> ${booking.teamSize || 'Not specified'}</p>
                        <div class="admin-actions" style="margin-top: 1rem;">
                            <button class="btn btn-danger" onclick="window.deleteBooking('${booking.id}')">🗑️ Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('bookingsList').innerHTML = '<p style="color: var(--danger);">Error loading bookings: ' + error.message + '</p>';
    }
}

// Override the original loadBookings function
window.loadBookings = loadBookingsEnhanced;

console.log('✅ Enhanced admin features loaded: Delete bookings + Past bookings');
