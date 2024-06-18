import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Catetan.css';


const Catetan = () => {
  const [catatan, setCatatan] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [selectedCatatan, setSelectedCatatan] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    fetchCatatan();
  }, []);

  const fetchCatatan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/catetan');
      setCatatan(response.data);
    } catch (error) {
      alert('Gagal mengambil data catatan');
    }
  };

  const handleTambahCatatan = async () => {
    if (judul.trim() === '' && isi.trim() === '') {
      alert('Catatan belum terisi');
      return;
    }
    const newJudul = judul.trim() === '' ? 'Tidak ada judul' : judul;
    const newIsi = isi.trim() === '' ? 'Tidak ada isi' : isi;
    try {
      if (editIndex !== null) {
        const updatedCatetan = { title: newJudul, note: newIsi };
        await axios.put(`http://localhost:5000/catetan/${catatan[editIndex].id}`, updatedCatetan);
        alert('Catatan berhasil diedit');
        fetchCatatan();
        setEditIndex(null);
        setTimeout(() => {
          const editedElement = document.getElementById(`catatan-${editIndex}`);
          if (editedElement) {
            editedElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const newCatetan = { title: newJudul, note: newIsi };
        await axios.post('http://localhost:5000/catetan', newCatetan);
        alert('Catatan berhasil ditambah');
        fetchCatatan();
      }
      setJudul('');
      setIsi('');
      setCharCount(0);
    } catch (error) {
      alert('Gagal menambah/edit catatan');
    }
  };

  const handleEdit = (index) => {
    setJudul(catatan[index].title);
    setIsi(catatan[index].note);
    setCharCount(catatan[index].note.length);
    setEditIndex(index);
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/catetan/${catatan[index].id}`);
      alert('Catatan berhasil dihapus');
      fetchCatatan();
    } catch (error) {
      alert('Gagal menghapus catatan');
    }
  };

  const handleIsiChange = (e) => {
    if (e.target.value.length <= 5000) {
      setIsi(e.target.value);
      setCharCount(e.target.value.length);
    }
  };

  const handleShowDetail = (catatan) => {
    setSelectedCatatan(catatan);
  };

  const handleCloseDetail = () => {
    setSelectedCatatan(null);
  };

  return (
    <div className="catetan-container">
      <div className="header" ref={formRef}>
        <h1>Tomo Vanguard</h1>
        <br />
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul catatan..."
        />
        <textarea
          value={isi}
          onChange={handleIsiChange}
          placeholder="Isi catatan..."
        />
        <div className="char-count">{charCount}/5000 karakter</div>
        <button onClick={handleTambahCatatan}>
          {editIndex !== null ? 'Simpan Catatan' : 'Tambah Catatan'}
        </button>
      </div>
      <div className="catetan-list">
        {catatan.map((item, index) => (
          <div className="catetan-item" key={index} id={`catatan-${index}`}>
            <div className="catetan-date">{new Date(item.datetime).toLocaleString()}</div>
            <h3>{item.title}</h3>
            <p>
              {item.note.length > 100 ? `${item.note.substring(0, 100)}...` : item.note}
              {item.note.length > 100 && <span className="show-more" onClick={() => handleShowDetail(item)}>lihat selengkapnya</span>}
            </p>
            <div className="buttons">
              <button onClick={() => handleEdit(index)}>Edit</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCatatan && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseDetail}>&times;</span>
            <h3>{selectedCatatan.title}</h3>
            <p>{selectedCatatan.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catetan;
