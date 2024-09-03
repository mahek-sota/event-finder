import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { NavLink, useLocation } from 'react-router-dom';


export default function Navbar() {
  const matchSearch = useMatch('/search');
  const matchFavorites = useMatch('/favorites');

  const location = useLocation();

  return (
    <nav className="navbar navbar-expand">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link
              to="/search"
              className={`nav-link ${location.pathname === '/search' ? 'active border border-white' : ''}`}
              style={{textDecoration: 'none', color: 'white', border: '1px solid transparent', borderRadius: '12px'}}
              onMouseOver={(e) => e.target.style.border = '1px solid white'}
              onMouseOut={(e) => e.target.style.border =  '1px solid transparent'}
            >
              Search
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/favorites"
              className={`nav-link ${location.pathname === '/favorites' ? 'active border border-white' : ''}`}
              style={{textDecoration: 'none', color: 'white', border: '1px solid transparent', borderRadius: '12px'}}
              onMouseOver={(e) => e.target.style.border = '1px solid white'}
              onMouseOut={(e) => e.target.style.border =  '1px solid transparent'}
            >
              Favourites
            </Link>
          </li>
        </ul>
    </nav>
  );
}
