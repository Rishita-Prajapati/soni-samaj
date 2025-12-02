class AdminAuthService {
  constructor() {
    this.currentAdmin = null;
    this.initialized = false;
    this.authListeners = [];
  }

  async initialize() {
    // Simulate quick initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    this.initialized = true;
    
    // Check if admin is stored in localStorage
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin) {
      try {
        this.currentAdmin = JSON.parse(storedAdmin);
      } catch (e) {
        localStorage.removeItem('admin_user');
      }
    }
  }

  async loginAdmin(email, password) {
    // Debug logging
    console.log('Login attempt:', { email, password });
    
    // Admin credentials
    const validCredentials = [
      { email: 'admin@sonisamaj.com', password: 'SoniSamaj@2024!' },
      { email: 'admin', password: 'admin' },
      { email: 'admin@admin.com', password: 'admin123' },
      { email: 'sonisamaj', password: '123456' }
    ];
    
    const isValid = validCredentials.some(cred => 
      cred.email === email.trim() && cred.password === password.trim()
    );
    
    if (isValid) {
      this.currentAdmin = {
        uid: '1',
        email: email,
        name: 'Admin',
        role: 'admin',
        permissions: ['all'],
        isActive: true
      };
      
      localStorage.setItem('admin_user', JSON.stringify(this.currentAdmin));
      this.authListeners.forEach(callback => callback(this.currentAdmin));
      return this.currentAdmin;
    }
    
    throw new Error('Invalid credentials');
  }

  async logoutAdmin() {
    this.currentAdmin = null;
    localStorage.removeItem('admin_user');
    this.authListeners.forEach(callback => callback(null));
    return { success: true };
  }

  getCurrentAdmin() {
    return this.currentAdmin;
  }

  hasPermission(permission) {
    return this.currentAdmin && this.currentAdmin.isActive;
  }

  hasRole(role) {
    return this.currentAdmin && this.currentAdmin.role === role;
  }

  onAuthStateChange(callback) {
    this.authListeners.push(callback);
    return () => {
      this.authListeners = this.authListeners.filter(cb => cb !== callback);
    };
  }

  isReady() {
    return this.initialized;
  }

  logout() {
    return this.logoutAdmin();
  }
}

const adminAuthService = new AdminAuthService();
export default adminAuthService;