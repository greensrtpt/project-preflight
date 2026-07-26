import Searchpage from './pages/Homepage';
import LogInPage from './pages/LogInPage';
import CreateAccPage from './pages/CreateAccPage';
import ShowAllGroupPage from './pages/ShowAllGrouppage';
import ShowAllPostpage from './pages/ShowAllPostpage';
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
         <Route path="/createAcc" element={<CreateAccPage />} />
         <Route path="/showAllGroup/:topic_id" element={<ShowAllGroupPage />} />
         <Route path="/showAllPost/:topic_id/:group_id" element={<ShowAllPostpage />} />
      </Routes>
    </Router>
  );
}

export default App;