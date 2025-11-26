// Authentication System dengan PHP/MySQL
class AuthSystem {
  constructor() {
    this.baseUrl = "php";
  }

  // Check authentication status
  async checkAuth() {
    try {
      const response = await fetch(`${this.baseUrl}/check_auth.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Auth check error:", error);
      return { success: false };
    }
  }

  // Login user
  async login(username, password) {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${this.baseUrl}/login.php`, {
        method: "POST",
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Terjadi kesalahan jaringan" };
    }
  }

  // Register user
  async register(userData) {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("password", userData.password);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);

      const response = await fetch(`${this.baseUrl}/register.php`, {
        method: "POST",
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Terjadi kesalahan jaringan" };
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${this.baseUrl}/logout.php`);
      const data = await response.json();

      if (data.success) {
        // Clear client-side storage
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
      }

      return data;
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Terjadi kesalahan jaringan" };
    }
  }

  // Update UI based on auth status
  async updateAuthUI() {
    const auth = await this.checkAuth();
    const userInfo = document.getElementById("userInfo");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userName = document.getElementById("userName");

    if (auth.success && auth.user) {
      // User logged in
      if (userInfo) {
        userInfo.textContent = `Hello, ${auth.user.username}`;
        userInfo.style.display = "inline";
      }
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline";
      if (userName) userName.textContent = auth.user.username;

      // Store in localStorage for quick access
      localStorage.setItem("userName", auth.user.username);
      localStorage.setItem("userEmail", auth.user.email);
    } else {
      // User not logged in
      if (userInfo) userInfo.style.display = "none";
      if (loginBtn) loginBtn.style.display = "inline";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (userName) {
        const storedName = localStorage.getItem("userName");
        userName.textContent = storedName || "Guest";
      }
    }
  }
}

// Initialize auth system
const auth = new AuthSystem();

// Export for use in other files
window.authSystem = auth;
