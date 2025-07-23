const config = {
  development: {
    API_URL: 'http://localhost:5000',
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://api.sikasus.com',
  }
};

const env = import.meta.env.MODE || 'development';
export default config[env];
