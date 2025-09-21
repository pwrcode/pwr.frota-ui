import { Link } from "react-router-dom";

export default function index() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center dark:bg-card">
      <img src="/logo.png" alt="logo" className="w-32 h-32 mb-9"/>
      <h1 className="text-4xl font-bold text-foreground">404 - Página não encontrada</h1>
      <p className="text-gray-600 dark:text-foreground mt-2">A página que você tentou acessar não existe.</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded">Voltar para a Home</Link>
    </div>
  );
}