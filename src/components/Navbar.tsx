import logo from '../assets/GBRDrop.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="content">
      <h1 className="tag">GBR</h1>
      <div className="tabs">
        <span>About</span>
        <span>Contact</span>
        <img src={logo} alt="" />
      </div>
      </div>

    </nav>
  )
};

export default Navbar;
