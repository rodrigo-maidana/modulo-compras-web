import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ListadoProveedores } from "./components/ListadoProveedores";
import { NavBarMine } from "./components/NavBarMine";
import { ListadoPedidosCompras } from "./components/ListadoPedidosCompras";
import { ListarDepositos } from "./components/ListarDepositos";
import { ListarProductos } from "./components/ListarProductos";
import { ListarCategorias } from "./components/ListarCategorias";
import AuthTabs from "./components/AuthTabs";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <NavBarMine />
      <Routes>
        <Route path="/" element={<AuthTabs />} />
        <Route
          path="/proveedores"
          element={<ProtectedRoute element={<ListadoProveedores />} />}
        />
        <Route
          path="/depositos"
          element={<ProtectedRoute element={<ListarDepositos />} />}
        />
        <Route
          path="/categorias"
          element={<ProtectedRoute element={<ListarCategorias />} />}
        />
        <Route
          path="/productos"
          element={<ProtectedRoute element={<ListarProductos />} />}
        />
        <Route
          path="/pedidos"
          element={<ProtectedRoute element={<ListadoPedidosCompras />} />}
        />
      </Routes>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
