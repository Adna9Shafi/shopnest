import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty'];

const emptyProduct = {
  name: '', description: '', richDescription: '', price: '', comparePrice: '', category: 'Electronics',
  brand: '', tags: '', countInStock: '', images: [''], isFeatured: false, isNew: false, discount: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    const params = { page, limit: 10, sort };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    productService.getAll(params).then((res) => {
      setProducts(res.data.products); setPages(res.data.pages); setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page, sort, categoryFilter]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchProducts(); }, 400); return () => clearTimeout(t); }, [search]);

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, tags: p.tags?.join(', ') || '', images: p.images?.length ? p.images : [''] }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.description) { toast.error('Name, price, and description are required'); return; }
    setSaving(true);
    try {
      const data = {
        ...form, price: parseFloat(form.price), comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        countInStock: parseInt(form.countInStock) || 0, discount: parseInt(form.discount) || 0,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        images: form.images.filter(Boolean),
      };
      if (editing) {
        await productService.update(editing._id, data);
        toast.success('Product updated');
      } else {
        await productService.create(data);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try { await productService.delete(deleteId); toast.success('Product deleted'); setDeleteId(null); fetchProducts(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const addImageField = () => setForm((p) => ({ ...p, images: [...p.images, ''] }));
  const removeImageField = (i) => setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  return (
    <>
      <Helmet><title>Manage Products — ShopNest Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">Products</h1>
          <Button onClick={openAdd}><FiPlus size={16} /> Add Product</Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm" />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-border rounded-lg text-sm">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="px-3 py-2 border border-border rounded-lg text-sm">
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price: Low</option>
            <option value="-price">Price: High</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
          </select>
        </div>

        {loading ? <Spinner className="py-12" /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-textMuted text-xs uppercase tracking-wider border-b border-border bg-gray-50/50">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Featured</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-border/50 hover:bg-gray-50/50">
                      <td className="p-4"><img src={p.images?.[0] || '/placeholder.jpg'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" /></td>
                      <td className="p-4 font-medium max-w-[200px] truncate">{p.name}</td>
                      <td className="p-4 text-textMuted">{p.category}</td>
                      <td className="p-4 font-medium">{formatPrice(p.price)}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.countInStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{p.countInStock}</span></td>
                      <td className="p-4">{p.isFeatured ? <span className="text-success">Yes</span> : <span className="text-textMuted">No</span>}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg text-textMuted hover:text-secondary" title="Edit"><FiEdit2 size={16} /></button>
                          <button onClick={() => setDeleteId(p._id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-textMuted hover:text-danger" title="Delete"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-textMuted">No products found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Pagination page={page} pages={pages} onPageChange={setPage} />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-sm font-medium mb-1">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm font-medium mb-1">Rich Description</label><textarea value={form.richDescription} onChange={(e) => setForm({ ...form, richDescription: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Price *</label><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" step="0.01" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Compare Price</label><input value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} type="number" step="0.01" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Category *</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Brand</label><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Count In Stock</label><input value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} type="number" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Discount %</label><input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} type="number" min="0" max="100" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm font-medium mb-1">Tags (comma-separated)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. wireless, audio, bluetooth" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" /></div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Images (URLs)</label>
                {form.images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input value={url} onChange={(e) => { const imgs = [...form.images]; imgs[i] = e.target.value; setForm({ ...form, images: imgs }); }} placeholder="https://images.unsplash.com/photo-..." className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm" />
                    {form.images.length > 1 && <button onClick={() => removeImageField(i)} className="text-danger text-sm hover:underline">Remove</button>}
                  </div>
                ))}
                <button type="button" onClick={addImageField} className="text-sm text-secondary hover:underline">+ Add Image URL</button>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><span className="text-sm">Featured</span><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-border text-secondary focus:ring-secondary" /></label>
                <label className="flex items-center gap-2 cursor-pointer"><span className="text-sm">New Arrival</span><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded border-border text-secondary focus:ring-secondary" /></label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
          <p className="text-sm text-textMuted mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
