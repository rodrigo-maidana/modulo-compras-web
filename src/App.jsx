//aca deben estar todo lq esta en el main.jsx xd
//import { FormProductos } from "./components/FormProductos.jsx";
import { ListadoProveedores } from "./components/ListadoProveedores.jsx";
import { NavBarMine } from "./components/NavBarMine.jsx";
import { ListadoPedidosCompras } from "./components/ListadoPedidosCompras.jsx";
import { ListarDepositos } from "./components/ListarDepositos.jsx";
import { ListarProductos } from "./components/ListarProductos.jsx";
import { ListarCategorias } from "./components/ListarCategorias.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//a
function App() {
  return (
    <>
      <Router>
        <NavBarMine />
        <Routes>
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
