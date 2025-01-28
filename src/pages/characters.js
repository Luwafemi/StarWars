import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import Loader from "react-loader-spinner";

const CharactersPage = () => {
  let [characters, setCharacters] = useState([]);
  let [isError, setIsError] = useState(false);

  //Get and aggregate all StarWars characters across all pages
  useEffect(() => {
    let allCharacters = [];
    let getCharacters = async (page = 1) => {
      try {
        let response = await axios.get(
          `${process.env.GATSBY_PEOPLE_ENDPOINT}?page=${page}`
        );
        allCharacters = allCharacters.concat(response.data.results);

        if (response.data.next) {
          return getCharacters(page + 1);
        }
        setCharacters(allCharacters);
      } catch (error) {
        setIsError(true);
      }
    };
    getCharacters();
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
        (characters.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <Loader type="Bars" color="greenyellow" />
          </div>
        ) : (
          <ul style={{ color: "greenyellow", fontFamily: "monospace" }}>
            {characters.map(({ name }) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ))}
    </Layout>
  );
};
export default CharactersPage;
