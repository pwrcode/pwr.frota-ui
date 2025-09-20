import { Link } from "react-router-dom";

export default function index() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center dark:bg-slate-800">
      <img src="/logo.png" alt="logo" className="w-32 h-32 mb-9"/>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">404 - Página não encontrada</h1>
      <p className="text-gray-600 dark:text-slate-200 mt-2">A página que você tentou acessar não existe.</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-slate-800 dark:bg-white text-white dark:text-slate-800 rounded">Voltar para a Home</Link>
    </div>
  );
}