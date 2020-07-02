import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import axios from "axios";
import { selectLanguage } from "../../store/appState/selectors";
import { selectUser } from "../../store/user/selectors";
import { updateScore } from "../../store/user/actions";
import Loading from "../../components/Loading";
import "./index.css";

export default function Click() {
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();

  const [state, setState] = useState({});
  const [randomTag, setRandomTag] = useState([]);
  const [msg, setMsg] = useState("");
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const [retry, setRetry] = useState(false);

  const randomAnimal = "https://source.unsplash.com/500x300/?animal";
  const randomFood = "https://source.unsplash.com/500x300/?food";
  //const randomClothes = 'https://source.unsplash.com/500x300/?clothes';
  const language = useSelector(selectLanguage);

  useEffect(() => {
    const imaggaKey = process.env.REACT_APP_IMAGGA_KEY;
    //axios configuration object with auth header,
    //limit (otherwise it fetches 100 tags),
    //and language code
    const axiosConfig = {
      headers: { Authorization: `Basic ${imaggaKey}` },
      params: { limit: 3, language: language },
    };

    async function getImageTags() {
      try {
        //get 3 random images, 1 of each category
        const imageResponses = await Promise.all([
          await axios.get(`${randomAnimal}`),
          await axios.get(`${randomFood}`),
          //await axios.get(`${randomClothes}`)
        ]);
        //get the actual URLs in an array
        const imageURLS = imageResponses.map((res) => res.request.responseURL);

        //Generate tags for the random images using Imagga
        const tagsResponses = await Promise.all([
          axios.get(
            `https://api.imagga.com/v2/tags?image_url=${imageURLS[0]}`,
            axiosConfig
          ),
          axios.get(
            `https://api.imagga.com/v2/tags?image_url=${imageURLS[1]}`,
            axiosConfig
          ),
          //axios.get(`https://api.imagga.com/v2/tags?image_url=${imageURLS[2]}`, axiosConfig)
        ]);

        //create arrays with tags
        const imageTags = tagsResponses.map((res) => res.data.result.tags);
        const animalTags = imageTags[0].map((tag) => tag.tag[language]);
        const foodTags = imageTags[1].map((tag) => tag.tag[language]);
        const tagArray = [...animalTags, ...foodTags];

        //grab a random index of the tags array
        setRandomTag(tagArray[Math.floor(Math.random() * tagArray.length)]);

        setState({
          animal: { url: imageURLS[0], tags: [...animalTags] },
          food: { url: imageURLS[1], tags: [...foodTags] },
          //clothes: { url: imageURLS[2], tags: imageTags[2] }
        });
      } catch (e) {
        console.log(e);
        console.log("retrying");
        //Imagga fails occasionally (like 1 in 25 calls)
        //this retries once if that happens
        if (!retry) setRetry(true);
        if (!!retry) return;
      }
    }
    getImageTags();
  }, [count, language, retry]);

  function nextRound() {
    setCount(count + 1);
    setMsg("");
    setState({});
    setRandomTag("");
    setRetry(false);
  }

  function clickedImage(e) {
    if (msg) return;
    if (state[e.target.alt].tags.includes(randomTag)) {
      setMsg("Correct!");
      setScore(score + 1);
    } else setMsg("Incorrect");
  }

  //if(count >= 6) return <div><h1>Finished! <br/>Your Score: {score}/5</h1></div>
  if (msg === "Incorrect") {
    if (userData.scoreList?.[language] < score)
      dispatch(updateScore(language, score));

    console.log(userData.scoreList?.[language], score);

    return (
      <div className="finalMsg">
        <h1 className="head">GAME OVER</h1>
        {userData.scoreList?.[language] < score ? (
          <h5 className="head">New Highscore: {score}</h5>
        ) : (
          <h5>Too Bad! You did better last time.</h5>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="head">Click the Pic </h1>
      <h3 className="head"> Round {count} / Endless</h3>
      <hr className="hrLine"></hr>
      <h1 className="randomTag">{randomTag}</h1>
      {state.animal ? (
        <div className="randomImages">
          <img
            className="img1"
            src={state.animal.url}
            alt="animal"
            onClick={clickedImage}
          />
          <img
            className="img2"
            src={state.food.url}
            alt="food"
            onClick={clickedImage}
          />
        </div>
      ) : (
        <Loading />
      )}
      <div className="nextButtonArea">
        <h2 className="correct-incorrectMsg">{msg}</h2>
        <Button className="nextButton" disabled={!msg} onClick={nextRound}>
          NEXT
        </Button>
      </div>
    </div>
  );
}
