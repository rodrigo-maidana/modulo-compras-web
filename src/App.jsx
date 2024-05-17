import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ListadoProveedores } from "./components/ListadoProveedores";
import { NavBarMine } from "./components/NavBarMine";
import { ListadoPedidosCompras } from "./components/ListadoPedidosCompras";
import { ListarDepositos } from "./components/ListarDepositos";
import { ListarProductos } from "./components/ListarProductos";
import { ListarCategorias } from "./components/ListarCategorias";
import { ProductTable } from "./components/modales/ProductTable";
import AuthTabs from "./components/AuthTabs"; // Importar el nuevo componente

function App() {
  return (
    <>
      <Router>
        <NavBarMine />
        <Routes>
          <Route path="/" element={<AuthTabs />} />
          <Route path="/proveedores" element={<ListadoProveedores />} />
          <Route path="/depositos" element={<ListarDepositos />} />
          <Route path="/categorias" element={<ListarCategorias />} />
          <Route path="/productos" element={<ListarProductos />} />
          <Route path="/pedidos" element={<ListadoPedidosCompras />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
