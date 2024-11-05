import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import Loader from "react-loader-spinner";

const CharactersPage = () => {
  let [characters, setCharacters] = useState([]);
  let [isError, setIsError] = useState(false);

  useEffect(() => {
    //Get all StarWars characters across all pages
    let getCharacters = async (page = 1) => {
      try {
        let query = `${process.env.GATSBY_PEOPLE_ENDPOINT}?page=${page}`;
        let response = await axios.get(query);
        let charactersData = response.data.results;
        if (response.data.next) {
          return charactersData.concat(await getCharacters(page + 1));
        }
        return charactersData;
      } catch (error) {
        setIsError(true);
      }
    };
    // Await getCharacters(), as it returns a promise
    let awaitGetCharacters = async () => {
      try {
        let response = await getCharacters();
        setCharacters(response);
      } catch (error) {
        setIsError(true);
      }
    };
    awaitGetCharacters();
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
            <Loader type="BallTriangle" color="#FFF" />
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
