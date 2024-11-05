import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import Loader from "react-loader-spinner";

const MoviesPage = () => {
  let [filmTitles, setFilmTitles] = useState([]);
  let [isError, setIsError] = useState(false);

  useEffect(() => {
    // API request for films data

    let getFilms = async () => {
      try {
        let response = await axios.get(`${process.env.GATSBY_FILMS_ENDPOINT}`);
        let filmData = response.data.results;
        setFilmTitles(filmData);
      } catch (error) {
        setIsError(true);
      }
    };
    getFilms();
  }, []);
  return (
    <Layout>
      {isError && (
        <div
          className="alert alert-warning"
          role="alert"
          style={{ textAlign: "center" }}
        >
          <pre>
            We are sorry, something went wrong! Check your connection and try
            again.
          </pre>
        </div>
      )}
      {!isError &&
        (filmTitles.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <Loader type="BallTriangle" color="#FFF" />
          </div>
        ) : (
          <ul style={{ color: "greenyellow", fontFamily: "monospace" }}>
            {filmTitles.map(({ title }) => (
              <li className="mb-5" key={title}>
                {title}
              </li>
            ))}
          </ul>
        ))}
    </Layout>
  );
};

export default MoviesPage;
