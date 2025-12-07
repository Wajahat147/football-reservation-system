// supabase is available globally via init-supabase.js

// Admin Authentication Logic
const VALID_ADMINS = ['wajahat', 'usman', 'rafay'];
const ADMIN_PASSWORD = 'riphah@69';

document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.toLowerCase().trim();
    const password = document.getElementById('adminPassword').value;

    if (VALID_ADMINS.includes(username) && password === ADMIN_PASSWORD) {
        // Success
        document.getElementById('loginOverlay').style.display = 'none';
        sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
        alert('Invalid credentials. Access denied.');
    }
});

// Check if already logged in (optional, for page refresh)
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('loginOverlay').style.display = 'none';
}


// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');

        if (btn.dataset.tab === 'pending') {
            document.getElementById('pendingGrounds').classList.add('active');
        } else if (btn.dataset.tab === 'verified') {
            document.getElementById('verifiedGrounds').classList.add('active');
        } else if (btn.dataset.tab === 'bookings') {
            document.getElementById('allBookings').classList.add('active');
            loadBookings();
        }
    });
});

async function loadPendingGrounds() {
    try {
        const { data: grounds, error } = await supabase
            .from('grounds')
            .select('*')
            .eq('status', 'pending');

        if (error) throw error;

        const list = document.getElementById('pendingList');

        if (!grounds || grounds.length === 0) {
            list.innerHTML = '<p>No pending submissions</p>';
            return;
        }

        list.innerHTML = grounds.map(ground => `
            <div class="admin-card">
                <h4>${ground.groundName}</h4>
                <p><strong>Owner:</strong> ${ground.ownerName} (${ground.ownerEmail})</p>
                <p><strong>Location:</strong> ${ground.location}, ${ground.city}</p>
                <p><strong>Price:</strong> PKR ${ground.pricePerHour}/hour</p>
                <p><strong>Type:</strong> ${ground.groundType}</p>
                <div class="admin-actions">
                    <button class="btn btn-success" onclick="window.approveGround('${ground.id}')">Approve</button>
                    <button class="btn btn-danger" onclick="window.rejectGround('${ground.id}')">Reject</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('pendingList').innerHTML = '<p>Error loading pending grounds</p>';
    }
}

async function loadVerifiedGrounds() {
    try {
        const { data: grounds, error } = await supabase
            .from('grounds')
            .select('*')
            .eq('status', 'verified');

        if (error) throw error;

        const list = document.getElementById('verifiedList');

        if (!grounds || grounds.length === 0) {
            list.innerHTML = '<p>No verified grounds yet</p>';
            return;
        }

        list.innerHTML = grounds.map(ground => `
            <div class="admin-card">
                <h4>${ground.groundName}</h4>
                <p><strong>Location:</strong> ${ground.location}, ${ground.city}</p>
                <p><strong>Price:</strong> PKR ${ground.pricePerHour}/hour</p>
                <p><strong>Rating:</strong> ⭐ ${ground.rating || 'No ratings'}</p>
                <div class="admin-actions">
                    <button class="btn btn-danger" onclick="window.deleteGround('${ground.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('verifiedList').innerHTML = '<p>Error loading verified grounds</p>';
    }
}

async function loadBookings() {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*');

        if (error) throw error;

        const list = document.getElementById('bookingsList');

        if (!bookings || bookings.length === 0) {
            list.innerHTML = '<p>No bookings yet</p>';
            return;
        }

        list.innerHTML = bookings.map(booking => `
            <div class="admin-card">
                <h4>Booking by ${booking.playerName}</h4>
                <p><strong>Date:</strong> ${booking.bookingDate}</p>
                <p><strong>Time:</strong> ${booking.timeSlot}</p>
                <p><strong>Contact:</strong> ${booking.playerEmail} | ${booking.playerPhone}</p>
                <p><strong>Team Size:</strong> ${booking.teamSize || 'Not specified'}</p>
                <p><strong>Status:</strong> <span style="color: green;">${booking.status}</span></p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('bookingsList').innerHTML = '<p>Error loading bookings</p>';
    }
}

window.approveGround = async (id) => {
    try {
        const { error } = await supabase
            .from('grounds')
            .update({ status: 'verified' })
            .eq('id', id);

        if (error) throw error;

        alert('Ground approved successfully!');
        loadPendingGrounds();
        loadVerifiedGrounds();
    } catch (error) {
        console.error('Error:', error);
        alert('Error approving ground');
    }
};

window.rejectGround = async (id) => {
    if (confirm('Are you sure you want to reject this ground?')) {
        try {
            const { error } = await supabase
                .from('grounds')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Ground rejected and deleted');
            loadPendingGrounds();
        } catch (error) {
            console.error('Error:', error);
            alert('Error rejecting ground');
        }
    }
};

window.deleteGround = async (id) => {
    if (confirm('Are you sure you want to delete this ground permanently?')) {
        try {
            const { error } = await supabase
                .from('grounds')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Ground deleted successfully');
            loadVerifiedGrounds();
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting ground');
        }
    }
};

// Initial load
loadPendingGrounds();
loadVerifiedGrounds();

// Logout Button Functionality
document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById("logoutBtn");
    const loginOverlay = document.getElementById("loginOverlay");
    
    // Show logout button if logged in
    if (sessionStorage.getItem("adminLoggedIn") === "true") {
        if (logoutBtn) logoutBtn.style.display = "block";
        if (loginOverlay) loginOverlay.style.display = "none";
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to logout?")) {
                sessionStorage.removeItem("adminLoggedIn");
                sessionStorage.removeItem("adminUsername");
                window.location.reload();
            }
        });
    }
    
    // Update login form to show logout button on success
    const loginForm = document.getElementById("adminLoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function() {
            setTimeout(function() {
                if (sessionStorage.getItem("adminLoggedIn") === "true") {
                    if (logoutBtn) logoutBtn.style.display = "block";
                }
            }, 100);
        });
    }
});

