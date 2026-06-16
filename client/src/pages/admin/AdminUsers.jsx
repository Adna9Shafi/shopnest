import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import API from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { FiShield, FiTrash2, FiSearch } from 'react-icons/fi';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    API.get('/users').then((res) => { setUsers(res.data); setFiltered(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (search) setFiltered(users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())));
    else setFiltered(users);
  }, [search, users]);

  const handleToggleAdmin = async (id, isAdmin) => {
    try {
      await API.put(`/users/${id}`, { isAdmin: !isAdmin });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isAdmin: !isAdmin } : u)));
      toast.success(`Admin status ${!isAdmin ? 'granted' : 'revoked'}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.success('User deleted');
      setDeleteTarget(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
    setDeleting(false);
  };

  return (
    <>
      <Helmet><title>Manage Users — ShopNest Admin</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold">Users</h1>

        <div className="relative max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm" />
        </div>

        {loading ? <Spinner className="py-12" /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-textMuted text-xs uppercase tracking-wider border-b border-border bg-gray-50/50">
                  <th className="p-4 font-medium">Avatar</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id} className="border-b border-border/50 hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-semibold">
                          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : u.name?.[0] || '?'}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-textMuted">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isAdmin ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-600'}`}>
                          {u.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="p-4 text-textMuted text-xs">{formatDate(u.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleAdmin(u._id, u.isAdmin)} disabled={u._id === currentUser?._id} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed" title={u._id === currentUser?._id ? 'Cannot modify yourself' : 'Toggle admin'}>
                            <FiShield size={14} className={u.isAdmin ? 'text-purple-600' : 'text-gray-400'} /> {u.isAdmin ? 'Demote' : 'Promote'}
                          </button>
                          <button onClick={() => setDeleteTarget(u)} disabled={u.isAdmin || u._id === currentUser?._id} className="p-1.5 hover:bg-gray-100 rounded-lg text-textMuted hover:text-danger disabled:opacity-30 disabled:cursor-not-allowed" title={u.isAdmin ? 'Cannot delete admin' : u._id === currentUser?._id ? 'Cannot delete yourself' : 'Delete user'}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-textMuted">No users found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
          <p className="text-sm text-textMuted mb-4">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete User'}</Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
