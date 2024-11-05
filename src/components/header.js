import React from "react";
import { Link } from "gatsby";

const header = () => (
  <nav className="pt-4 pb-5">
    <ul
      style={{
        listStyle: "none",
        display: "flex",
        justifyContent: "space-evenly",
        fontFamily: "monospace",
        paddingLeft: 0,
      }}
    >
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/movies">Movies</Link>
      </li>
      <li>
        <Link to="/crawls">Crawls</Link>
      </li>
      <li>
        <Link to="/characters">Characters</Link>
      </li>
    </ul>
  </nav>
);

export default header;
