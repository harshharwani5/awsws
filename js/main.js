// Main JavaScript with Dynamic Unitized Impact Breakdown Engine

document.addEventListener('DOMContentLoaded', () => {
  // 0. Language Switcher Engine
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('aesws_lang') || 'en';

  function applyLanguage(lang) {
    if (typeof locales === 'undefined') return;
    const dict = locales[lang];
    if (!dict) return;

    // Update text content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // preserve innerHTML if it contains spans (like hero title)
        if (el.innerHTML.includes('<span') || el.innerHTML.includes('<strong')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update buttons
    langBtns.forEach(b => {
      if (b.dataset.lang === lang) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    localStorage.setItem('aesws_lang', lang);
    currentLang = lang;
  }

  // Bind click events
  if (langBtns.length > 0) {
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
      });
    });
  }

  // Initial apply
  applyLanguage(currentLang);

  // 1. Mobile Menu Toggle with Auto-Close
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      mobileToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.textContent = '☰';
      });
    });

    // Close menu when tapping anywhere outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.textContent = '☰';
      }
    });
  }

  // 2. Unitized Dynamic Impact Calculation Engine
  const presetImpacts = {
    '100': {
      title: '1 Warm Nutritious Meal for a Child',
      icon: '🍛',
      desc: 'Provides 1 wholesome hot meal (rice, dal, vegetables & milk) for a street child.',
      meals: 1,
      schoolDays: 2,
      families: 0,
      healthKits: 0
    },
    '250': {
      title: '2 Fresh Meals + Clean Water & Fruit',
      icon: '🍎',
      desc: 'Feeds 2 children fresh wholesome food plus essential micronutrient supplements.',
      meals: 2,
      schoolDays: 5,
      families: 0,
      healthKits: 0
    },
    '500': {
      title: '1 Full Day of Meals for an Entire Family of 5',
      icon: '🍲',
      desc: 'Provides breakfast, lunch, and dinner rations for a destitute family of five.',
      meals: 5,
      schoolDays: 10,
      families: 1,
      healthKits: 0
    },
    '1000': {
      title: '1 Week of Family Rations + School Supplies for 1 Kid',
      icon: '🎒',
      desc: 'Delivers dry grocery kits (atta, rice, oil) plus school notebooks and stationery.',
      meals: 10,
      schoolDays: 20,
      families: 2,
      healthKits: 1
    },
    '1500': {
      title: '1 Full Month of Schooling, Lunch & Uniform for 1 Student',
      icon: '📚',
      desc: 'Sponsors 1 child’s tuition, daily school mid-day meal, uniform, and bag for 30 days.',
      meals: 15,
      schoolDays: 30,
      families: 3,
      healthKits: 1
    },
    '2500': {
      title: 'Complete Health Checkup & Free Medicines for 2 Elders',
      icon: '🩺',
      desc: 'Covers doctor consultation, blood tests, eye exam, and 1 month of cardiac/diabetes medicines.',
      meals: 25,
      schoolDays: 50,
      families: 5,
      healthKits: 2
    },
    '5000': {
      title: '1 Sewing Machine & Skill Training for a Mother',
      icon: '🧵',
      desc: 'Gives 1 underprivileged woman a new sewing machine and 3-month tailoring certification.',
      meals: 50,
      schoolDays: 100,
      families: 10,
      healthKits: 4
    },
    '10000': {
      title: '1 Digital Learning Tablet & 6 Months Education for a Slum Batch',
      icon: '🏫',
      desc: 'Equips a slum learning center with digital education tablets and internet for 25 kids.',
      meals: 100,
      schoolDays: 200,
      families: 20,
      healthKits: 8
    }
  };

  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('customAmount');
  const impactSlider = document.getElementById('impactSlider');
  const heroImpactHeadline = document.getElementById('heroImpactHeadline');
  const heroImpactIcon = document.getElementById('heroImpactIcon');
  const heroImpactDesc = document.getElementById('heroImpactDesc');
  const metricMeals = document.getElementById('metricMeals');
  const metricSchool = document.getElementById('metricSchool');
  const metricFamilies = document.getElementById('metricFamilies');
  const donateTabs = document.querySelectorAll('.donate-tab');

  function calculateDynamicImpact(amount) {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      if (heroImpactHeadline) heroImpactHeadline.textContent = 'Enter an amount to see real-world impact';
      if (heroImpactIcon) heroImpactIcon.textContent = '✨';
      if (heroImpactDesc) heroImpactDesc.textContent = 'Every single rupee directly feeds, educates, and heals.';
      if (metricMeals) metricMeals.textContent = '0 Meals';
      if (metricSchool) metricSchool.textContent = '0 Days';
      if (metricFamilies) metricFamilies.textContent = '0 Days';
      return;
    }

    // Check if exact preset exists
    const preset = presetImpacts[String(num)];
    if (preset) {
      if (heroImpactHeadline) heroImpactHeadline.textContent = `₹${num.toLocaleString('en-IN')}: ${preset.title}`;
      if (heroImpactIcon) heroImpactIcon.textContent = preset.icon;
      if (heroImpactDesc) heroImpactDesc.textContent = preset.desc;
      if (metricMeals) metricMeals.textContent = `${preset.meals} Hot Meals`;
      if (metricSchool) metricSchool.textContent = `${preset.schoolDays} School Days`;
      if (metricFamilies) metricFamilies.textContent = `${Math.max(1, preset.families)} Family Days`;
      return;
    }

    // Dynamic mathematical computation
    const meals = Math.floor(num / 100);
    const families = Math.floor(num / 500);
    const schoolDays = Math.floor(num / 50);

    let title = '';
    let icon = '🍛';
    let desc = '';

    if (num < 500) {
      icon = '🍛';
      title = `${meals} Nutritious Meals for Underprivileged Children`;
      desc = `Your gift of ₹${num} provides ${meals} fresh hot meals and clean drinking water.`;
    } else if (num < 1500) {
      icon = '🍲';
      title = `${families} Days of Complete Family Food Rations`;
      desc = `Feeds an entire family for ${families} full day(s) plus provides ${meals} total individual meals.`;
    } else if (num < 5000) {
      icon = '📚';
      title = `${schoolDays} Days of Education & School Meals`;
      desc = `Funds tuition, classroom materials, and daily hot lunch for ${Math.floor(schoolDays / 30)} student(s).`;
    } else {
      icon = '🌟';
      title = `Community Transformation (Livelihood & Health Camps)`;
      desc = `Feeds ${families} families, provides ${schoolDays} days of schooling, and sponsors mobile health checkups.`;
    }

    if (heroImpactHeadline) heroImpactHeadline.textContent = `₹${num.toLocaleString('en-IN')}: ${title}`;
    if (heroImpactIcon) heroImpactIcon.textContent = icon;
    if (heroImpactDesc) heroImpactDesc.textContent = desc;
    if (metricMeals) metricMeals.textContent = `${meals} Hot Meals`;
    if (metricSchool) metricSchool.textContent = `${schoolDays} School Days`;
    if (metricFamilies) metricFamilies.textContent = `${Math.max(1, families)} Family Days`;
    
    const btnAmountDisplay = document.getElementById('btnAmountDisplay');
    if (btnAmountDisplay) btnAmountDisplay.textContent = `₹${num.toLocaleString('en-IN')}`;
  }

  // Handle Preset Click
  if (amountBtns.length > 0) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const amount = btn.dataset.amount;
        if (customAmountInput) customAmountInput.value = amount;
        if (impactSlider) impactSlider.value = amount;
        calculateDynamicImpact(amount);
      });
    });
  }

  // Handle Custom Input
  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = e.target.value;
      amountBtns.forEach(b => {
        if (b.dataset.amount === val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      if (impactSlider && val >= 100 && val <= 25000) {
        impactSlider.value = val;
      }
      calculateDynamicImpact(val);
    });
  }

  // Handle Slider Movement
  if (impactSlider) {
    impactSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      if (customAmountInput) customAmountInput.value = val;
      amountBtns.forEach(b => {
        if (b.dataset.amount === val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      calculateDynamicImpact(val);
    });
  }

  // Handle One-Time vs Monthly Tabs
  if (donateTabs.length > 0) {
    donateTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        donateTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

  // 3. Donation Modal Handling
  const modal = document.getElementById('donationModal');
  const openModalBtns = document.querySelectorAll('.trigger-donation');
  const closeModalBtns = document.querySelectorAll('.modal-close, .close-modal');

  if (modal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const customVal = customAmountInput ? customAmountInput.value : '500';
        const activeBtn = document.querySelector('.amount-btn.active');
        const finalAmt = activeBtn ? activeBtn.dataset.amount : (customVal || '500');
        
        const modalAmtDisplay = document.getElementById('modalAmountDisplay');
        if (modalAmtDisplay) modalAmtDisplay.textContent = `₹${parseInt(finalAmt, 10).toLocaleString('en-IN')}`;
        
        modal.classList.add('active');
      });
    });

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => modal.classList.remove('active'));
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 4. Razorpay & Donation Processing Engine
  const checkoutForm = document.getElementById('mockCheckoutForm');
  const checkoutContent = document.getElementById('checkoutContent');
  const checkoutSuccess = document.getElementById('checkoutSuccess');

  function getDonationAmount() {
    const customVal = document.getElementById('customAmount')?.value;
    const activeBtn = document.querySelector('.amount-btn.active');
    const amt = activeBtn ? activeBtn.dataset.amount : (customVal || '500');
    return parseInt(amt, 10) || 500;
  }

  function recordAndDisplaySuccess(donorData, paymentId) {
    const donationAmount = donorData.amount;
    const receiptNo = 'AESWS-80G-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const newDonation = {
      id: 'DON-' + Date.now(),
      donorName: donorData.name,
      donorEmail: donorData.email,
      donorPhone: donorData.phone,
      donorPan: donorData.pan || 'N/A',
      amount: donationAmount,
      paymentId: paymentId,
      receiptNo: receiptNo,
      date: dateStr,
      status: 'Completed (80G Issued)',
      gateway: 'Razorpay'
    };

    // Save transaction to localStorage for Admin Portal view
    try {
      const existing = JSON.parse(localStorage.getItem('aesws_donations') || '[]');
      existing.unshift(newDonation);
      localStorage.setItem('aesws_donations', JSON.stringify(existing));
    } catch (err) {
      console.warn('Unable to write to localStorage', err);
    }

    // Populate UI elements
    if (checkoutContent) checkoutContent.style.display = 'none';
    if (checkoutForm) checkoutForm.style.display = 'none';
    if (checkoutSuccess) {
      checkoutSuccess.style.display = 'block';
      
      const elName = document.getElementById('successDonorName');
      const elEmail = document.getElementById('successDonorEmail');
      const elAmount = document.getElementById('successDonorAmount');
      const rName = document.getElementById('receiptDonorName');
      const rDate = document.getElementById('receiptDate');
      const rAmount = document.getElementById('receiptAmount');
      const rPan = document.getElementById('receiptPan');
      const rPayId = document.getElementById('receiptPaymentId');
      const rNum = document.getElementById('receiptNumber');

      if (elName) elName.textContent = donorData.name;
      if (elEmail) elEmail.textContent = donorData.email;
      if (elAmount) elAmount.textContent = `₹${donationAmount.toLocaleString('en-IN')}`;
      if (rName) rName.textContent = donorData.name;
      if (rDate) rDate.textContent = dateStr;
      if (rAmount) rAmount.textContent = `₹${donationAmount.toLocaleString('en-IN')}`;
      if (rPan) rPan.textContent = donorData.pan ? donorData.pan.toUpperCase() : 'N/A';
      if (rPayId) rPayId.textContent = paymentId;
      if (rNum) rNum.textContent = receiptNo;

      // PDF Generation Setup
      const downloadBtn = document.getElementById('downloadPdfBtn');
      if (downloadBtn) {
        downloadBtn.onclick = () => {
          const receiptElement = document.getElementById('printableReceipt');
          const opt = {
            margin:       0.5,
            filename:     `${receiptNo}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(receiptElement).save();
          } else {
            window.print();
          }
        };
      }

      // WhatsApp Dynamic Receipt Link Generation
      const waReceiptMsg = encodeURIComponent(
`🙏 *Alveera Education & Social Welfare Society (AESWS)*
📜 *Official 80G Donation Receipt*

*Receipt No:* #${receiptNo}
*Donor Name:* ${donorData.name}
*Amount Donated:* ₹${donationAmount.toLocaleString('en-IN')}
*Date:* ${dateStr}
*Razorpay Payment ID:* ${paymentId}
*PAN:* ${donorData.pan ? donorData.pan.toUpperCase() : 'N/A'}
*Tax Benefit:* 50% Tax Exemption under Sec 80G

✨ Thank you for empowering underprivileged women & children in Madhya Pradesh through Project Udyam Udaan!
🌐 Verified NGO: https://aesws.in • Bhopal, MP`
      );

      const sendWaBtn = document.getElementById('sendWhatsAppReceiptBtn');
      if (sendWaBtn) {
        // Clean phone number
        let cleanPhone = (donorData.phone || '').replace(/[^0-9]/g, '');
        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
        
        if (cleanPhone.length >= 10) {
          sendWaBtn.href = `https://wa.me/${cleanPhone}?text=${waReceiptMsg}`;
        } else {
          sendWaBtn.href = `https://wa.me/?text=${waReceiptMsg}`;
        }
      }

      const verifyWaBtn = document.getElementById('verifyWhatsAppBtn');
      if (verifyWaBtn) {
        const supportMsg = encodeURIComponent(`Hello AESWS Team, I just made a donation of ₹${donationAmount} (Receipt #${receiptNo}, Payment ID: ${paymentId}). Please confirm my 80G Form 10BE certificate.`);
        verifyWaBtn.href = `https://wa.me/919479812743?text=${supportMsg}`;
      }
    }
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const donorName = document.getElementById('donorName')?.value || 'Kind Supporter';
      const donorEmail = document.getElementById('donorEmail')?.value || 'info@aesws.in';
      const donorPhone = document.getElementById('donorPhone')?.value || '+91 94798 12743';
      const donorPan = document.getElementById('donorPan')?.value || '';
      const amount = getDonationAmount();

      const donorData = {
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
        pan: donorPan,
        amount: amount
      };

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Connecting to Razorpay...';
        submitBtn.disabled = true;
      }

      // Check for saved Razorpay Key or default user key
      const savedKey = localStorage.getItem('aesws_razorpay_key');
      const razorpayKey = savedKey || 'rzp_test_TPy0nIoFIEepzy';
      const isConfiguredKey = razorpayKey && razorpayKey.startsWith('rzp_');

      if (typeof Razorpay !== 'undefined' && isConfiguredKey) {
        // Real or Configured Sandbox Razorpay Checkout
        const options = {
          key: razorpayKey,
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          name: 'Alveera Education & Social Welfare Society',
          description: `₹${amount} Contribution - Project Udyam Udaan (80G Tax Exempt)`,
          image: 'images/logo.svg',
          handler: function (response) {
            recordAndDisplaySuccess(donorData, response.razorpay_payment_id || ('pay_' + Math.random().toString(36).substring(2, 12)));
          },
          prefill: {
            name: donorName,
            email: donorEmail,
            contact: donorPhone
          },
          notes: {
            pan: donorPan || 'Not Provided',
            organization: 'AESWS Bhopal'
          },
          theme: {
            color: '#ea580c'
          },
          modal: {
            ondismiss: function () {
              if (submitBtn) {
                submitBtn.textContent = `Proceed to Razorpay Checkout (₹${amount}) →`;
                submitBtn.disabled = false;
              }
            }
          }
        };

        try {
          const rzpInstance = new Razorpay(options);
          rzpInstance.open();
        } catch (err) {
          console.warn('Razorpay popup error, falling back to simulated completion:', err);
          setTimeout(() => {
            const mockPayId = 'pay_sim_' + Math.random().toString(36).substring(2, 14);
            recordAndDisplaySuccess(donorData, mockPayId);
          }, 600);
        }
      } else {
        // Test / Sandbox Demo Mode
        setTimeout(() => {
          const mockPayId = 'pay_test_' + Math.random().toString(36).substring(2, 14);
          recordAndDisplaySuccess(donorData, mockPayId);
        }, 700);
      }
    });
  }

  // 5. Volunteer Form
  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const vBtn = volunteerForm.querySelector('button[type="submit"]');
      vBtn.textContent = 'Submitting Application...';
      vBtn.disabled = true;
      
      setTimeout(() => {
        alert('🎉 Thank you for volunteering! Your application has been received. Our coordinator will contact you via WhatsApp.');
        volunteerForm.reset();
        vBtn.textContent = 'Submit Application';
        vBtn.disabled = false;
      }, 700);
    });
  }

  // 6. Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('📩 Message sent successfully! Our team will get back to you within 1 business day.');
      contactForm.reset();
    });
  }

  // 7. Accordion Logic for FAQs
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });

  // 8. Program Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-filter-item');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        programCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 9. Interactive District Impact Explorer Data & Switcher
  const districtData = {
    bhopal: {
      name: "Bhopal Division (Main Headquarters)",
      badge: "● 15 Active Centers",
      desc: "Headquarter of AESWS overseeing our flagship Project Udyam Udaan garment incubation center, 12 slum bridge classrooms, and free medical camps across Shivaji Nagar, BDA Complex, and surrounding slums.",
      ben: "14,200+",
      udyam: "8 Hubs",
      camps: "45+ Camps",
      donateBtn: "❤️ Sponsor a Center in Bhopal",
      centerTitle: "AESWS Central Training Hub",
      address: "📍 Shop No. 243, BDA Complex, 7 No. Square, Shivaji Nagar, Bhopal, MP – 462016",
      tags: ["Tailoring & Apparel", "Digital Literacy", "Free Dispensary", "Slum Bridge School"],
      nextDrive: "Free Eye Screening & Livelihood Batch Orientation (Sunday)",
      waMsg: "Hi AESWS, I would like to visit or support the Bhopal Training Center."
    },
    sehore: {
      name: "Sehore District Rural Outreaches",
      badge: "● 4 Active Rural Hubs",
      desc: "Focused on rural women empowerment through decentralized sewing clusters, farmer family health checks, and child bridge schooling in semi-rural villages.",
      ben: "3,800+",
      udyam: "3 Clusters",
      camps: "18+ Camps",
      donateBtn: "❤️ Sponsor a Sewing Unit in Sehore",
      centerTitle: "AESWS Sehore Women Livelihood Center",
      address: "📍 Main Road, Near Old Bus Stand, Sehore, Madhya Pradesh – 466001",
      tags: ["Self-Help Groups (SHG)", "Mother Tailoring Kits", "Mobile Health Van"],
      nextDrive: "Sewing Machine Distribution for 20 Rural Trainees (Upcoming)",
      waMsg: "Hi AESWS, I want to inquire about sponsoring the Sehore women stitching cluster."
    },
    raisen: {
      name: "Raisen District Community Centers",
      badge: "● 3 Active Centers",
      desc: "Supporting tribal & backward area children with digital education kits, notebooks, nutrition kits, and micro-handicraft training for marginalized women.",
      ben: "2,900+",
      udyam: "2 Hubs",
      camps: "14+ Camps",
      donateBtn: "❤️ Sponsor School Kits in Raisen",
      centerTitle: "Raisen Tribal Youth Education Center",
      address: "📍 Block Center, Sanchi Road, Raisen, Madhya Pradesh – 464551",
      tags: ["Tribal Youth Training", "Bridge Schooling", "Malnutrition Care"],
      nextDrive: "School Bag & Stationery Distribution Drive for 150 Children",
      waMsg: "Hi AESWS, I am interested in supporting the Raisen child education initiative."
    },
    vidisha: {
      name: "Vidisha District Medical & Skill Wings",
      badge: "● 2 Community Centers",
      desc: "Providing quarterly free health screening, basic diabetic medicine distribution for elders, and youth computer literacy classes in Vidisha municipal wards.",
      ben: "1,600+",
      udyam: "1 Lab",
      camps: "12+ Camps",
      donateBtn: "❤️ Fund Medical Camp in Vidisha",
      centerTitle: "Vidisha Community Welfare Wing",
      address: "📍 Hospital Ward Area, Vidisha, Madhya Pradesh – 464001",
      tags: ["Elder Diagnostic Camps", "Basic Computer Skill", "Clean Water Drives"],
      nextDrive: "Elder Eye Screening & Free Cataract Assistance Camp",
      waMsg: "Hi AESWS, I want to sponsor medical medicines for Vidisha elder health camp."
    },
    narmadapuram: {
      name: "Narmadapuram (Hoshangabad) Outreach",
      badge: "● 2 Skill Field Units",
      desc: "Livelihood workshops and basic entrepreneurship guidance organized in collaboration with local community champions for underprivileged girls.",
      ben: "1,200+",
      udyam: "1 Lab",
      camps: "8+ Camps",
      donateBtn: "❤️ Support Narmadapuram Youth",
      centerTitle: "Narmada Riverside Skill & Welfare Unit",
      address: "📍 Civic Center Road, Narmadapuram, Madhya Pradesh – 461001",
      tags: ["Vocational Crafts", "Girls Education", "Sanitation Drives"],
      nextDrive: "Women Artisan Craft Exhibition & Market Linkage Camp",
      waMsg: "Hi AESWS, I want to know more about Narmadapuram programs."
    }
  };

  const distTabs = document.querySelectorAll('.district-tab-btn');
  const distName = document.getElementById('distName');
  const distBadge = document.getElementById('distBadge');
  const distDesc = document.getElementById('distDesc');
  const distMetricBen = document.getElementById('distMetricBen');
  const distMetricUdyam = document.getElementById('distMetricUdyam');
  const distMetricCamps = document.getElementById('distMetricCamps');
  const distDonateLink = document.getElementById('distDonateLink');
  const distCenterTitle = document.getElementById('distCenterTitle');
  const distAddress = document.getElementById('distAddress');
  const distTags = document.getElementById('distTags');
  const distNextDrive = document.getElementById('distNextDrive');

  if (distTabs.length > 0 && distName) {
    distTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        distTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const key = tab.dataset.district;
        const data = districtData[key];
        if (!data) return;

        distName.textContent = data.name;
        distBadge.textContent = data.badge;
        distDesc.textContent = data.desc;
        distMetricBen.textContent = data.ben;
        distMetricUdyam.textContent = data.udyam;
        distMetricCamps.textContent = data.camps;
        distDonateLink.textContent = data.donateBtn;
        distCenterTitle.textContent = data.centerTitle;
        distAddress.textContent = data.address;
        distNextDrive.textContent = data.nextDrive;

        // Render tags
        distTags.innerHTML = data.tags.map(t => 
          `<span style="background: rgba(255,255,255,0.12); padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${t}</span>`
        ).join('');
      });
    });
  }

  // Initialize initial calculation
  calculateDynamicImpact(500);
});


// ==========================================
// ANIMATED COUNTERS (Intersection Observer)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.stat-number, .impact-stat-number');
  const speed = 200; // lower is faster
  
  const animateCounter = (counter) => {
    const targetText = counter.getAttribute('data-target') || counter.innerText;
    // Save target on first run
    if (!counter.hasAttribute('data-target')) {
      counter.setAttribute('data-target', targetText);
    }
    
    // Extract numbers and suffix (e.g. '25,000+' -> 25000, '+')
    const target = +targetText.replace(/[^0-9]/g, '');
    const suffix = targetText.replace(/[0-9,\.]/g, '');
    
    // Reset counter text initially
    counter.innerText = '0' + suffix;
    
    const updateCount = () => {
      const current = +counter.innerText.replace(/[^0-9]/g, '');
      const increment = Math.ceil(target / speed);
      
      if (current < target) {
        const nextValue = current + increment;
        counter.innerText = (nextValue > target ? target : nextValue).toLocaleString('en-IN') + suffix;
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target.toLocaleString('en-IN') + suffix;
      }
    };
    
    updateCount();
  };

  const observerOptions = {
    root: null,
    threshold: 0.5 // Trigger when 50% of the counter is visible
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Run only once
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
});
