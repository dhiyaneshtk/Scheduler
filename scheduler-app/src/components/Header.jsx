import { Menu } from "lucide-react";
import "./Header.css";

const Header = ({ onMenuToggle }) => {
  return (
    <header className="header glass">
      <button 
        className="hamburger-btn glass-hover" 
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
      
      <div className="header-center">
        <h1 className="greeting">Hello LV</h1>
      </div>
      
      <div className="enrollment-info glass-hover">
        <span className="enrollment-label">Enrollment</span>
        <span className="enrollment-date">12th November 2025</span>
      </div>
    </header>
  );
};

export default Header;
