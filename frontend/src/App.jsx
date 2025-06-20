import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    firstVisit: '',
    nextVisit: '',
    amount: '',
    phone: '',
    location: '',
    status: 'started', // Added status field
    _id: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Fetch clients from backend
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update client
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        // Update client in backend
        const res = await axios.put(`http://localhost:5000/api/clients/${form._id}`, form);
        setClients(clients.map(c => c._id === form._id ? res.data : c));
      } else {
        // Create client in backend
        const res = await axios.post('http://localhost:5000/api/clients', form);
        setClients([...clients, res.data]);
      }
      setForm({ name: '', firstVisit: '', nextVisit: '', amount: '', phone: '', location: '', status: 'started', _id: null });
      setIsEditing(false);
      setShowForm(false);
    } catch (err) {
      console.error('Failed to submit client:', err);
    }
    setIsLoading(false);
  };

  // Edit client
  const handleEdit = client => {
    setForm({ ...client });
    setIsEditing(true);
    setShowForm(true);
  };

  // Delete client
  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/clients/${id}`);
        setClients(clients.filter(c => c._id !== id));
      } catch (err) {
        console.error('Failed to delete client:', err);
      }
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setForm({ name: '', firstVisit: '', nextVisit: '', amount: '', phone: '', location: '', status: 'started', _id: null });
  };

  // Filter and search clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    totalRevenue: clients.reduce((sum, c) => sum + parseInt(c.amount || 0), 0)
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/20 text-emerald-700 border-emerald-300';
      case 'pending': return 'bg-amber-500/20 text-amber-700 border-amber-300';
      case 'inactive': return 'bg-red-500/20 text-red-700 border-red-300';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': 
        return <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>;
      case 'pending': 
        return <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>;
      case 'inactive': 
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default: 
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-400/50 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      {/* Glass Morphism Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                    Mezgeb
                  </h1>
                  <p className="text-white/70 text-lg font-medium">Advanced Client Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowStats(!showStats)}
                className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  📊 {showStats ? 'Hide' : 'Show'} Stats
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              
              <button
                onClick={() => setShowForm(!showForm)}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {showForm ? '✕ Cancel' : '✨ Add Client'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Dashboard */}
        {showStats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {[
              { label: 'Total Clients', value: stats.total, icon: '👥', color: 'from-blue-500 to-purple-600' },
              { label: 'Active', value: stats.active, icon: '✅', color: 'from-emerald-500 to-teal-600' },
              { label: 'Pending', value: stats.pending, icon: '⏳', color: 'from-amber-500 to-orange-600' },
              { label: 'Inactive', value: stats.inactive, icon: '💤', color: 'from-red-500 to-pink-600' },
              { label: 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} Birr`, icon: '💰', color: 'from-purple-500 to-indigo-600' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{stat.icon}</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-slide-down">
            <div className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 px-8 py-6 border-b border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">{isEditing ? '✏️' : '➕'}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? 'Edit Client Details' : 'Add New Client'}
                  </h2>
                  <p className="text-white/80">Fill in the information below</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                  { name: 'name', label: 'Place Name', type: 'text', placeholder: 'Enter place name', icon: '🏢' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', icon: '📱' },
                  { name: 'firstVisit', label: 'First Visit', type: 'date', icon: '📅' },
                  { name: 'nextVisit', label: 'Next Visit', type: 'date', icon: '🗓️' },
                  { name: 'amount', label: 'Amount (Birr)', type: 'number', placeholder: 'Enter amount', icon: '💰' },
                  { name: 'location', label: 'Location', type: 'text', placeholder: 'Enter location', icon: '📍' }
                ].map((field, index) => (
                  <div key={field.name} className="group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <label className="flex items-center gap-2 text-white/90 font-semibold mb-3">
                      <span className="text-xl">{field.icon}</span>
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 hover:bg-white/15"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
                {/* Status Dropdown */}
                <div className="group animate-fade-in-up" style={{ animationDelay: `600ms` }}>
                  <label className="flex items-center gap-2 text-white/90 font-semibold mb-3">
                    <span className="text-xl">🔄</span>
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 hover:bg-white/15"
                    >
                      <option value="started">Started</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="closed">Closed</option>
                    </select>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">{isEditing ? '💾' : '✨'}</span>
                        {isEditing ? 'Update Client' : 'Add Client'}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
                
                <button
                  onClick={resetForm}
                  className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 flex-1 sm:flex-none"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-xl">✕</span>
                    Cancel
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <span className="text-white/60 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search clients by name, location, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white px-6 py-4 pr-12 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="active" className="bg-slate-800">Active</option>
                <option value="pending" className="bg-slate-800">Pending</option>
                <option value="inactive" className="bg-slate-800">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                <span className="text-white/60">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Grid/Table */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-white/5 to-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Client Directory
                  </h3>
                  <p className="text-white/70">
                    {filteredClients.length} of {clients.length} clients
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">Live Data</span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70 text-lg">Loading clients...</p>
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">😔</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matches found' : 'No clients yet'}
              </h3>
              <p className="text-white/70 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by adding your first client.'}
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  ✨ Add Your First Client
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5">
                  <tr>
                    {[
                      { label: 'ID', icon: '#️⃣' },
                      { label: 'Place Name', icon: '🏢' },
                      { label: 'First Visit', icon: '📅' },
                      { label: 'Next Visit', icon: '🗓️' },
                      { label: 'Amount', icon: '💰' },
                      { label: 'Phone', icon: '📱' },
                      { label: 'Location', icon: '📍' },
                      { label: 'Status', icon: '🔄' },
                      { label: 'Actions', icon: '⚡' }
                    ].map((header) => (
                      <th key={header.label} className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2 text-white/90 font-semibold">
                          <span>{header.icon}</span>
                          {header.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredClients.map((client, index) => (
                    <tr 
                      key={client._id} 
                      className="group hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-semibold text-white text-lg">{client.name}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-white/80">{client.firstVisit?.slice(0, 10)}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-white/80">{client.nextVisit?.slice(0, 10)}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-emerald-400 text-lg">
                          {parseInt(client.amount).toLocaleString()} Birr
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-white/80">{client.phone}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-white/80">{client.location}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(client.status)}`}>
                          {getStatusIcon(client.status)}
                          {client.status || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(client)}
                            className="group/btn relative overflow-hidden bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl transition-all duration-300 font-semibold border border-amber-400/30 hover:border-amber-400/50 hover:scale-105"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              ✏️ Edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="group/btn relative overflow-hidden bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl transition-all duration-300 font-semibold border border-red-400/30 hover:border-red-400/50 hover:scale-105"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              🗑️ Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App