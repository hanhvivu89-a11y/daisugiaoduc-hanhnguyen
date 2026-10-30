/**
 * Interactive Scripts for Landing Page - Đại Sứ Giáo Dục Hạnh Nguyễn
 * Zalo: 0911328128
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- TAB FILTERING FOR COURSES ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all buttons
      tabButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });

      // Add active state to clicked button
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      const filter = btn.getAttribute('data-filter');

      // Filter course cards
      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Add entrance animation
          card.classList.add('animate-fadeIn');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- MODAL HANDLING ---
  const modal = document.getElementById('consultationModal');
  const successModal = document.getElementById('successModal');
  const modalCourseInput = document.getElementById('modalCourseInput');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseName = btn.getAttribute('data-course') || 'Tư vấn tổng quan';
      if (modalCourseInput) {
        modalCourseInput.value = courseName;
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  const closeModal = (targetModal) => {
    if (targetModal) {
      targetModal.classList.add('hidden');
      targetModal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(modal);
      closeModal(successModal);
    });
  });

  // Close modal when clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
    if (e.target === successModal) closeModal(successModal);
  });

  // --- FAQ ACCORDION ---
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      
      const isOpen = !content.classList.contains('hidden');
      
      // Close all FAQs first
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      // If wasn't open, open it
      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // --- ZALO AUTO MESSAGE GENERATION & FORM SUBMISSION ---
  const zaloPhone = '0911328128';

  const handleFormSubmission = (formId, courseValue, nameValue, phoneValue, gradeValue, noteValue) => {
    // Validate Phone Number
    const phoneClean = phoneValue.replace(/\D/g, '');
    if (phoneClean.length < 9 || phoneClean.length > 11) {
      alert('Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số) để cô Hạnh Nguyễn tiện liên hệ!');
      return;
    }

    // Construct friendly Zalo message
    let message = `Chào cô Hạnh Nguyễn, tôi tên là ${nameValue}. SĐT/Zalo của tôi là: ${phoneValue}.\n`;
    message += `Tôi đang quan tâm đến: ${courseValue}.\n`;
    if (gradeValue) {
      message += `Độ tuổi/Lớp của học viên: ${gradeValue}.\n`;
    }
    if (noteValue) {
      message += `Nhu cầu chi tiết: ${noteValue}.\n`;
    }
    message += `Xin cô tư vấn lộ trình học tập và học thử giúp tôi!`;

    // Encode URL for Zalo or fallback
    const encodedMsg = encodeURIComponent(message);
    const zaloUrl = `https://zalo.me/${zaloPhone}`;

    // Store recent lead in localStorage for backup
    const leadData = {
      name: nameValue,
      phone: phoneValue,
      course: courseValue,
      grade: gradeValue,
      note: noteValue,
      timestamp: new Date().toISOString()
    };
    try {
      const existingLeads = JSON.parse(localStorage.getItem('hanhnguyen_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('hanhnguyen_leads', JSON.stringify(existingLeads));
    } catch (e) {
      console.log('Local storage error:', e);
    }

    // Close consultation modal if open
    closeModal(modal);

    // Show success modal
    const successLeadName = document.getElementById('successLeadName');
    const successZaloLink = document.getElementById('successZaloLink');
    if (successLeadName) successLeadName.textContent = nameValue;
    if (successZaloLink) {
      successZaloLink.href = zaloUrl;
      // When clicking, also copies prefilled text to clipboard if supported
      successZaloLink.onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(message);
        }
      };
    }

    successModal.classList.remove('hidden');
    successModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Auto open Zalo after 2.5s
    setTimeout(() => {
      window.open(zaloUrl, '_blank');
    }, 2500);
  };

  // Main Registration Form on page
  const mainForm = document.getElementById('mainLeadForm');
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mainName').value.trim();
      const phone = document.getElementById('mainPhone').value.trim();
      const course = document.getElementById('mainCourse').value;
      const grade = document.getElementById('mainGrade').value.trim();
      const note = document.getElementById('mainNote').value.trim();

      handleFormSubmission('mainLeadForm', course, name, phone, grade, note);
      mainForm.reset();
    });
  }

  // Modal Registration Form
  const modalForm = document.getElementById('modalLeadForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const course = document.getElementById('modalCourseInput').value;
      const grade = document.getElementById('modalGrade').value.trim();
      const note = document.getElementById('modalNote').value.trim();

      handleFormSubmission('modalLeadForm', course, name, phone, grade, note);
      modalForm.reset();
    });
  }
});
