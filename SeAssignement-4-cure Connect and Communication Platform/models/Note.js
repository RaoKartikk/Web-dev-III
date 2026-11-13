const crypto = require('crypto');

const notes = [];

class Note {
  static async create({ title, content, owner }) {
    const now = new Date().toISOString();
    const newNote = {
      _id: crypto.randomBytes(12).toString('hex'),
      title,
      content,
      owner,
      createdAt: now,
      updatedAt: now
    };
    notes.push(newNote);
    return newNote;
  }

  static async find(query = {}) {
    if (query.owner) {
      return notes.filter(n => n.owner === query.owner);
    }
    return notes;
  }

  static async findOneAndUpdate({ _id, owner }, updates) {
    const note = notes.find(n => n._id === _id && n.owner === owner);
    if (!note) return null;
    if (updates.title) note.title = updates.title;
    if (updates.content) note.content = updates.content;
    note.updatedAt = new Date().toISOString();
    return note;
  }

  static async findOneAndDelete({ _id, owner }) {
    const index = notes.findIndex(n => n._id === _id && n.owner === owner);
    if (index === -1) return null;
    return notes.splice(index, 1)[0];
  }
}

module.exports = Note;