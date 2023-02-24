import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Reservas from "./pages/reservas";
import Habitaciones from "./pages/habitaciones";
import Clientes from "./pages/clientes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Reservas />} />
          <Route path="habitaciones" element={<Habitaciones />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="*" element={<Reservas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
