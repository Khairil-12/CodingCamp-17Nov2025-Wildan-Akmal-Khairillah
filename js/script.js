document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

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

  function updateWelcomeMessage() {
    const storedName = localStorage.getItem("userName");
    const userNameElement = document.getElementById("userName");

    if (storedName && userNameElement) {
      userNameElement.textContent = storedName;
    } else {
      userNameElement.textContent = "Guest";
    }
  }

  const contactForm = document.getElementById("contactForm");
  const formResult = document.getElementById("formResult");
  const backToForm = document.getElementById("backToForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      document.querySelectorAll(".error-message").forEach((error) => {
        error.style.display = "none";
        error.textContent = "";
      });

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      let isValid = true;

      if (name === "") {
        document.getElementById("nameError").textContent = "Name is required";
        document.getElementById("nameError").style.display = "block";
        isValid = false;
      } else if (name.length < 2) {
        document.getElementById("nameError").textContent =
          "Name must be at least 2 characters long";
        document.getElementById("nameError").style.display = "block";
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email === "") {
        document.getElementById("emailError").textContent = "Email is required";
        document.getElementById("emailError").style.display = "block";
        isValid = false;
      } else if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent =
          "Please enter a valid email address";
        document.getElementById("emailError").style.display = "block";
        isValid = false;
      }

      const phoneRegex = /^[\+]?[11-14][\d]{0,15}$/;
      const cleanedPhone = phone.replace(/\D/g, "");
      if (phone === "") {
        document.getElementById("phoneError").textContent =
          "Phone number is required";
        document.getElementById("phoneError").style.display = "block";
        isValid = false;
      } else if (!phoneRegex.test(cleanedPhone)) {
        document.getElementById("phoneError").textContent =
          "Please enter a valid phone number";
        document.getElementById("phoneError").style.display = "block";
        isValid = false;
      }

      if (message === "") {
        document.getElementById("messageError").textContent =
          "Message is required";
        document.getElementById("messageError").style.display = "block";
        isValid = false;
      } else if (message.length < 10) {
        document.getElementById("messageError").textContent =
          "Message must be at least 10 characters long";
        document.getElementById("messageError").style.display = "block";
        isValid = false;
      }

      if (isValid) {
        localStorage.setItem("userName", name);

        document.getElementById("resultName").textContent = name;
        document.getElementById("resultEmail").textContent = email;
        document.getElementById("resultPhone").textContent = phone;
        document.getElementById("resultMessage").textContent = message;
        document.getElementById("resultTime").textContent =
          new Date().toLocaleString();

        contactForm.style.display = "none";
        formResult.style.display = "block";

        updateWelcomeMessage();

        formResult.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          alert(
            `Thank you ${name}! Your message has been submitted successfully.`
          );
        }, 500);
      }
    });
  }

  if (backToForm) {
    backToForm.addEventListener("click", function () {
      formResult.style.display = "none";
      contactForm.style.display = "block";
      contactForm.reset();

      contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const nameInput = document.getElementById("name");
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      const nameError = document.getElementById("nameError");
      if (this.value.trim().length >= 2) {
        nameError.style.display = "none";
      }
    });
  }

  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      const emailError = document.getElementById("emailError");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(this.value.trim())) {
        emailError.style.display = "none";
      }
    });
  }

  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      const phoneError = document.getElementById("phoneError");
      const phoneRegex = /^[\+]?[11-14][\d]{0,15}$/;
      const cleanedPhone = this.value.replace(/\D/g, "");
      if (phoneRegex.test(cleanedPhone)) {
        phoneError.style.display = "none";
      }
    });
  }

  const messageInput = document.getElementById("message");
  if (messageInput) {
    messageInput.addEventListener("input", function () {
      const messageError = document.getElementById("messageError");
      if (this.value.trim().length >= 10) {
        messageError.style.display = "none";
      }
    });
  }

  updateWelcomeMessage();

  window.addEventListener("scroll", updateActiveNavigation);

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

  document
    .querySelectorAll(".product-card, .stat-item, .step, .certificate")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

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

  setInterval(createCoffeeBean, 1000);
});

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
