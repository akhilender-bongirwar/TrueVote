import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import Context from '../../constant/context';
import "./navbar.css"

function Navbar() {
  const { details, dispatch}=useContext(Context);
  return (
    <nav onBeforeUn>
        <NavLink to="/" className="navlink home">
            Home
        </NavLink>
        {details?.isadmin===false?(<div className='rightnavbar'>
        {details.flag &&<NavLink to="/Registration" className="navlink">
            Registration
        </NavLink>}
        <NavLink to="/Voting" className="navlink">
            Voting
        </NavLink>
        <NavLink to="/Result" className="navlink">
            Results
        </NavLink>
      <i className="fas fa-bars burger-menu"></i>
        </div>):(<div className='rightnavbar'>
      <NavLink to="/Election" className="navlink">
        Elections
      </NavLink>
      <NavLink to="/Voters" className="navlink">
        Voters
      </NavLink>
      <NavLink to="/AddCandidate" className="navlink">
        Add Candidate
      </NavLink>
      <NavLink to="/Result" className="navlink">
        Results
      </NavLink>
        </div>)}
        
        
    </nav>
  )
}

export default Navbar