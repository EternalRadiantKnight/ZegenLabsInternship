import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { 
  useReactTable, getCoreRowModel, getPaginationRowModel, 
  getFilteredRowModel, flexRender, type ColumnDef, type ColumnFiltersState 
} from '@tanstack/react-table'; 
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Loader2, Sparkles, LogIn, LogOut, ShieldCheck, User as UserIcon, AlertCircle, Filter } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // LOGIKA LOGIN OTOMATIS (MOCK UNTUK VERCEL)
  const handleLogin = () => {
    // Mengecek kredensial secara lokal agar bisa login di Vercel tanpa backend online
    if (username === 'admin' && password === 'admin123') {
      const mockToken = 'mock-jwt-token-admin';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('role', 'admin');
      setToken(mockToken);
      setRole('admin');
    } else if (username === 'user' && password === 'user123') {
      const mockToken = 'mock-jwt-token-user';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('role', 'user');
      setToken(mockToken);
      setRole('user');
    } else {
      alert("Kredensial salah! Gunakan admin / admin123");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products'], 
    queryFn: async () => {
      // Mengambil data dari API publik agar tabel selalu terisi di Vercel
      const res = await axios.get('https://dummyjson.com/products');
      return res.data.products;
    },
    enabled: !!token 
  });

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Produk', accessorKey: 'title', cell: (info) => <span className="font-bold">{info.getValue() as string}</span> },
    { header: 'Harga', accessorKey: 'price', cell: (info) => <span className="text-emerald-400 font-bold">${info.getValue() as number}</span> },
    { header: 'Kategori', accessorKey: 'category', filterFn: 'equalsString' },
  ], []);

  const table = useReactTable({
    data: data || [],
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white font-sans">
        <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-2xl backdrop-blur-md">
          <Sparkles className="text-indigo-400 mx-auto mb-4 animate-pulse" size={48} />
          <h1 className="text-3xl font-black text-center mb-8 tracking-tighter italic uppercase">ZEGEN LABS</h1>
          <div className="space-y-4">
            <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin} className="w-full bg-indigo-500 py-4 rounded-2xl font-black hover:bg-indigo-400 transition-all flex items-center justify-center gap-2 shadow-lg text-white">
              <LogIn size={20} /> INITIALIZE SESSION
            </button>
            <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold mt-4">Login with: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-indigo-500">
      <Loader2 className="animate-spin mb-4" size={64} />
      <p className="font-black uppercase tracking-widest animate-pulse">Syncing Matrix...</p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-red-500 p-6">
      <AlertCircle size={64} className="mb-4" />
      <h2 className="text-xl font-black uppercase tracking-widest leading-none">Protocol Failure</h2>
      <p className="mt-2 text-slate-400">{(error as Error).message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] shadow-indigo-500/50"><Sparkles className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none italic">Command Center</h1>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                {role === 'admin' ? <ShieldCheck size={12} className="text-orange-400" /> : <UserIcon size={12} className="text-indigo-400" />}
                Role: <span className={role === 'admin' ? 'text-orange-400' : 'text-indigo-400'}>{role}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="group flex items-center gap-2 bg-white/5 hover:bg-red-500/20 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all border border-white/10 uppercase">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input className="pl-12 pr-6 py-4 w-full bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-sm" placeholder="Search..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />
          </div>
          <div className="relative flex-1 md:max-w-[250px] group">
            <Filter className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <select 
              className="pl-12 pr-6 py-4 w-full bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-sm appearance-none cursor-pointer text-slate-400"
              onChange={e => {
                const val = e.target.value;
                setColumnFilters(val ? [{ id: 'category', value: val }] : []);
              }}
            >
              <option value="" className="bg-slate-900">ALL CATEGORIES</option>
              <option value="groceries" className="bg-slate-900">GROCERIES</option>
              <option value="beauty" className="bg-slate-900">BEAUTY</option>
              <option value="fragrances" className="bg-slate-900">FRAGRANCES</option>
              <option value="skincare" className="bg-slate-900">SKINCARE</option>
            </select>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} className="bg-white/5">
                    {hg.headers.map(h => (<th key={h.id} className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{flexRender(h.column.columnDef.header, h.getContext())}</th>))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-white/5">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-indigo-500/5 transition-all group">
                    {row.getVisibleCells().map(cell => (<td key={cell.id} className="p-6 text-sm text-slate-400 group-hover:text-slate-200">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 flex items-center justify-between border-t border-white/5 bg-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic underline decoration-indigo-500/50 underline-offset-8">
                Sector {table.getState().pagination.pageIndex + 1} // {table.getPageCount() || 0}
            </span>
            <div className="flex gap-4">
              <button className="p-3 bg-slate-900 border border-white/10 rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-95 shadow-lg" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft size={20}/></button>
              <button className="p-3 bg-slate-900 border border-white/10 rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-95 shadow-lg" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight size={20}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}