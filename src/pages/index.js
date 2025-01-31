import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Loader from "react-loader-spinner";
import axios from "axios";
import logo from "../assets/star_wars_logo.png";

const App = () => {
  let [filmData, setFilmData] = useState([]);
  let [characters, setCharacters] = useState([]);
  let [filmID, setFilmID] = useState(null);
  let [openingCrawl, setOpeningCrawl] = useState(null);
  let [isError, setIsError] = useState(false);

  //get and store data (titles, characters, crawls, etc) for all films, from external API
  useEffect(() => {
    (async () => {
      try {
        let result = await axios(`${process.env.GATSBY_FILMS_ENDPOINT}`);
        setFilmData(result.data.results);
      } catch (error) {
        setIsError(true);
      }
    })();
  }, []);

  //structure out the data we need from what was provided by the API
  let newFilmData = filmData.map((item) => ({
    id: item.episode_id,
    title: item.title,
    opening_crawl: item.opening_crawl,
    characters: item.characters,
  }));
  //array of filmData for the select element - avoid API delay
  let staticFilmData = [
    { id: 1, title: "The Phantom Menace" },
    { id: 2, title: "Attack of the Clones" },
    { id: 3, title: "Revenge of the Sith" },
    { id: 4, title: "A New Hope" },
    { id: 5, title: "The Empire Strikes Back" },
    { id: 6, title: "Return of the Jedi" },
  ];

  //build an array of the characters, using the URLS of the characters, provided by the API
  async function buildCharacterList(charactersUrl) {
    let charactersList = await Promise.all(
      charactersUrl.map(async (url) => {
        try {
          let result = await axios(url);
          return result.data.name;
        } catch (error) {
          setIsError(true);
          return null;
        }
      })
    );
    return charactersList;
  }

  //onChange handler for 'select' element
  async function handleChange(e) {
    let chosenFilmID = Number(e.target.value);
    let currentFilm = newFilmData.find((film) => film.id === chosenFilmID);
    let currentFilmCharactersUrl = currentFilm.characters;

    setFilmID(chosenFilmID);
    setOpeningCrawl(currentFilm.opening_crawl);

    let charactersList = await buildCharacterList(currentFilmCharactersUrl);
    setCharacters(charactersList);
  }

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        {isError && (
          <div className="alert alert-warning" role="alert">
            <pre>
              We are sorry, something went wrong! Check your connection and try
              again.
            </pre>
          </div>
        )}

        {!isError && (
          <div className="input-group mb-3 dropdown">
            <select
              onChange={handleChange}
              className="custom-select dropdown_right "
              defaultValue="selectMovie"
            >
              <option value="selectMovie" hidden>
                Select Movie
              </option>
              {staticFilmData.map(({ id, title }) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        )}

        {openingCrawl && (
          <marquee
            style={{
              background: "#1b1c1d",
              color: "greenyellow",
              width: "60%",
              border: "17px solid rgb(27, 28, 29)",
            }}
          >
            {openingCrawl}
          </marquee>
        )}
      </div>

      <div className="logo_table ">
        {!isError &&
          (filmID === null ? (
            <img
              src={logo}
              alt="StarWars_Logo"
              style={{ width: 300, height: 300 }}
            />
          ) : characters.length === 0 ? (
            <Loader type="Bars" color="greenyellow" height={60} width={60} />
          ) : (
            <table
              className="table bg-warning"
              style={{ marginTop: 30, color: "#fff", background: "#ff9800" }}
            >
              <thead
                style={{
                  background: "#000",
                  fontFamily: "monospace",
                  fontSize: 25,
                }}
              >
                <tr>
                  <th scope="col">Characters</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((name) => (
                  <tr key={name}>
                    <td>{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
      </div>
    </Layout>
  );
};

export default App;
