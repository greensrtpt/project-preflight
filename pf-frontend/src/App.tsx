import Searchpage from './pages/Searchpage';
import LogInPage from './pages/LogInPage';
import CreateAccPage from './pages/CreateAccPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
       <Routes>
        {/* หน้าแรก (หน้าค้นหา) */}
         <Route path="/" element={<Searchpage />} />
        
        {/* หน้าเข้าสู่ระบบ */}
        <Route path="/login" element={<LogInPage />} />

        {/* หน้าสร้างAccount */}
         <Route path="/createACc" element={<CreateAccPage />} />
      </Routes>
    </Router>
  );
}

export default App;