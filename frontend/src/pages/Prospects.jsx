import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [form, setForm] = useState({ name: '', place: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all prospects
  const fetchProspects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/prospects`);
      setProspects(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch prospects');
      // Optionally log error: console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update prospect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/prospects/${editingId}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/api/prospects`, form);
      }
      setForm({ name: '', place: '', location: '' });
      setEditingId(null);
      fetchProspects();
      setError('');
    } catch (err) {
      console.log(err);
      setError('Failed to save prospect');
      // Optionally log error: console.error(err);
    }
    setLoading(false);
  };

  // Edit prospect
  const handleEdit = (prospect) => {
    setForm({ name: prospect.name, place: prospect.place, location: prospect.location });
    setEditingId(prospect._id);
  };

  // Delete prospect
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/prospects/${id}`);
      fetchProspects();
      setError('');
    } catch (err) {
      console.log(err)
      setError('Failed to delete prospect');
      // Optionally log error: console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Prospects</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded w-full"
        />
        <input
          type="text"
          name="place"
          placeholder="Place"
          value={form.place}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border px-2 py-1 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          {editingId ? 'Update' : 'Add'} Prospect
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', place: '', location: '' }); }} className="ml-2 text-gray-600">Cancel</button>
        )}
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Place</th>
              <th className="border px-2 py-1">Location</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((prospect) => (
              <tr key={prospect._id}>
                <td className="border px-2 py-1">{prospect.name}</td>
                <td className="border px-2 py-1">{prospect.place}</td>
                <td className="border px-2 py-1">{prospect.location}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleEdit(prospect)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(prospect._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Prospects;


