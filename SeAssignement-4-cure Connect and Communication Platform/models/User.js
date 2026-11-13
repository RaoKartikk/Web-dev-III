const crypto = require('crypto');

const users = [];

class User {
  static async findOne({ email }) {
    return users.find(u => u.email === email.toLowerCase()) || null;
  }

  static async create({ username, email, password, role = 'user' }) {
    const now = new Date().toISOString();
    const newUser = {
      _id: crypto.randomBytes(12).toString('hex'),
      username: username.trim(),
      email: email.toLowerCase(),
      password,
      role,
      createdAt: now,
      updatedAt: now
    };
    users.push(newUser);
    return newUser;
  }
}

module.exports = User;