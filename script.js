/*
  Main JavaScript for portfolio site.
  Functions are ordered by page structure and critical execution flow.
*/

/* --- Global DOM references --- */
const body = document.body;
const headerEl = document.querySelector(".header");
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const darkToggle = document.getElementById("darkToggle");
const contactForm = document.querySelector(".contact-form");

/* --- Scroll manager (single rAF loop) --- */
const ScrollManager = (function () {
  const handlers = new Set();
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handlers.forEach((h) => {
          try { h(); } catch (e) { console.error(e); }
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  return {
    add(handler) {
      if (typeof handler === 'function') {
        handlers.add(handler);
        // run once to initialize
        try { handler(); } catch (e) { console.error(e); }
      }
    },
    remove(handler) {
      handlers.delete(handler);
    }
  };
})();

/* --- Initial page fade effect --- */
document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease-in";
setTimeout(() => {
  document.body.style.opacity = "1";
}, 100);

/* --- Load saved theme and refresh animations on page load --- */
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    const icon = darkToggle?.querySelector("i");
    if (icon) {
      icon.classList.replace("bi-moon", "bi-sun");
    }
  }

  if (window.AOS) {
    AOS.refresh();
  }
});

/* --- Header scroll effect: add .scrolled after threshold --- */
if (headerEl) {
  const SCROLL_THRESHOLD = 50;
  const handleHeaderScroll = () => headerEl.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
  ScrollManager.add(handleHeaderScroll);
}

/* --- Mobile navigation toggle --- */
if (menuBtn && navbar) {
  const icon = menuBtn.querySelector("i");

  menuBtn.addEventListener("click", () => {
    const isActive = navbar.classList.toggle("active");

    icon?.classList.toggle("bi-list", !isActive);
    icon?.classList.toggle("bi-x", isActive);
    menuBtn.setAttribute("aria-expanded", String(isActive));
    document.body.classList.toggle("no-scroll", isActive);
  });
}

/* --- Close mobile menu when clicking outside on small screens --- */
document.addEventListener("click", (event) => {
  if (window.innerWidth <= 991 && menuBtn && navbar) {
    const target = event.target;
    if (!navbar.contains(target) && !menuBtn.contains(target)) {
      navbar.classList.remove("active");
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("bi-x");
        icon.classList.add("bi-list");
      }
      menuBtn.setAttribute("aria-expanded", "false");
    }
  }
});

/* --- Close mobile menu after clicking a navigation link --- */
if (navbar && menuBtn) {
  const navLinks = navbar.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 991) {
        navbar.classList.remove("active");
        const icon = menuBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("bi-x");
          icon.classList.add("bi-list");
        }
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

/* --- Theme toggle for dark/light mode --- */
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const icon = darkToggle.querySelector("i");

    if (body.classList.contains("light-mode")) {
      icon?.classList.replace("bi-moon", "bi-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon?.classList.replace("bi-sun", "bi-moon");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* --- Resume download button handler --- */
function downloadResume(event) {
  event.preventDefault();

  const link = document.createElement("a");
  link.href = "CV WEB.MS.pdf";
  link.download = "Mureed_Sajjad_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showDownloadMessage();
}

/* --- Show temporary download confirmation --- */
function showDownloadMessage() {
  const message = document.createElement("div");
  message.textContent = "✅ CV Downloaded Successfully!";
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(message);
  setTimeout(() => {
    message.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      message.remove();
    }, 300);
  }, 3000);
}

/* --- Hero section typing animation --- */
if (document.getElementById("typed")) {
  new Typed("#typed", {
    strings: [
      "Frontend Developer",
      "Web Designer",
      "Tech Enthusiast",
      "Creative Developer",
    ],
    typeSpeed: 30,
    backSpeed: 25,
    backDelay: 1500,
    loop: true,
  });
}

/* --- Animate service/skill cards when they come into view --- */
function animateSkillCards() {
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card) => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            card.style.animation = "slideInUp 0.5s ease-out";
            obs.unobserve(card);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(card);
  });
}

/* --- Set skill bar widths based on data attributes --- */
function setSkillBarWidths() {
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    if (width) {
      bar.style.width = width + "%";
    }
  });
}

/* --- Counter animation for stats section --- */
function createCounterAnimation() {
  const counters = document.querySelectorAll("[data-counter]");
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.counter, 10) || 0;
    let current = 0;
    const increment = target / 100;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && current === 0) {
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, 30);
            obs.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(counter);
  });
}

/* --- Open project details modal and populate content --- */
function openProjectModal(title, description, technologies, link, imageSrc) {
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalProjectTitle");
  const modalDesc = document.getElementById("modalProjectDesc");
  const modalTech = document.getElementById("modalProjectTech");
  const modalLink = document.getElementById("modalProjectLink");
  const modalImage = document.getElementById("modalProjectImage");

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = description;
  if (modalTech) modalTech.textContent = technologies;
  if (modalLink) modalLink.href = link;
  if (modalImage) modalImage.src = imageSrc;

  if (modal) {
    // accessibility: save focus, show modal, trap focus
    modal.classList.add("active");
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = "hidden";
    modal.dataset._previouslyFocused = document.activeElement?.id || '';
    // focus first focusable element inside modal
    const focusable = modal.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable[0] || modal).focus();
    // trap tab inside modal
    modal._trapHandler = function (e) {
      if (e.key === 'Tab') {
        const nodes = Array.from(focusable.length ? focusable : [modal]);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modal.addEventListener('keydown', modal._trapHandler);
  }
}

/* --- Close the project modal and restore page scrolling --- */
function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = "auto";
    // restore focus
    try {
      const prevId = modal.dataset._previouslyFocused;
      if (prevId) { const prev = document.getElementById(prevId); prev?.focus(); }
    } catch (e) { }
    if (modal._trapHandler) {
      modal.removeEventListener('keydown', modal._trapHandler);
      delete modal._trapHandler;
    }
  }
}

/* --- Close project modal when clicking outside the content --- */
document.addEventListener("click", (event) => {
  const modal = document.getElementById("projectModal");
  if (modal && event.target === modal) {
    closeProjectModal();
  }
});

/* --- Close modal when pressing Escape --- */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

/* --- Form field validation utilities --- */
function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;
  let isValid = false;

  switch (fieldName) {
    case "name":
      isValid = value.length >= 2;
      if (!isValid) showError(input, "Name must be at least 2 characters");
      break;
    case "email":
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) showError(input, "Please enter a valid email");
      break;
    case "subject":
      isValid = value.length >= 3;
      if (!isValid) showError(input, "Subject must be at least 5 characters");
      break;
    case "message":
      isValid = value.length >= 10;
      if (!isValid) showError(input, "Message must be at least 10 characters");
      break;
  }

  if (isValid) {
    clearError(input);
    markFieldValid(input);
  } else {
    input.classList.add("is-invalid");
  }

  return isValid;
}

function markFieldValid(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  input.parentElement.querySelector(".error-message")?.remove();
  input.setAttribute('aria-invalid', 'false');
}

function showError(input, message) {
  const formGroup = input.parentElement;
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  input.setAttribute('aria-invalid', 'true');

  let errorMsg = formGroup.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("small");
    errorMsg.className = "error-message d-block mt-2";
    formGroup.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}

function clearError(input) {
  input.classList.remove("is-invalid");
  input.parentElement.querySelector(".error-message")?.remove();
  input.setAttribute('aria-invalid', 'false');
}

/* --- Show a success notification after contact form submission --- */
function showSuccessNotification(message) {
  const notification = document.createElement("div");
  notification.className = "success-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-check-circle-fill"></i>
      <span>${message}</span>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.4s ease-out;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease-out";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

/* --- Show an error notification if the form cannot be submitted --- */
function showErrorNotification(message) {
  const notification = document.createElement("div");
  notification.className = "error-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-exclamation-circle-fill"></i>
      <span>${message}</span>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.4s ease-out;
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease-out";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

/* --- Initialize contact form events and validation --- */
if (contactForm) {
  const inputs = contactForm.querySelectorAll(".form-control, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        validateField(input);
      }
    });
  });

  const messageField = document.getElementById("message");
  if (messageField) {
    messageField.addEventListener("input", () => {
      const charCount = document.getElementById("charCount");
      const length = messageField.value.length;
      if (charCount) charCount.textContent = String(length);

      const countWrapper = document.querySelector(".char-count");
      if (length > 500) {
        messageField.value = messageField.value.substring(0, 500);
        if (charCount) charCount.textContent = "500";
        countWrapper?.classList.add("limit");
      } else if (length > 400) {
        countWrapper?.classList.add("warning");
        countWrapper?.classList.remove("limit");
      } else {
        countWrapper?.classList.remove("warning", "limit");
      }
    });
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.querySelector('textarea[name="message"]');
    let isValid = true;

    if (name && !validateField(name)) isValid = false;
    if (email && !validateField(email)) isValid = false;
    if (subject && !validateField(subject)) isValid = false;
    if (message && !validateField(message)) isValid = false;

    if (!isValid) {
      showErrorNotification("Please fix the highlighted fields before submitting.");
      return;
    }

    const submitBtn = contactForm.querySelector(".btn-submit");
    if (submitBtn) {
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
    }

    try {
      const formData = new FormData(contactForm);
      const resp = await fetch(contactForm.action || window.location.href, {
        method: contactForm.method || 'POST',
        body: formData,
      });

      if (resp.ok) {
        showSuccessNotification("Message sent successfully! I'll get back to you soon.");
        contactForm.reset();
        const charCount = document.getElementById("charCount");
        if (charCount) charCount.textContent = "0";
      } else {
        showErrorNotification("There was a problem sending your message. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      showErrorNotification("Network error. Please check your connection and try again.");
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      }
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      contactForm.reset();
      const charCount = document.getElementById("charCount");
      if (charCount) charCount.textContent = "0";
    }
  });
}

/* --- Highlight the current section link in the navigation --- */
function updateActiveNav() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const computeActive = () => {
    let currentSection = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom > 200) {
        currentSection = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
    });
  };

  ScrollManager.add(computeActive);
}

/* --- Back to top button visibility and click behavior --- */
const backToTopBtn = document.querySelector(".back-to-top");
if (backToTopBtn) {
  const handleBackToTop = () => backToTopBtn.classList.toggle("active", window.scrollY > 500);
  ScrollManager.add(handleBackToTop);
  backToTopBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --- Initialize parallax transform for elements with data-parallax --- */
function initParallax() {
  const parallaxElements = Array.from(document.querySelectorAll("[data-parallax]"));
  if (parallaxElements.length === 0) return;
  const parallaxUpdate = () => {
    const scrollPosition = window.scrollY;
    parallaxElements.forEach((el) => {
      const elementOffset = el.offsetTop;
      const distance = scrollPosition - elementOffset;
      if (Math.abs(distance) < window.innerHeight) {
        el.style.transform = `translateY(${distance * 0.5}px)`;
      }
    });
  };
  ScrollManager.add(parallaxUpdate);
}

/* --- Smooth anchor scrolling with header offset --- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = 120;
        window.scrollTo({ top: target.offsetTop - headerHeight, behavior: "smooth" });
      }
    }
  });
});

/* --- Lazy load images that use data-src --- */
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src || img.src;
      img.classList.add("loaded");
      observer.unobserve(img);
    }
  });
});
document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img);
});

/* --- Animated hover effect for social icons --- */
function initSocialLinks() {
  const socialLinks = document.querySelectorAll(
    'a[href*="github"], a[href*="linkedin"], a[href*="twitter"], a[href*="facebook"]',
  );
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "scale(1.2) rotate(10deg)";
      link.style.transition = "all 0.3s ease";
    });
    link.addEventListener("mouseleave", () => {
      link.style.transform = "scale(1) rotate(-10deg)";
    });
  });
}

/* --- DOMContentLoaded: initialize AOS, skill widths, and entrance animations --- */
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: false, offset: 100 });
  }
  setSkillBarWidths();
  animateSkillCards();
  createCounterAnimation();
  updateActiveNav();
  initParallax();
  initSocialLinks();
  // attach accessible modal close handler
  const modalCloseBtn = document.querySelector('.project-modal-close');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  // mark required contact form fields for assistive tech
  document.querySelectorAll('.contact-form [required]').forEach(el => el.setAttribute('aria-required', 'true'));
});

/* --- Ensure skill bars update when skills section becomes visible (via ScrollManager) --- */
const checkSkillsVisible = () => {
  const skillsSection = document.querySelector("#skills");
  if (skillsSection) {
    const position = skillsSection.getBoundingClientRect().top;
    if (position < window.innerHeight) {
      setSkillBarWidths();
    }
  }
};
ScrollManager.add(checkSkillsVisible);
