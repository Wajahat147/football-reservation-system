// supabase is available globally via init-supabase.js

document.getElementById('groundSubmissionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

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

        document.getElementById('groundSubmissionForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting ground: ' + error.message);
        submitButton.disabled = false;
        submitButton.textContent = 'Submit for Approval';
    }
});
