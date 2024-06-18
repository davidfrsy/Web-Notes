// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/catetan', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/catetan', (req, res) => {
  const { title, note } = req.body;
  const datetime = new Date();
  const newTitle = title.trim() === '' ? 'Tidak ada judul' : title;
  const newNote = note.trim() === '' ? 'Tidak ada isi' : note;
  db.query(
    'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)',
    [newTitle, datetime, newNote],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, title: newTitle, datetime, note: newNote });
    }
  );
});

app.put('/catetan/:id', (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;
  const datetime = new Date();
  const newTitle = title.trim() === '' ? 'Tidak ada judul' : title;
  const newNote = note.trim() === '' ? 'Tidak ada isi' : note;
  db.query(
    'UPDATE notes SET title = ?, note = ?, datetime = ? WHERE id = ?',
    [newTitle, newNote, datetime, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, title: newTitle, datetime, note: newNote });
    }
  );
});

app.delete('/catetan/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notes WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Catatan deleted' });
  });
});

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
