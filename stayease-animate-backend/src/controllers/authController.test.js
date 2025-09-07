// Simple test controller
const signup = async (req, res) => {
  res.json({ message: 'Signup test' });
};

const login = async (req, res) => {
  res.json({ message: 'Login test' });
};

const me = async (req, res) => {
  res.json({ message: 'Me test' });
};

const logout = async (req, res) => {
  res.json({ message: 'Logout test' });
};

const test = async (req, res) => {
  res.json({ message: 'Test endpoint' });
};

module.exports = {
  signup,
  login,
  me,
  logout,
  test
};
