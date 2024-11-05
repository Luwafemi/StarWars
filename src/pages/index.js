import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Loader from "react-loader-spinner";
import axios from "axios";
import logo from "../assets/star_wars_logo.png";

const App = () => {
  let [data, setData] = useState({ results: [] });
  let [filmCharacters, setFilmCharacters] = useState([]);
  let [value, setValue] = useState(null);
  let [openingCrawl, setOpeningCrawl] = useState(null);
  let [isError, setIsError] = useState(false);

  useEffect(() => {
    //API request for films data
    async function fetchMovieData() {
      setIsError(false);
      try {
        let result = await axios(`${process.env.GATSBY_FILMS_ENDPOINT}`);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
    }
    fetchMovieData();
  }, [filmCharacters]);

  let filmOptions = data.results.map((item) => ({
    key: item.episode_id,
    text: item.title,
    value: item.episode_id,
    date: item.release_date,
    opening_crawl: item.opening_crawl,
    characters: item.characters,
  }));

  function buildCharacterList(data) {
    let list = [];
    Promise.all(
      data.map(async (url) => {
        try {
          let result = await axios(url);
          list.push(result.data);
        } catch (error) {
          setIsError(true);
          return;
        }
      })
    );
    return list;
  }
  function handleChange(e) {
    let value = Number(e.target.value);
    let currentFilm = filmOptions.find((film) => film.value === value);
    let currentFilmCharactersUrl = currentFilm.characters;

    let charactersList = buildCharacterList(currentFilmCharactersUrl);

    return [
      setValue(value),
      setFilmCharacters(charactersList),
      setOpeningCrawl(currentFilm.opening_crawl),
    ];
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
              defaultValue="random"
            >
              <option value="random" disabled hidden>
                Select Movie
              </option>
              {filmOptions.map(({ key, value, text }) => (
                <option key={key} value={value}>
                  {text}
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
          (value === null ? (
            <img
              src={logo}
              alt="StarWars_Logo"
              style={{ width: 300, height: 300 }}
            />
          ) : filmCharacters.length === 0 ? (
            <Loader type="BallTriangle" color="#FFF" height={100} width={100} />
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
                {filmCharacters.map(({ name }) => (
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
