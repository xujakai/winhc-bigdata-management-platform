// Mock user data
const mockUser = {
  id: 1,
  username: 'admin',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

// Mock token
const mockToken = 'mock-jwt-token-12345';

// Mock login function
export const mockLogin = async (username: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (username === 'admin' && password === 'admin') {
    return {
      user: mockUser,
      token: mockToken,
      message: 'Login successful'
    };
  }
  
  throw new Error('Invalid credentials');
};