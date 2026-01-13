/**
 * WiseMount — Main JavaScript
 * Minimal interactivity for static site
 * 
 * @version 1.0.0
 * @date 2026-01-13
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // DOM Ready
  // ═══════════════════════════════════════════════════════════════════════════

  document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NAVBAR — Scroll behavior & active states
  // ═══════════════════════════════════════════════════════════════════════════

  function initNavbar() {
    const navbar = document.querySelector('.wm-navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class
      if (currentScroll > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Optional: Hide/show navbar on scroll direction
      // if (currentScroll > lastScroll && currentScroll > 200) {
      //   navbar.style.transform = 'translateY(-100%)';
      // } else {
      //   navbar.style.transform = 'translateY(0)';
      // }

      lastScroll = currentScroll;
    });

    // Set active nav link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.wm-navbar__link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    let currentSection = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SMOOTH SCROLL — Anchor links
  // ═══════════════════════════════════════════════════════════════════════════

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const navbarHeight = document.querySelector('.wm-navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.querySelector('.navbar-collapse');
        if (mobileMenu && mobileMenu.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(mobileMenu);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL ANIMATIONS — Intersection Observer
  // ═══════════════════════════════════════════════════════════════════════════

  function initScrollAnimations() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animate || 'fade-in-up';
          entry.target.classList.add('wm-animate-' + animationType);
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function(el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE MENU — Bootstrap navbar toggle enhancements
  // ═══════════════════════════════════════════════════════════════════════════

  function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (!navbarToggler || !navbarCollapse) return;

    // Add animation class when menu opens/closes
    navbarCollapse.addEventListener('show.bs.collapse', function() {
      document.body.style.overflow = 'hidden';
    });

    navbarCollapse.addEventListener('hidden.bs.collapse', function() {
      document.body.style.overflow = '';
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Debounce function to limit execution rate
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * Throttle function to limit execution rate
   */
  function throttle(func, limit) {
    let inThrottle;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FORM HANDLING (Static placeholder)
  // ═══════════════════════════════════════════════════════════════════════════

  // Contact form submission handling (for future backend integration)
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success message (placeholder behavior)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Message Sent!';
      submitBtn.disabled = true;
      
      setTimeout(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPOSE UTILITIES (Optional, for debugging)
  // ═══════════════════════════════════════════════════════════════════════════

  window.WM = {
    debounce: debounce,
    throttle: throttle
  };

})();
