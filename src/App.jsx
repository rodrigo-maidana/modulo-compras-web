import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ListadoProveedores } from "./components/listados/ListadoProveedores";
import { NavBarMine } from "./components/NavBarMine";
import { ListadoPedidosCompras } from "./components/listados/ListadoPedidosCompras";
import { ListarDepositos } from "./components/listados/ListarDepositos";
import { ListarProductos } from "./components/listados/ListarProductos";
import { ListarCategorias } from "./components/listados/ListarCategorias";
import { ListadoPedidoCotizacion } from "./components/listados/ListadoPedidoCotizacion";
import { ListadoOrdenCompra } from "./components/listados/ListadoOrdenCompra";
import ListarPedidoCotizacionNuevo from "./components/listados/ListarPedidoCotizacionNuevo";
import { FormOrdenCompra } from "./components/forms/FormOrdenCompra";
import { ListarFacturas } from "./components/listados/ListarFacturas";

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
          path="/pedidos-compra"
          element={<ProtectedRoute element={<ListadoPedidosCompras />} />}
        />
        <Route
          path="/pedidos-cotizacion"
          element={<ProtectedRoute element={<ListadoPedidoCotizacion />} />}
        />
        <Route
          path="/pedido-cotizacion/nuevo/:id"
          element={<ProtectedRoute element={<ListarPedidoCotizacionNuevo />} />}
        />
        <Route
          path="/orden-compra/:id"
          element={<ProtectedRoute element={<FormOrdenCompra />} />}
        />
        <Route
          path="/orden-compra"
          element={<ProtectedRoute element={<ListadoOrdenCompra />} />}
        ></Route>
        <Route
          path="/facturas"
          element={<ProtectedRoute element={<ListarFacturas />} />}
        ></Route>
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
