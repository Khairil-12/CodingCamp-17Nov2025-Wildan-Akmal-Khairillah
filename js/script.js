document.addEventListener("DOMContentLoaded", function () {
  // ===== INITIALIZE USER DATABASE =====
  function initializeUserDatabase() {
    if (!localStorage.getItem("users")) {
      const defaultUsers = [
        {
          id: 1,
          username: "admin",
          password: "admin123",
          email: "admin@kopiprima.com",
          phone: "08123456789",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          username: "customer",
          password: "customer123",
          email: "customer@example.com",
          phone: "0876543210",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }

  // Di script.js - hapus auth functions, tambah ini:
  document.addEventListener("DOMContentLoaded", function () {
    const auth = window.authSystem;

    // Initialize auth UI
    auth.updateAuthUI();

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async function () {
        const result = await auth.logout();
        if (result.success) {
          alert("Anda telah logout!");
          auth.updateAuthUI();
        }
      });
    }

    // Mobile logout
    const logoutBtnMobile = document.getElementById("logoutBtnMobile");
    if (logoutBtnMobile) {
      logoutBtnMobile.addEventListener("click", async function () {
        const result = await auth.logout();
        if (result.success) {
          alert("Anda telah logout!");
          auth.updateAuthUI();
          // Close mobile menu
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
        }
      });
    }

    // ... rest of your existing code
  });

  // ===== MOBILE NAVIGATION =====
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Jika di mobile, tambahkan mobile login ke menu
    if (window.innerWidth <= 768) {
      if (navMenu.classList.contains("active")) {
        let mobileLoginItem = document.querySelector(".mobile-login");
        if (!mobileLoginItem) {
          mobileLoginItem = document.createElement("li");
          mobileLoginItem.className = "nav-item mobile-login";
          mobileLoginItem.innerHTML = `
            <div class="login-section-mobile">
              <span id="userInfoMobile" class="user-info" style="display: none"></span>
              <a href="login.html" id="loginBtnMobile" class="btn btn-login">Login</a>
              <button id="logoutBtnMobile" class="btn btn-logout" style="display: none">Logout</button>
            </div>
          `;
          navMenu.appendChild(mobileLoginItem);
          updateMobileEventListeners();
          updateMobileLoginUI();
        } else {
          mobileLoginItem.style.display = "block";
          updateMobileLoginUI();
        }
      } else {
        const mobileLoginItem = document.querySelector(".mobile-login");
        if (mobileLoginItem) {
          mobileLoginItem.style.display = "none";
        }
      }
    }
  });

  // Tutup menu mobile ketika link diklik
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // ===== MOBILE LOGIN SYSTEM =====
  function updateMobileLoginUI() {
    const auth = checkAuthentication();
    const userInfoMobile = document.getElementById("userInfoMobile");
    const loginBtnMobile = document.getElementById("loginBtnMobile");
    const logoutBtnMobile = document.getElementById("logoutBtnMobile");

    if (userInfoMobile && loginBtnMobile && logoutBtnMobile) {
      if (auth.isLoggedIn && auth.user) {
        userInfoMobile.textContent = `Hello, ${auth.user.username}`;
        userInfoMobile.style.display = "inline";
        logoutBtnMobile.style.display = "inline";
        loginBtnMobile.style.display = "none";
      } else {
        userInfoMobile.style.display = "none";
        logoutBtnMobile.style.display = "none";
        loginBtnMobile.style.display = "inline";
      }
    }
  }

  function updateMobileEventListeners() {
    const logoutBtnMobile = document.getElementById("logoutBtnMobile");
    if (logoutBtnMobile) {
      logoutBtnMobile.addEventListener("click", function () {
        logout();
        // Tutup menu mobile setelah logout
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    }
  }

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        this.classList.add("active");

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== ACTIVE NAVIGATION ON SCROLL =====
  function updateActiveNavigation() {
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById("contactForm");
  const formResult = document.getElementById("formResult");
  const backToForm = document.getElementById("backToForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Reset error messages
      document.querySelectorAll(".error-message").forEach((error) => {
        error.style.display = "none";
        error.textContent = "";
      });

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const company = document.getElementById("company").value.trim();
      const message = document.getElementById("message").value.trim();

      let isValid = true;

      // Name validation
      if (name === "") {
        showError("nameError", "Name is required");
        isValid = false;
      } else if (name.length < 2) {
        showError("nameError", "Name must be at least 2 characters long");
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email === "") {
        showError("emailError", "Email is required");
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showError("emailError", "Please enter a valid email address");
        isValid = false;
      }

      // Phone validation (Indonesian phone format)
      const phoneRegex = /^(?:\+62|62|0)[2-9][0-9]{7,11}$/;
      const cleanedPhone = phone.replace(/\D/g, "");
      if (phone === "") {
        showError("phoneError", "Phone number is required");
        isValid = false;
      } else if (!phoneRegex.test(cleanedPhone)) {
        showError("phoneError", "Please enter a valid Indonesian phone number");
        isValid = false;
      }

      // Message validation
      if (message === "") {
        showError("messageError", "Message is required");
        isValid = false;
      } else if (message.length < 10) {
        showError(
          "messageError",
          "Message must be at least 10 characters long"
        );
        isValid = false;
      }

      if (isValid) {
        // Store user name for welcome message (jika belum login)
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
          localStorage.setItem("userName", name);
        }

        // Display form results
        document.getElementById("resultName").textContent = name;
        document.getElementById("resultEmail").textContent = email;
        document.getElementById("resultPhone").textContent = phone;
        document.getElementById("resultCompany").textContent =
          company || "Not provided";
        document.getElementById("resultMessage").textContent = message;
        document.getElementById("resultTime").textContent =
          new Date().toLocaleString();

        // Show result and hide form
        contactForm.style.display = "none";
        formResult.style.display = "block";

        // Update welcome message jika user baru
        if (!isLoggedIn) {
          updateAuthUI();
        }

        // Scroll to result
        formResult.scrollIntoView({ behavior: "smooth", block: "center" });

        // Show success message
        setTimeout(() => {
          alert(
            `Thank you ${name}! Your message has been submitted successfully.`
          );
        }, 500);
      }
    });
  }

  // Helper function to show error messages
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Back to form functionality
  if (backToForm) {
    backToForm.addEventListener("click", function () {
      formResult.style.display = "none";
      contactForm.style.display = "block";
      contactForm.reset();
      contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ===== REAL-TIME FORM VALIDATION =====
  function setupRealTimeValidation() {
    // Name validation
    const nameInput = document.getElementById("name");
    if (nameInput) {
      nameInput.addEventListener("input", function () {
        if (this.value.trim().length >= 2) {
          hideError("nameError");
        }
      });
    }

    // Email validation
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("input", function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value.trim())) {
          hideError("emailError");
        }
      });
    }

    // Phone validation
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        const phoneRegex = /^(?:\+62|62|0)[2-9][0-9]{7,11}$/;
        const cleanedPhone = this.value.replace(/\D/g, "");
        if (phoneRegex.test(cleanedPhone)) {
          hideError("phoneError");
        }
      });
    }

    // Message validation
    const messageInput = document.getElementById("message");
    if (messageInput) {
      messageInput.addEventListener("input", function () {
        if (this.value.trim().length >= 10) {
          hideError("messageError");
        }
      });
    }
  }

  // Helper function to hide error messages
  function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = "none";
  }

  // ===== ANIMATIONS =====
  // Animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".product-card, .stat-item, .step, .certificate")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // Coffee bean animation
  function createCoffeeBean() {
    const bean = document.createElement("div");
    bean.innerHTML = "☕";
    bean.style.position = "fixed";
    bean.style.top = "-50px";
    bean.style.left = Math.random() * window.innerWidth + "px";
    bean.style.fontSize = Math.random() * 20 + 10 + "px";
    bean.style.opacity = "0.7";
    bean.style.zIndex = "-1";
    bean.style.pointerEvents = "none";
    bean.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;

    document.body.appendChild(bean);

    setTimeout(() => {
      bean.remove();
    }, 5000);
  }

  // Add falling coffee beans animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  setInterval(createCoffeeBean, 1000);

  // ===== INITIALIZE ALL SYSTEMS =====
  initializeUserDatabase();
  updateAuthUI();
  setupRealTimeValidation();

  // Event listener untuk logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Scroll event listeners
  window.addEventListener("scroll", updateActiveNavigation);
});
