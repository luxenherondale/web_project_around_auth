import React from "react";
import logo from "../../images/header.png";

function Header() {
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Logo aroundTheUSA" />
    </header>
  );
}

export default Header;
