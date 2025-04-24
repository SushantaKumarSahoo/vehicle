import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import AdminPage from './components/pages/AdminPage';
import ClientPage from './components/pages/ClientPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/client" element={<ClientPage />} />
      </Routes>
    </BrowserRouter>
  );
}
