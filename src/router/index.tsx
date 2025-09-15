import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from "react";
import { Outlet, type RouteObject } from "react-router-dom";

const LayoutPage = lazy(() => import("@/ui/components/LayoutPage"));
const PaginaError = lazy(() => import("@/pages/PaginaError"));
const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Usuario = lazy(() => import("@/pages/Usuario/Index"));
const UsuarioForm = lazy(() => import("@/pages/Usuario/UsuarioForm"));
const PerfilAcesso = lazy(() => import("@/pages/PerfilAcesso/Index"));
const PerfilAcessoPermissoes = lazy(() => import("@/pages/PerfilAcesso/PerfilAcessoPermissoes"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Index"));
const Uf = lazy(() => import("@/pages/Uf/Index"));
const Municipio = lazy(() => import("@/pages/Municipio/Index"));
const Bairro = lazy(() => import("@/pages/Bairro/Index"));

const PublicRoute = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col gap-4 items-center text-lg text-gray-600 dark:text-gray-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Carregando...</p>
      </div>
    </div>
  }>
    <Outlet />
  </Suspense>
);

const PrivateRoute = () => {
  return <Outlet />
};

export { PublicRoute, PrivateRoute };

const routeList = [
  { path: "/", element: <Home />, label: "Home" },
  { path: "/usuario", element: <Usuario />, label: "Usuários" },
  { path: "/usuario/form/:id?", element: <UsuarioForm />, label: "invisible" },
  { path: "/perfil-acesso", element: <PerfilAcesso />, label: "Perfil Acesso" },
  { path: "/perfil-acesso/permissoes/:id?", element: <PerfilAcessoPermissoes />, label: "invisible" },
  { path: "/dashboard", element: <Dashboard />, label: "Dashboard" },
  { path: "/uf", element: <Uf />, label: "Uf" },
  { path: "/municipio", element: <Municipio />, label: "Munícipio" },
  { path: "/bairro", element: <Bairro />, label: "Bairro" },
]

const routeObjects: RouteObject[] = routeList.map(({ label, ...route }) => ({
  ...route,
  element: <PrivateRoute />,
  children: [{ index: true, element: route.element }],
}));

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute />,
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/",
    element: "",
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-col gap-4 items-center text-lg text-gray-600 dark:text-gray-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p>Carregando aplicação...</p>
              </div>
            </div>
          }>
            <LayoutPage />
          </Suspense>
        ),
        children: routeObjects,
      },
      { path: "*", element: <PaginaError /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={routes} />;
}
