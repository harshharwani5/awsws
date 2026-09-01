// Dynamic Content Handler for AESWS Public Pages
// Synchronizes events and blogs created in the Admin Panel with public views

const DEFAULT_EVENTS = [
  {
    id: 'evt-1',
    title: 'Free Mega Health & Eye Screening Camp',
    category: 'Healthcare',
    date: '2026-08-25',
    time: '09:00 AM - 04:00 PM',
    location: 'Shivaji Nagar Community Hall, Bhopal, MP',
    image: 'images/health_camp.jpg',
    status: 'Upcoming',
    description: 'Free doctor consultations, blood pressure & diabetes checkups, eye exams, cataract diagnosis, and complimentary basic medicines distribution for senior citizens and low-income families.'
  },
  {
    id: 'evt-2',
    title: 'Project Udyam Udaan: Batch 18 Orientation & Skill Demo',
    category: 'Skill Development',
    date: '2026-09-02',
    time: '10:30 AM - 01:30 PM',
    location: 'AESWS Center, BDA Complex, 7 No. Square, Bhopal',
    image: 'images/udyam_udaan.jpg',
    status: 'Upcoming',
    description: 'Induction program for 80 new women and youth applicants joining our 3-month certified garment tailoring and digital entrepreneurship program in partnership with CEDMAP.'
  },
  {
    id: 'evt-3',
    title: 'Child Digital Learning & Book Distribution Drive',
    category: 'Education',
    date: '2026-09-15',
    time: '11:00 AM - 03:00 PM',
    location: 'Slum Bridge School Center #4, Karond, Bhopal',
    image: 'images/child_classroom.jpg',
    status: 'Upcoming',
    description: 'Distributing new school kits, notebooks, pencils, and educational digital tablets to 250 slum children to prepare them for formal school admission.'
  }
];

const DEFAULT_BLOGS = [
  {
    id: 'blog-1',
    title: 'How Project Udyam Udaan is Creating 500+ Self-Employed Women in Madhya Pradesh',
    category: 'Livelihood & Skills',
    author: 'AESWS Field Team',
    date: '2026-08-10',
    image: 'images/udyam_udaan.jpg',
    excerpt: 'A deep-dive into how market-aligned vocational sewing, accounting, and micro-loan linkage are enabling rural mothers to earn dignified monthly livelihoods.',
    content: 'Over the last decade, Alveera Education & Social Welfare Society (AESWS) has pioneered community-driven skill initiatives. Through our signature Project Udyam Udaan, women from low-income settlements receive 3-month comprehensive training in modern garment design, sewing machine maintenance, and micro-business management. Today, over 85% of our graduates have started local tailoring businesses or joined community self-help cooperatives, generating an average household income boost of ₹7,500 to ₹12,000 monthly.'
  },
  {
    id: 'blog-2',
    title: 'Transforming Slum Education with Digital Classrooms in Bhopal',
    category: 'Education',
    author: 'Dr. A. Sharma',
    date: '2026-08-01',
    image: 'images/child_classroom.jpg',
    excerpt: 'Bridging the digital divide for first-generation learners through interactive tablet lessons and mid-day nutritional meals.',
    content: 'Education is the ultimate equalizer. At AESWS bridge centers, we combine foundational Hindi, English, and Mathematics with interactive digital learning tablets. Children who once worked at roadside tea stalls or rag-picking now code basic visual programs, read storybooks, and attend regular classes with enthusiasm.'
  },
  {
    id: 'blog-3',
    title: 'Why Periodic Health Screening is Vital for Senior Citizens in Rural Clusters',
    category: 'Healthcare',
    author: 'Medical Welfare Team',
    date: '2026-07-22',
    image: 'images/health_camp.jpg',
    excerpt: 'Summary of our 120th community healthcare drive diagnosing preventable hypertension and eye ailments in rural Bhopal.',
    content: 'Preventive healthcare saves lives. In our recent camp, over 340 elderly residents received free blood glucose tests, cardiac screening, and vision diagnostics. 24 seniors diagnosed with mature cataracts have been scheduled for free sight-restoration surgery funded through our donor support pool.'
  }
];

const DEFAULT_DONATIONS = [
  {
    id: 'DON-101',
    donorName: 'Dr. Ramesh Chandra',
    donorEmail: 'ramesh.c@gmail.com',
    donorPhone: '+91 98260 11223',
    donorPan: 'ABCDE1234F',
    amount: 15000,
    paymentId: 'pay_Nz9824104921',
    receiptNo: 'AESWS-80G-891024',
    date: '14 Aug 2026, 04:30 PM',
    status: 'Completed (80G Issued)',
    gateway: 'Razorpay (UPI)'
  },
  {
    id: 'DON-102',
    donorName: 'Ananya Verma',
    donorEmail: 'ananya.v@outlook.com',
    donorPhone: '+91 94250 88712',
    donorPan: 'BWKPV7812M',
    amount: 5000,
    paymentId: 'pay_Ny7712390145',
    receiptNo: 'AESWS-80G-891025',
    date: '12 Aug 2026, 11:15 AM',
    status: 'Completed (80G Issued)',
    gateway: 'Razorpay (Card)'
  },
  {
    id: 'DON-103',
    donorName: 'Vikram Singhaniya',
    donorEmail: 'vikram.s@singhaniya.in',
    donorPhone: '+91 98110 55432',
    donorPan: 'CRQPS4521K',
    amount: 2500,
    paymentId: 'pay_Nx6651209341',
    receiptNo: 'AESWS-80G-891026',
    date: '10 Aug 2026, 02:45 PM',
    status: 'Completed (80G Issued)',
    gateway: 'Razorpay (NetBanking)'
  },
  {
    id: 'DON-104',
    donorName: 'Sunita Mehra',
    donorEmail: 'sunita.mehra@gmail.com',
    donorPhone: '+91 94798 22110',
    donorPan: 'AALPM9012N',
    amount: 2000,
    paymentId: 'pay_Nw5510928174',
    receiptNo: 'AESWS-80G-891027',
    date: '08 Aug 2026, 09:20 AM',
    status: 'Completed (80G Issued)',
    gateway: 'Razorpay (UPI)'
  }
];

// Initialize Storage with defaults if empty
function initializeStorage() {
  if (!localStorage.getItem('aesws_events')) {
    localStorage.setItem('aesws_events', JSON.stringify(DEFAULT_EVENTS));
  }
  if (!localStorage.getItem('aesws_blogs')) {
    localStorage.setItem('aesws_blogs', JSON.stringify(DEFAULT_BLOGS));
  }
  if (!localStorage.getItem('aesws_donations')) {
    localStorage.setItem('aesws_donations', JSON.stringify(DEFAULT_DONATIONS));
  }
  // User's provided Razorpay Test API Keys
  localStorage.setItem('aesws_razorpay_key', 'rzp_test_TPy0nIoFIEepzy');
  localStorage.setItem('aesws_razorpay_secret', 'PyAt6zMQyd7NdF1wyHFWWKyY');
}

// Get all events
function getEvents() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem('aesws_events')) || DEFAULT_EVENTS;
  } catch (e) {
    return DEFAULT_EVENTS;
  }
}

// Get all blogs
function getBlogs() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem('aesws_blogs')) || DEFAULT_BLOGS;
  } catch (e) {
    return DEFAULT_BLOGS;
  }
}

// Get all donations
function getDonations() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem('aesws_donations')) || DEFAULT_DONATIONS;
  } catch (e) {
    return DEFAULT_DONATIONS;
  }
}

// Render dynamic events & blogs on public News & Events page
function renderPublicNewsAndEvents() {
  const eventsContainer = document.getElementById('publicEventsContainer');
  const blogsContainer = document.getElementById('publicBlogsContainer');

  if (eventsContainer) {
    const events = getEvents();
    if (events.length === 0) {
      eventsContainer.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">No upcoming events scheduled right now. Check back soon!</p>';
    } else {
      eventsContainer.innerHTML = events.map(evt => `
        <div class="card event-card">
          <div class="card-img-wrap" style="height: 200px;">
            <img src="${evt.image || 'images/udyam_udaan.jpg'}" alt="${evt.title}" onerror="this.src='images/udyam_udaan.jpg'" loading="lazy">
            <span class="card-badge" style="background:${evt.status === 'Upcoming' ? 'var(--brand-orange)' : 'var(--slate)'}">${evt.status || 'Upcoming'}</span>
          </div>
          <div class="card-body">
            <div>
              <div style="font-size: 12px; font-weight: 700; color: var(--brand-orange); text-transform: uppercase; margin-bottom: 6px;">
                📅 ${evt.date} ${evt.time ? '• ' + evt.time : ''}
              </div>
              <h3 class="card-title" style="font-size: 19px; margin-bottom: 8px;">${evt.title}</h3>
              <div style="font-size: 13px; color: var(--slate); margin-bottom: 10px; display: flex; align-items: flex-start; gap: 6px;">
                <span>📍</span>
                <span>${evt.location || 'Bhopal, MP'}</span>
              </div>
              <p class="card-text" style="font-size: 14px;">${evt.description}</p>
            </div>
            <div style="margin-top: 15px;">
              <a href="get-involved.html" class="btn btn-primary" style="width: 100%; font-size: 14px; padding: 10px;">Volunteer for This Drive</a>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  if (blogsContainer) {
    const blogs = getBlogs();
    if (blogs.length === 0) {
      blogsContainer.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">No stories published yet.</p>';
    } else {
      blogsContainer.innerHTML = blogs.map(blog => `
        <div class="card blog-card">
          <div class="card-img-wrap" style="height: 210px;">
            <img src="${blog.image || 'images/child_classroom.jpg'}" alt="${blog.title}" onerror="this.src='images/child_classroom.jpg'" loading="lazy">
            <span class="card-badge" style="background:var(--brand-green);">${blog.category || 'Impact Story'}</span>
          </div>
          <div class="card-body">
            <div>
              <div style="font-size: 12px; color: var(--muted); margin-bottom: 6px;">
                ✍️ ${blog.author || 'AESWS'} • 🗓️ ${blog.date}
              </div>
              <h3 class="card-title" style="font-size: 19px; margin-bottom: 10px;">${blog.title}</h3>
              <p class="card-text" style="font-size: 14px; margin-bottom: 15px;">${blog.excerpt || blog.content.substring(0, 140) + '...'}</p>
            </div>
            <button class="btn btn-outline read-article-btn" onclick="openBlogReader('${blog.id}')" style="width: 100%; font-size: 13.5px; padding: 9px;">Read Full Story →</button>
          </div>
        </div>
      `).join('');
    }
  }
}

// Modal Reader for Blog Posts
function openBlogReader(blogId) {
  const blogs = getBlogs();
  const blog = blogs.find(b => b.id === blogId);
  if (!blog) return;

  let modal = document.getElementById('blogReadModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blogReadModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 750px; max-height: 85vh; overflow-y: auto;">
        <button class="modal-close" onclick="document.getElementById('blogReadModal').classList.remove('active')">✕</button>
        <div id="blogModalContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalContent = document.getElementById('blogModalContent');
  modalContent.innerHTML = `
    <div style="margin-bottom: 15px;">
      <span style="background:var(--brand-green-subtle); color:var(--brand-green); font-size:12px; font-weight:700; padding:3px 10px; border-radius:12px; text-transform:uppercase;">
        ${blog.category}
      </span>
      <h2 style="font-size: 26px; margin: 12px 0 6px 0; line-height: 1.25;">${blog.title}</h2>
      <div style="font-size: 13px; color: var(--muted);">Published by <strong>${blog.author}</strong> on ${blog.date}</div>
    </div>
    ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" style="width:100%; max-height:300px; object-fit:cover; border-radius:10px; margin-bottom:20px;">` : ''}
    <div style="font-size: 15.5px; line-height: 1.7; color: var(--slate); white-space: pre-line;">
      ${blog.content}
    </div>
    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; color: var(--muted);">Alveera Education & Social Welfare Society</span>
      <a href="donate.html" class="btn btn-donate" style="font-size: 13.5px; padding: 8px 16px;">Support This Cause ❤️</a>
    </div>
  `;

  modal.classList.add('active');
}

// Auto-run on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeStorage();
  renderPublicNewsAndEvents();
});
