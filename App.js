// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/notes'; // ✅ Fixed port number

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err.message);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error('Error submitting note:', err.message);
    }
  };

  const handleEdit = note => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Notes App</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          required
          rows="4"
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ padding: 10 }}>
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <hr />
      <ul>
        {notes.map(note => (
          <li key={note.id} style={{ marginBottom: 15 }}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)} style={{ marginRight: 10 }}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
