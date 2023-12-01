import React from 'react'
import "./navbar.css"
import { NavLink } from 'react-router-dom'
function NavbarAdmin() {
  return (
    <nav>
    <NavLink to="/" className="navlink home">Admin</NavLink>
      <NavLink to="/Verification" className="navlink home">
        Verification
      </NavLink>
      <NavLink to="/AddCandidate" className="navlink home">
        Add Candidate
      </NavLink>
      <NavLink to="/Results" className="navlink home">
        Results
      </NavLink>
   <i className="fas fa-bars burger-menu"></i>
  </nav>
  )
}

export default NavbarAdmin