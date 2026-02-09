const API_URL = '/api';
let currentUser = JSON.parse(localStorage.getItem('svms_user')) || null;

// DOM Elements
const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const dynamicContent = document.getElementById('dynamic-content');
const viewTitle = document.getElementById('view-title');
const navContainer = document.getElementById('sidebar-nav');
const userDisplay = document.getElementById('user-display');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

// Initial Setup
const init = () => {
    if (currentUser) {
        showDashboard();
    } else {
        showAuth();
    }
};

const showAuth = () => {
    authView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
};

const showDashboard = () => {
    authView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    userDisplay.innerText = currentUser.username;
    renderSidebar();
    loadDashboardStats();
};

const renderSidebar = () => {
    const isAdmin = currentUser.role === 'admin';
    const items = isAdmin ? [
        { id: 'dashboard', label: 'Overview', icon: '📊' },
        { id: 'vendors', label: 'Vendors', icon: '👥' },
        { id: 'products', label: 'Products', icon: '📦' },
        { id: 'payments', label: 'Payments', icon: '💳' },
        { id: 'analytics', label: 'Performance', icon: '📈' }
    ] : [
        { id: 'dashboard', label: 'Overview', icon: '📊' },
        { id: 'my-products', label: 'My Products', icon: '📦' },
        { id: 'my-payments', label: 'Payments', icon: '💳' },
        { id: 'profile', label: 'Profile', icon: '👤' }
    ];

    navContainer.innerHTML = items.map(item => `
        <div class="nav-item ${item.id === 'dashboard' ? 'active' : ''}" onclick="navigateTo('${item.id}')">
            <span>${item.icon}</span> ${item.label}
        </div>
    `).join('');
};

const navigateTo = (viewId) => {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event?.currentTarget?.classList?.add('active');

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('active');
    }

    switch (viewId) {
        case 'dashboard': loadDashboardStats(); break;
        case 'vendors': renderVendorsList(); break;
        case 'payments': renderPaymentsList(); break;
        // ... more views
    }
};

// Auth Actions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            currentUser = data;
            localStorage.setItem('svms_user', JSON.stringify(data));
            showDashboard();
        } else {
            const errorMsg = await res.text();
            authError.innerText = errorMsg || 'Invalid credentials';
            authError.classList.remove('hidden');
        }
    } catch (err) {
        authError.innerText = 'Server connection failed';
        authError.classList.remove('hidden');
    }
});

document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('svms_user');
    currentUser = null;
    showAuth();
};

// Mock Views (Initial)
const loadDashboardStats = () => {
    viewTitle.innerText = 'System Overview';
    dynamicContent.innerHTML = `
        <div class="stats-grid animate-fade">
            <div class="glass stat-card">
                <div class="label">Total Vendors</div>
                <div class="value">24</div>
            </div>
            <div class="glass stat-card">
                <div class="label">Active Contracts</div>
                <div class="value">12</div>
            </div>
            <div class="glass stat-card">
                <div class="label">Pending Payments</div>
                <div class="value">₹12,450</div>
                <div style="color: var(--warning); font-size: 0.75rem;">Due this week</div>
            </div>
            <div class="glass stat-card">
                <div class="label">System Score</div>
                <div class="value" style="color: var(--success);">94.2%</div>
            </div>
        </div>
        
        <div class="glass animate-fade" style="padding: 2rem; margin-top: 1rem;">
            <h3>Recent Activity</h3>
            <p style="color: var(--text-muted); margin-top:1rem;">Activity stream will appear here...</p>
        </div>
    `;
};

const renderVendorsList = async () => {
    viewTitle.innerText = 'Vendor Management';
    dynamicContent.innerHTML = `
        <div class="glass animate-fade table-container" style="padding: 1.5rem;">
            <table>
                <thead>
                    <tr>
                        <th>Vendor Name</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="vendor-table-body">
                    <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    // In real app, fetch from API
    // const res = await fetch(`${API_URL}/vendors`);
    // const data = await res.json();

    // For demo, show mock row if empty
    document.getElementById('vendor-table-body').innerHTML = `
        <tr>
            <td>Apex Solutions</td>
            <td><span class="badge badge-paid">Active</span></td>
            <td>contact@apex.com</td>
            <td>8.5</td>
            <td><button class="btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button></td>
        </tr>
    `;
};

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.onclick = () => {
        sidebar.classList.toggle('active');
    };
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 &&
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

init();
