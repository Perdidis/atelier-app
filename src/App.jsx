import React, { useState, useEffect } from 'react';

// --- DATOS INICIALES ---
const INITIAL_CLIENTES = [{
  id: 1,
  nombre: 'Valentina Rossi',
  telefono: '+54 9 11 1234-5678',
  medidas: { 'Contorno de Busto': '90', 'Contorno de Cintura': '70', 'Contorno de Cadera': '95' }
}];

const INITIAL_PEDIDOS = [
  { id: 'PED-001', cliente: 'Valentina Rossi', prenda: 'Vestido de Noche', estado: 'En proceso', entrega: '2026-08-15', precio: 0, pagado: false, tela: 'Seda' },
];

const INITIAL_TELAS = [
    { id: 1, nombre: 'Seda', descripcion: 'Seda natural premium', uso: 'Vestidos de noche', stock: '10m', foto: 'https://images.unsplash.com/photo-1596704017254-9b5c10898154?q=80&w=300' }
];

const MEDIDAS_LISTA = [
  'Contorno de Busto', 'Contorno de Cintura', 'Contorno de Cadera', 'Altura de Cadera', 'Largo de Espalda',
  'Ancho de Espalda', 'Ancho de Hombros', 'Contorno de Cuello', 'Altura de Busto', 'Separación de Busto',
  'Radio', 'Ancho de Pecho', 'Contorno de Brazo', 'Contorno de Muñeca', 'Largo de Manga', 'Altura de Codo',
  'Altura Tiro de Pantalón', 'Largo de Pantalón', 'Largo de Falda', 'Altura de Rodilla'
];

const ESTADOS_PEDIDO = ['Eligiendo telas', 'Midiendo', 'En proceso', 'Pruebas', 'Finalizado'];

export default function App() {
  // --- ESTADOS ---
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [vista, setVista] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState(INITIAL_CLIENTES);
  const [pedidos, setPedidos] = useState(INITIAL_PEDIDOS);
  const [telas, setTelas] = useState(INITIAL_TELAS);
  const [calc, setCalc] = useState({ metros: 0, costoMetro: 0, avios: 0, horas: 0, valorHora: 0, margen: 0 });

  // Cálculos
  const materiales = (calc.metros * calc.costoMetro) + calc.avios;
  const manoObra = calc.horas * calc.valorHora;
  const precioFinal = (materiales + manoObra) * (1 + calc.margen / 100);

  // --- LÓGICA ---
  const guardarCliente = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const medidas = {};
    MEDIDAS_LISTA.forEach(m => medidas[m] = fd.get(m));
    setClientes([...clientes, { id: Date.now(), nombre: fd.get('nombre'), telefono: fd.get('telefono'), medidas }]);
    setVista('clientes');
  };

  const guardarTela = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setTelas([...telas, { id: Date.now(), nombre: fd.get('nombre'), descripcion: fd.get('desc'), uso: fd.get('uso'), stock: fd.get('stock'), foto: fd.get('foto') }]);
    setVista('catalogo');
  };

  const crearPedido = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setPedidos([...pedidos, { 
        id: 'PED-' + Math.floor(Math.random()*1000), 
        cliente: fd.get('clienteNombre'), 
        prenda: fd.get('prenda'), 
        estado: 'Eligiendo telas', 
        entrega: fd.get('fecha'), 
        precio: 0, 
        pagado: false, 
        tela: fd.get('tela') 
    }]);
    setVista('dashboard');
  };

  const asignarPrecioAPedido = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const pedidoId = fd.get('pedidoId');
    setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, precio: precioFinal } : p));
    setVista('dashboard');
  };

  const borrarPedido = (id) => setPedidos(pedidos.filter(p => p.id !== id));
  const actualizarEstado = (id, nuevoEstado) => setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  const togglePago = (id) => setPedidos(pedidos.map(p => p.id === id ? { ...p, pagado: !p.pagado } : p));

  // --- AUTH SCREEN ---
  if (!user) {
    return (
        <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-8 font-sans">
            <div className="bg-stone-900/40 p-8 rounded-3xl w-full max-w-sm border border-stone-800 backdrop-blur-xl">
                <h1 className="text-3xl font-bold mb-8 text-center tracking-tighter">Atelier</h1>
                <form onSubmit={(e) => { e.preventDefault(); setUser({ name: 'Admin' }); }} className="space-y-4">
                    <input placeholder="Usuario" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800" required />
                    <input type="password" placeholder="Contraseña" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800" required />
                    <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">
                        {authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>
                <div className="flex justify-center gap-4 mt-6 text-sm">
                    <button onClick={() => setAuthMode('login')} className={authMode === 'login' ? 'underline' : 'text-stone-500'}>Iniciar Sesión</button>
                    <button onClick={() => setAuthMode('register')} className={authMode === 'register' ? 'underline' : 'text-stone-500'}>Registrarse</button>
                </div>
            </div>
        </div>
    );
  }

  // --- APP PRINCIPAL ---
  return (
    <div className="min-h-screen bg-stone-950 text-white p-8 font-sans selection:bg-white selection:text-stone-950">
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070')] bg-cover bg-center" />

      <nav className="relative z-10 max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => setVista('dashboard')}>Atelier</h1>
        <div className="flex gap-8 text-sm text-stone-400 font-medium">
          <button onClick={() => setVista('dashboard')} className={vista === 'dashboard' ? 'text-white' : ''}>Dashboard</button>
          <button onClick={() => setVista('clientes')} className={vista === 'clientes' ? 'text-white' : ''}>Clientes</button>
          <button onClick={() => setVista('catalogo')} className={vista === 'catalogo' ? 'text-white' : ''}>Catálogo</button>
          <button onClick={() => setVista('calculadora')} className={vista === 'calculadora' ? 'text-white' : ''}>Calculadora</button>
          <button onClick={() => setUser(null)} className="text-red-400 text-xs ml-4">Salir</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto">
        {vista === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pedidos.map(p => (
              <div key={p.id} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 rounded-3xl relative">
                <button onClick={() => borrarPedido(p.id)} className="absolute top-4 right-4 text-stone-600 hover:text-red-400 text-xs">✕</button>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500">{p.id}</span>
                  <button onClick={() => togglePago(p.id)} className={`text-[10px] uppercase px-2 py-1 rounded ${p.pagado ? 'bg-emerald-900 text-emerald-300' : 'bg-stone-800'}`}>
                    {p.pagado ? 'Pagado' : 'Pendiente'}
                  </button>
                </div>
                <h3 className="text-lg font-semibold">{p.cliente}</h3>
                <p className="text-stone-400 text-sm mb-4">{p.prenda} {p.tela && `(${p.tela})`}</p>
                <p className="text-xl font-bold mb-4">{p.precio > 0 ? `$${p.precio.toLocaleString()}` : 'Sin precio'}</p>
                <select value={p.estado} onChange={(e) => actualizarEstado(p.id, e.target.value)} className="w-full bg-stone-950/50 border border-stone-800 p-2 rounded-xl text-xs">
                  {ESTADOS_PEDIDO.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {vista === 'catalogo' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {telas.map(t => (
                <div key={t.id} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-3xl overflow-hidden">
                  <img src={t.foto} alt={t.nombre} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold">{t.nombre}</h3>
                    <p className="text-xs text-stone-400">{t.descripcion} - {t.uso}</p>
                    <p className="text-xs font-mono mt-2">Stock: {t.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vista === 'nueva_tela' && (
          <form onSubmit={guardarTela} className="bg-stone-900/40 p-8 rounded-3xl max-w-lg mx-auto">
            <h2 className="text-xl mb-6">Agregar Tela</h2>
            <input name="nombre" placeholder="Nombre" className="w-full bg-stone-950 p-3 rounded-xl mb-2" required />
            <input name="desc" placeholder="Descripción" className="w-full bg-stone-950 p-3 rounded-xl mb-2" />
            <input name="uso" placeholder="Uso" className="w-full bg-stone-950 p-3 rounded-xl mb-2" />
            <input name="stock" placeholder="Stock" className="w-full bg-stone-950 p-3 rounded-xl mb-2" />
            <input name="foto" placeholder="URL Foto" className="w-full bg-stone-950 p-3 rounded-xl mb-4" />
            <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Guardar Tela</button>
          </form>
        )}

        {vista === 'clientes' && (
          <div>
            <input type="text" placeholder="Buscar cliente..." className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl mb-6 outline-none" onChange={(e) => setBusqueda(e.target.value)} />
            <div className="grid grid-cols-1 gap-4">
              {clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(c => (
                <div key={c.id} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 rounded-3xl">
                  <h3 className="text-lg font-semibold">{c.nombre}</h3>
                  <div className="grid grid-cols-5 gap-2 text-[10px] text-stone-500 mt-4">
                    {Object.entries(c.medidas || {}).map(([k, v]) => <div key={k}>{k}: {v}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vista === 'calculadora' && (
          <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-8 rounded-3xl max-w-2xl mx-auto">
            <h2 className="text-2xl mb-8 font-light">Calculadora</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <input type="number" placeholder="Metros" onChange={e => setCalc({...calc, metros: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800" />
              <input type="number" placeholder="Costo Tela" onChange={e => setCalc({...calc, costoMetro: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800" />
              <input type="number" placeholder="Avíos" onChange={e => setCalc({...calc, avios: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800" />
              <input type="number" placeholder="Horas" onChange={e => setCalc({...calc, horas: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800" />
              <input type="number" placeholder="Valor Hora" onChange={e => setCalc({...calc, valorHora: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800" />
              <input type="number" placeholder="Margen %" onChange={e => setCalc({...calc, margen: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800" />
            </div>
            <div className="text-2xl font-bold mb-6 text-center">Total: ${precioFinal.toLocaleString()}</div>
            
            <form onSubmit={asignarPrecioAPedido} className="border-t border-stone-800 pt-6">
              <label className="block text-sm text-stone-400 mb-2">Asignar a pedido:</label>
              <select name="pedidoId" className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 mb-4 text-white">
                {pedidos.map(p => <option key={p.id} value={p.id}>{p.cliente} - {p.prenda}</option>)}
              </select>
              <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Asignar Precio</button>
            </form>
          </div>
        )}
        
        {vista === 'nuevo_pedido' && (
          <form onSubmit={crearPedido} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-8 rounded-3xl max-w-lg mx-auto">
             <h2 className="text-2xl mb-6">Nuevo Pedido</h2>
             <select name="clienteNombre" className="w-full bg-stone-950 p-3 rounded-xl mb-4 text-white">
                {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
             </select>
             <input name="prenda" placeholder="Prenda" className="w-full bg-stone-950 p-3 rounded-xl mb-4" required />
             <input name="fecha" type="date" className="w-full bg-stone-950 p-3 rounded-xl mb-4" required />
             <select name="tela" className="w-full bg-stone-950 p-3 rounded-xl mb-4 text-stone-400">
                <option value="">Seleccionar tela (opcional)</option>
                {telas.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
             </select>
             <button className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Crear</button>
          </form>
        )}
      </main>

      <button onClick={() => setMenuAbierto(!menuAbierto)} className="fixed bottom-8 right-8 w-14 h-14 bg-white text-stone-950 rounded-full text-2xl z-50 shadow-2xl">+</button>
      {menuAbierto && (
        <div className="fixed bottom-24 right-8 flex flex-col gap-2 z-50">
          <button onClick={() => { setVista('nuevo_cliente'); setMenuAbierto(false); }} className="bg-stone-800 px-6 py-3 rounded-full border border-stone-700">Nuevo Cliente</button>
          <button onClick={() => { setVista('nuevo_pedido'); setMenuAbierto(false); }} className="bg-stone-800 px-6 py-3 rounded-full border border-stone-700">Nuevo Pedido</button>
          {vista === 'catalogo' && <button onClick={() => { setVista('nueva_tela'); setMenuAbierto(false); }} className="bg-stone-800 px-6 py-3 rounded-full border border-stone-700">Nueva Tela</button>}
        </div>
      )}
    </div>
  );
}