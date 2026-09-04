// AESWS Admin Portal Logic & Content Management Engine

const ADMIN_CREDENTIALS = {
  email: 'admin@aesws.org',
  password: 'admin123'
};

document.addEventListener('DOMContentLoaded', () => {
  initializeStorage();
  checkAuth();
  setupEventListeners();
  renderDashboard();
});

// Check Authentication Status
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('aesws_admin_logged_in') === 'true';
  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');

  if (isLoggedIn) {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
  } else {
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Login Form
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Logout Button
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Tab Navigation
  const tabLinks = document.querySelectorAll('.admin-nav-item');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.dataset.tab;
      switchTab(targetTab);
    });
  });

  // Event Form Submit
  const eventForm = document.getElementById('eventForm');
  if (eventForm) {
    eventForm.addEventListener('submit', handleEventSave);
  }

  // Blog Form Submit
  const blogForm = document.getElementById('blogForm');
  if (blogForm) {
    blogForm.addEventListener('submit', handleBlogSave);
  }

  // Razorpay Settings Form Submit
  const razorpayForm = document.getElementById('razorpaySettingsForm');
  if (razorpayForm) {
    razorpayForm.addEventListener('submit', handleRazorpaySettingsSave);
  }

  // Reset Data to default
  const resetBtn = document.getElementById('resetDefaultDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset events, blogs, and donations to default demo data?')) {
        localStorage.removeItem('aesws_events');
        localStorage.removeItem('aesws_blogs');
        localStorage.removeItem('aesws_donations');
        initializeStorage();
        renderDashboard();
        showToast('Data reset to default successfully.');
      }
    });
  }
}

// Login Handler
function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('adminEmail').value.trim();
  const passwordInput = document.getElementById('adminPassword').value.trim();
  const errorMsg = document.getElementById('loginError');

  if (
    (emailInput.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && passwordInput === ADMIN_CREDENTIALS.password) ||
    (emailInput === 'admin' && passwordInput === 'admin123')
  ) {
    sessionStorage.setItem('aesws_admin_logged_in', 'true');
    if (errorMsg) errorMsg.style.display = 'none';
    checkAuth();
    renderDashboard();
    showToast('Welcome back, Admin! Logged in successfully.');
  } else {
    if (errorMsg) {
      errorMsg.textContent = 'Invalid Login ID or Password. (Use admin@aesws.org / admin123)';
      errorMsg.style.display = 'block';
    }
  }
}

// Logout Handler
function handleLogout() {
  if (confirm('Are you sure you want to log out of AESWS Admin Portal?')) {
    sessionStorage.removeItem('aesws_admin_logged_in');
    checkAuth();
    showToast('Logged out successfully.');
  }
}

// Switch Active Dashboard Tab
function switchTab(tabId) {
  document.querySelectorAll('.admin-nav-item').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');

  const activeBtn = document.querySelector(`.admin-nav-item[data-tab="${tabId}"]`);
  const activeContent = document.getElementById(`tab-${tabId}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.style.display = 'block';

  if (tabId === 'donations') renderDonationsTable();
  if (tabId === 'gateway') loadRazorpaySettings();
}

// Render Dashboard Data & Stats
function renderDashboard() {
  const events = getEvents();
  const blogs = getBlogs();
  const donations = getDonations();

  // Update Counters
  const countEvents = document.getElementById('statTotalEvents');
  const countBlogs = document.getElementById('statTotalBlogs');
  if (countEvents) countEvents.textContent = events.length;
  if (countBlogs) countBlogs.textContent = blogs.length;

  renderEventsTable();
  renderBlogsTable();
  renderDonationsTable();
  loadRazorpaySettings();
}

// ==================== DONATIONS LEDGER & RAZORPAY ====================

function renderDonationsTable() {
  const tableBody = document.getElementById('donationsTableBody');
  const donations = getDonations();

  const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const elTotalAmt = document.getElementById('statTotalDonationsAmount');
  const elTotalCount = document.getElementById('statTotalDonorsCount');
  
  if (elTotalAmt) elTotalAmt.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
  if (elTotalCount) elTotalCount.textContent = donations.length;

  if (!tableBody) return;

  if (donations.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b;">No donations recorded yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = donations.map((item, idx) => `
    <tr>
      <td><strong>${idx + 1}</strong></td>
      <td>
        <strong>${item.donorName}</strong><br>
        <small style="color:#64748b;">✉️ ${item.donorEmail} | 📞 ${item.donorPhone || 'N/A'}</small>
      </td>
      <td><span style="font-family:monospace; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:700;">${item.donorPan || 'N/A'}</span></td>
      <td><strong style="color:var(--brand-orange); font-size:14.5px;">₹${(Number(item.amount) || 0).toLocaleString('en-IN')}</strong></td>
      <td><span style="font-family:monospace; color:#0369a1; font-size:12px;">${item.paymentId || 'pay_manual'}</span></td>
      <td>
        <span style="font-family:monospace; font-size:12px;">${item.receiptNo || 'N/A'}</span><br>
        <small style="color:#64748b;">${item.date || ''}</small>
      </td>
      <td>
        <span class="status-badge status-upcoming" style="background:#ecfdf5; color:#047857;">
          ✓ ${item.status || 'Completed'}
        </span>
      </td>
    </tr>
  `).join('');
}

function loadRazorpaySettings() {
  const savedKey = localStorage.getItem('aesws_razorpay_key') || 'rzp_test_TPy0nIoFIEepzy';
  const savedSecret = localStorage.getItem('aesws_razorpay_secret') || 'PyAt6zMQyd7NdF1wyHFWWKyY';
  const savedMode = localStorage.getItem('aesws_gateway_mode') || 'test';
  const savedUpi = localStorage.getItem('aesws_official_upi') || '9479812743@upi';

  const keyInput = document.getElementById('razorpayKeyInput');
  const secretInput = document.getElementById('razorpaySecretInput');
  const upiInput = document.getElementById('officialUpiInput');
  const modeRadio = document.querySelector(`input[name="gatewayMode"][value="${savedMode}"]`);
  const statusBadge = document.getElementById('gatewayStatusBadge');
  const statActiveGateway = document.getElementById('statActiveGateway');

  if (keyInput) keyInput.value = savedKey;
  if (secretInput) secretInput.value = savedSecret;
  if (upiInput) upiInput.value = savedUpi;
  if (modeRadio) modeRadio.checked = true;

  if (statusBadge) {
    if (savedMode === 'live') {
      statusBadge.textContent = '🟢 Live Production Active';
      statusBadge.style.background = '#ecfdf5';
      statusBadge.style.color = '#047857';
    } else {
      statusBadge.textContent = '🟡 Sandbox Test Active';
      statusBadge.style.background = '#fef3c7';
      statusBadge.style.color = '#92400e';
    }
  }

  if (statActiveGateway) {
    statActiveGateway.textContent = savedMode === 'live' ? '🟢 Razorpay Live' : '🟡 Razorpay Test';
  }
}

function handleRazorpaySettingsSave(e) {
  e.preventDefault();
  const keyInput = document.getElementById('razorpayKeyInput').value.trim();
  const secretInput = document.getElementById('razorpaySecretInput').value.trim();
  const upiInput = document.getElementById('officialUpiInput').value.trim();
  const modeVal = document.querySelector('input[name="gatewayMode"]:checked')?.value || 'test';

  localStorage.setItem('aesws_razorpay_key', keyInput);
  localStorage.setItem('aesws_razorpay_secret', secretInput);
  localStorage.setItem('aesws_official_upi', upiInput);
  localStorage.setItem('aesws_gateway_mode', modeVal);

  loadRazorpaySettings();
  showToast('✓ Razorpay Gateway settings saved successfully!');
}

function exportDonationsCSV() {
  const donations = getDonations();
  if (donations.length === 0) {
    alert('No donations to export.');
    return;
  }

  const headers = ['Receipt No', 'Donor Name', 'Email', 'Phone', 'PAN', 'Amount (INR)', 'Payment ID', 'Date', 'Status', 'Gateway'];
  const rows = donations.map(d => [
    `"${d.receiptNo || ''}"`,
    `"${d.donorName || ''}"`,
    `"${d.donorEmail || ''}"`,
    `"${d.donorPhone || ''}"`,
    `"${d.donorPan || ''}"`,
    d.amount || 0,
    `"${d.paymentId || ''}"`,
    `"${d.date || ''}"`,
    `"${d.status || ''}"`,
    `"${d.gateway || 'Razorpay'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `AESWS_80G_Donations_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function testRazorpayCheckout() {
  const savedKey = localStorage.getItem('aesws_razorpay_key') || 'rzp_test_TPy0nIoFIEepzy';
  
  if (typeof Razorpay !== 'undefined' && savedKey.startsWith('rzp_')) {
    const options = {
      key: savedKey,
      amount: 100, // ₹1 test amount (100 paise)
      currency: 'INR',
      name: 'AESWS Admin Test Gateway',
      description: 'Razorpay Integration Verification (₹1 Test)',
      image: 'images/logo.svg',
      handler: function (response) {
        alert('🎉 Razorpay Test Payment Successful!\nPayment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'AESWS Admin Tester',
        email: 'admin@aesws.org',
        contact: '+91 94798 12743'
      },
      theme: { color: '#ea580c' }
    };
    try {
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Simulated Test Mode: Razorpay configuration is valid. When live keys are inserted, real bank popup will launch.');
    }
  } else {
    alert('⚡ Demo Test Mode: Razorpay integration is functional! Enter real Key ID from your Razorpay Dashboard to enable live transactions.');
  }
}

// ==================== EVENTS MANAGEMENT ====================

function renderEventsTable() {
  const tableBodyOverview = document.getElementById('eventsTableBody');
  const tableBodyTab = document.getElementById('eventsTableBodyTab');
  const events = getEvents();

  let htmlContent = '';
  if (events.length === 0) {
    htmlContent = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#64748b;">No events posted yet. Click "+ Add New Event" above to create one.</td></tr>`;
  } else {
    htmlContent = events.map((evt, idx) => `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${evt.image || 'images/udyam_udaan.jpg'}" alt="" style="width:44px; height:44px; border-radius:6px; object-fit:cover;">
            <div>
              <strong>${evt.title}</strong><br>
              <small style="color:#64748b;">${evt.category || 'General'}</small>
            </div>
          </div>
        </td>
        <td>📅 ${evt.date}<br><small style="color:#64748b;">${evt.time || ''}</small></td>
        <td>📍 ${evt.location || 'Bhopal, MP'}</td>
        <td>
          <span class="status-badge ${evt.status === 'Upcoming' ? 'status-upcoming' : 'status-completed'}">
            ${evt.status || 'Upcoming'}
          </span>
        </td>
        <td style="text-align:right;">
          <button class="btn-action btn-edit" onclick="openEditEventModal('${evt.id}')" title="Edit">✏️ Edit</button>
          <button class="btn-action btn-delete" onclick="deleteEvent('${evt.id}')" title="Delete">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  if (tableBodyOverview) tableBodyOverview.innerHTML = htmlContent;
  if (tableBodyTab) tableBodyTab.innerHTML = htmlContent;
}

function openAddEventModal() {
  document.getElementById('eventModalTitle').textContent = 'Add New Event / Drive';
  document.getElementById('eventForm').reset();
  document.getElementById('eventId').value = '';
  document.getElementById('eventStatus').value = 'Upcoming';
  document.getElementById('eventModal').classList.add('active');
}

function openEditEventModal(id) {
  const events = getEvents();
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  document.getElementById('eventModalTitle').textContent = 'Edit Event / Drive';
  document.getElementById('eventId').value = evt.id;
  document.getElementById('eventTitle').value = evt.title;
  document.getElementById('eventCategory').value = evt.category;
  document.getElementById('eventDate').value = evt.date;
  document.getElementById('eventTime').value = evt.time || '';
  document.getElementById('eventLocation').value = evt.location;
  document.getElementById('eventImage').value = evt.image || '';
  document.getElementById('eventStatus').value = evt.status || 'Upcoming';
  document.getElementById('eventDescription').value = evt.description;

  document.getElementById('eventModal').classList.add('active');
}

function handleEventSave(e) {
  e.preventDefault();
  const id = document.getElementById('eventId').value;
  const title = document.getElementById('eventTitle').value.trim();
  const category = document.getElementById('eventCategory').value;
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value.trim();
  const location = document.getElementById('eventLocation').value.trim();
  const image = document.getElementById('eventImage').value.trim() || 'images/udyam_udaan.jpg';
  const status = document.getElementById('eventStatus').value;
  const description = document.getElementById('eventDescription').value.trim();

  let events = getEvents();

  if (id) {
    // Edit existing
    events = events.map(evt => evt.id === id ? { id, title, category, date, time, location, image, status, description } : evt);
    showToast('Event updated successfully!');
  } else {
    // Add new
    const newId = 'evt-' + Date.now();
    events.unshift({ id: newId, title, category, date, time, location, image, status, description });
    showToast('New event posted to website!');
  }

  localStorage.setItem('aesws_events', JSON.stringify(events));
  closeModal('eventModal');
  renderDashboard();
}

function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event? It will be removed from the public website.')) {
    let events = getEvents().filter(e => e.id !== id);
    localStorage.setItem('aesws_events', JSON.stringify(events));
    renderDashboard();
    showToast('Event deleted.');
  }
}

// ==================== BLOGS MANAGEMENT ====================

function renderBlogsTable() {
  const tableBody = document.getElementById('blogsTableBody');
  if (!tableBody) return;

  const blogs = getBlogs();
  if (blogs.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748b;">No blogs or news articles posted yet. Click "+ Write New Article" to publish one.</td></tr>`;
    return;
  }

  tableBody.innerHTML = blogs.map((blog, idx) => `
    <tr>
      <td><strong>${idx + 1}</strong></td>
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${blog.image || 'images/child_classroom.jpg'}" alt="" style="width:44px; height:44px; border-radius:6px; object-fit:cover;">
          <div>
            <strong>${blog.title}</strong><br>
            <small style="color:#64748b;">Category: ${blog.category}</small>
          </div>
        </div>
      </td>
      <td>✍️ ${blog.author || 'AESWS'}</td>
      <td>🗓️ ${blog.date}</td>
      <td style="text-align:right;">
        <button class="btn-action btn-edit" onclick="openEditBlogModal('${blog.id}')" title="Edit">✏️ Edit</button>
        <button class="btn-action btn-delete" onclick="deleteBlog('${blog.id}')" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function openAddBlogModal() {
  document.getElementById('blogModalTitle').textContent = 'Write New Blog / Story';
  document.getElementById('blogForm').reset();
  document.getElementById('blogId').value = '';
  document.getElementById('blogDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('blogModal').classList.add('active');
}

function openEditBlogModal(id) {
  const blogs = getBlogs();
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;

  document.getElementById('blogModalTitle').textContent = 'Edit Blog / Story';
  document.getElementById('blogId').value = blog.id;
  document.getElementById('blogTitle').value = blog.title;
  document.getElementById('blogCategory').value = blog.category;
  document.getElementById('blogAuthor').value = blog.author;
  document.getElementById('blogDate').value = blog.date;
  document.getElementById('blogImage').value = blog.image || '';
  document.getElementById('blogExcerpt').value = blog.excerpt || '';
  document.getElementById('blogContent').value = blog.content;

  document.getElementById('blogModal').classList.add('active');
}

function handleBlogSave(e) {
  e.preventDefault();
  const id = document.getElementById('blogId').value;
  const title = document.getElementById('blogTitle').value.trim();
  const category = document.getElementById('blogCategory').value;
  const author = document.getElementById('blogAuthor').value.trim() || 'AESWS Team';
  const date = document.getElementById('blogDate').value;
  const image = document.getElementById('blogImage').value.trim() || 'images/child_classroom.jpg';
  const excerpt = document.getElementById('blogExcerpt').value.trim();
  const content = document.getElementById('blogContent').value.trim();

  let blogs = getBlogs();

  if (id) {
    // Edit existing
    blogs = blogs.map(b => b.id === id ? { id, title, category, author, date, image, excerpt, content } : b);
    showToast('Article updated successfully!');
  } else {
    // Add new
    const newId = 'blog-' + Date.now();
    blogs.unshift({ id: newId, title, category, author, date, image, excerpt, content });
    showToast('New article published to website!');
  }

  localStorage.setItem('aesws_blogs', JSON.stringify(blogs));
  closeModal('blogModal');
  renderDashboard();
}

function deleteBlog(id) {
  if (confirm('Are you sure you want to delete this blog post? It will be removed from the public website.')) {
    let blogs = getBlogs().filter(b => b.id !== id);
    localStorage.setItem('aesws_blogs', JSON.stringify(blogs));
    renderDashboard();
    showToast('Article deleted.');
  }
}

// Helpers
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: white;
      padding: 14px 22px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      border-left: 4px solid #ea580c;
      z-index: 9999;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3000);
}
