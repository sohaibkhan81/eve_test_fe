import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.scss'; // Custom layout styles

const Layout = () => {
  return (
    <div className=" flex-column">
      <Navbar />
      <div className=" flex-grow-1">
        <Sidebar />
        <div className='main-layout'>
        <main className="flex-grow-1 p-3 content-area">
          <Outlet />
        </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
