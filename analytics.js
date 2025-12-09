// Advanced Analytics Dashboard
// Real-time analytics and insights

class AnalyticsDashboard {
    constructor() {
        this.metrics = {
            totalBookings: 0,
            totalRevenue: 0,
            activeUsers: 0,
            popularGrounds: [],
            peakHours: [],
            conversionRate: 0
        };
    }

    // Fetch all analytics data
    async fetchAnalytics(startDate, endDate) {
        try {
            const { data: bookings, error } = await supabase
                .from('bookings')
                .select('*')
                .gte('createdAt', startDate)
                .lte('createdAt', endDate);

            if (error) throw error;

            this.calculateMetrics(bookings);
            return this.metrics;
        } catch (error) {
            console.error('❌ Error fetching analytics:', error);
            return null;
        }
    }

    // Calculate key metrics
    calculateMetrics(bookings) {
        this.metrics.totalBookings = bookings.length;

        // Calculate revenue
        this.metrics.totalRevenue = bookings.reduce((sum, booking) => {
            return sum + (booking.amount || 0);
        }, 0);

        // Find popular grounds
        const groundCounts = {};
        bookings.forEach(booking => {
            groundCounts[booking.groundId] = (groundCounts[booking.groundId] || 0) + 1;
        });

        this.metrics.popularGrounds = Object.entries(groundCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => ({ groundId: id, bookings: count }));

        // Find peak hours
        const hourCounts = {};
        bookings.forEach(booking => {
            const hour = parseInt(booking.timeSlot.split(':')[0]);
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        this.metrics.peakHours = Object.entries(hourCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([hour, count]) => ({ hour: parseInt(hour), bookings: count }));
    }

    // Generate revenue chart data
    getRevenueChartData(bookings) {
        const dailyRevenue = {};

        bookings.forEach(booking => {
            const date = new Date(booking.bookingDate).toLocaleDateString();
            dailyRevenue[date] = (dailyRevenue[date] || 0) + (booking.amount || 0);
        });

        return {
            labels: Object.keys(dailyRevenue),
            data: Object.values(dailyRevenue)
        };
    }

    // Generate bookings trend data
    getBookingsTrendData(bookings) {
        const dailyBookings = {};

        bookings.forEach(booking => {
            const date = new Date(booking.bookingDate).toLocaleDateString();
            dailyBookings[date] = (dailyBookings[date] || 0) + 1;
        });

        return {
            labels: Object.keys(dailyBookings),
            data: Object.values(dailyBookings)
        };
    }

    // Get user retention rate
    async getUserRetention() {
        try {
            const { data: bookings } = await supabase
                .from('bookings')
                .select('playerEmail, createdAt')
                .order('createdAt', { ascending: true });

            const userBookings = {};
            bookings.forEach(booking => {
                if (!userBookings[booking.playerEmail]) {
                    userBookings[booking.playerEmail] = [];
                }
                userBookings[booking.playerEmail].push(booking.createdAt);
            });

            const returningUsers = Object.values(userBookings).filter(dates => dates.length > 1).length;
            const totalUsers = Object.keys(userBookings).length;

            return {
                retentionRate: ((returningUsers / totalUsers) * 100).toFixed(2),
                returningUsers,
                totalUsers
            };
        } catch (error) {
            console.error('❌ Error calculating retention:', error);
            return null;
        }
    }

    // Render analytics dashboard
    async renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const analytics = await this.fetchAnalytics(startDate, endDate);
        const retention = await this.getUserRetention();

        container.innerHTML = `
            <div class="analytics-grid">
                <div class="metric-card">
                    <div class="metric-icon">📊</div>
                    <div class="metric-value">${analytics.totalBookings}</div>
                    <div class="metric-label">Total Bookings</div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon">💰</div>
                    <div class="metric-value">PKR ${analytics.totalRevenue.toLocaleString()}</div>
                    <div class="metric-label">Total Revenue</div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon">👥</div>
                    <div class="metric-value">${retention.totalUsers}</div>
                    <div class="metric-label">Total Users</div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon">🔄</div>
                    <div class="metric-value">${retention.retentionRate}%</div>
                    <div class="metric-label">Retention Rate</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-card">
                    <h3>📈 Popular Grounds</h3>
                    <div id="popularGroundsChart"></div>
                </div>

                <div class="chart-card">
                    <h3>⏰ Peak Hours</h3>
                    <div id="peakHoursChart"></div>
                </div>
            </div>
        `;

        this.renderPopularGrounds(analytics.popularGrounds);
        this.renderPeakHours(analytics.peakHours);
    }

    // Render popular grounds chart
    renderPopularGrounds(grounds) {
        const container = document.getElementById('popularGroundsChart');
        if (!container) return;

        container.innerHTML = grounds.map(ground => `
            <div class="bar-chart-item">
                <div class="bar-label">Ground #${ground.groundId}</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${(ground.bookings / grounds[0].bookings) * 100}%">
                        ${ground.bookings}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render peak hours chart
    renderPeakHours(hours) {
        const container = document.getElementById('peakHoursChart');
        if (!container) return;

        container.innerHTML = hours.map(hour => `
            <div class="bar-chart-item">
                <div class="bar-label">${hour.hour}:00 - ${hour.hour + 1}:00</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${(hour.bookings / hours[0].bookings) * 100}%">
                        ${hour.bookings}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Real-time updates
    subscribeToRealTimeUpdates(callback) {
        const channel = supabase
            .channel('analytics-updates')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                (payload) => {
                    console.log('📊 New booking event:', payload);
                    callback(payload);
                }
            )
            .subscribe();

        return channel;
    }
}

// Create global instance
window.analytics = new AnalyticsDashboard();
