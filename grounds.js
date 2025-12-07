// supabase is available globally via init-supabase.js

let allGrounds = [];

async function loadGrounds() {
    try {
        const { data: grounds, error } = await supabase
            .from('grounds')
            .select('*')
            .eq('status', 'verified');

        if (error) throw error;

        allGrounds = grounds;
        displayGrounds(allGrounds);
    } catch (error) {
        console.error('Error loading grounds:', error);
        document.getElementById('groundsList').innerHTML = '<p style="text-align:center; color: red;">Error loading grounds. Check console.</p>';
    }
}

function displayGrounds(grounds) {
    const groundsList = document.getElementById('groundsList');
    const noResults = document.getElementById('noResults');

    if (grounds.length === 0) {
        groundsList.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    groundsList.innerHTML = grounds.map(ground => `
        <div class="ground-card">
            <img src="${ground.imageUrl}" alt="${ground.groundName}" class="ground-image" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
            <div class="ground-info">
                <h3>${ground.groundName}</h3>
                <p class="ground-location">📍 ${ground.location}, ${ground.city}</p>
                <p class="ground-price">PKR ${ground.pricePerHour}/hour</p>
                <p class="ground-rating">⭐ ${ground.rating || 'No ratings yet'}</p>
                <p><strong>Type:</strong> ${ground.groundType}</p>
                <span class="ground-status status-verified">✓ Verified</span>
                <div style="margin-top: 1rem;">
                    <a href="booking.html?id=${ground.id}" class="btn btn-primary" style="width: 100%; text-align: center;">Book Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Apply Filters
document.getElementById('applyFilters')?.addEventListener('click', applyFilters);

// Reset Filters
document.getElementById('resetFilters')?.addEventListener('click', () => {
    document.getElementById('searchLocation').value = '';
    document.getElementById('filterGroundType').value = '';
    document.getElementById('filterPriceRange').value = '';
    document.getElementById('filterRating').value = '';
    displayGrounds(allGrounds);
});

// Real-time search on Enter key
document.getElementById('searchLocation')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyFilters();
    }
});

function applyFilters() {
    const searchLocation = document.getElementById('searchLocation').value.toLowerCase().trim();
    const filterGroundType = document.getElementById('filterGroundType').value;
    const filterPriceRange = document.getElementById('filterPriceRange').value;
    const filterRating = document.getElementById('filterRating').value;

    let filtered = allGrounds;

    // Filter by location (search in both location and city fields)
    if (searchLocation) {
        filtered = filtered.filter(g =>
            (g.location && g.location.toLowerCase().includes(searchLocation)) ||
            (g.city && g.city.toLowerCase().includes(searchLocation))
        );
    }

    // Filter by ground type
    if (filterGroundType) {
        filtered = filtered.filter(g => g.groundType === filterGroundType);
    }

    // Filter by price range
    if (filterPriceRange) {
        if (filterPriceRange === '5000+') {
            filtered = filtered.filter(g => g.pricePerHour >= 5000);
        } else {
            const [min, max] = filterPriceRange.split('-').map(Number);
            filtered = filtered.filter(g => g.pricePerHour >= min && g.pricePerHour <= max);
        }
    }

    // Filter by rating
    if (filterRating) {
        const minRating = parseInt(filterRating);
        filtered = filtered.filter(g => (g.rating || 0) >= minRating);
    }

    displayGrounds(filtered);
}

loadGrounds();

