export const auth = {
  login(username, password) {
    // In production, this should be replaced with actual API call
    const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
    const isValid = username === adminUser && password === adminPass;
    
    if (isValid) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem('isLoggedIn');
  },

  isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
};
