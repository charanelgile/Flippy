// Library Imports
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faStar,
  faHourglassStart,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

// Page & Component Imports
import Card from "./Card";

// Custom Hook Import
import useCountdownTimer from "../../hooks/useCountdownTimer";
import useCardHandler from "../../hooks/useCardHandler";
import useLetsBegin from "../../hooks/useLetsBegin";

const Cards4x4 = ({ level, dimensions, deck, setDeck }) => {
  const dataFromPreviousLevel = useLocation();

  const [countdown, mm, ss] = useCountdownTimer({ min: 0, sec: 40 });

  const [
    previous,
    setPrevious,
    flipCount,
    setFlipCount,
    score,
    setScore,
    totalScore,
    isLevelComplete,
    setIsLevelComplete,
    statChecker,
    computeFinalScore,
    // dimensions,
  ] = useCardHandler({ min: mm, sec: ss });

  // const [deck, setDeck] = useLetsBegin({
  //   gridDimensions: dimensions,
  // });

  // console.log(score);
  // console.log(totalScore);

  // Card Flipper (Click Handler)
  function cardFlipper(idx) {
    if (previous === -1) {
      setFlipCount(flipCount + 1);

      deck[idx].stat = "shown";

      setDeck([...deck]);
      setPrevious(idx);
    } else {
      cardTagger(idx);
    }
  }

  // Card Tagger (Correct or Wrong)
  function cardTagger(current) {
    if (deck[current].id === deck[previous].id) {
      if (deck[current].type !== deck[previous].type) {
        deck[current].stat = "correct";
        deck[previous].stat = "correct";

        setScore(score + 250);
        // setTotalScore(score + 250);

        // console.log(totalScore);

        setFlipCount(flipCount + 1);

        setDeck([...deck]);

        setPrevious(-1);

        // Determine if the status of all cards are "correct"
        // every() will only return true if all elements of the deck satisfy the conditions on statChecker
        if (deck.every(statChecker)) {
          setIsLevelComplete(!isLevelComplete);
          // setCurrentLevel(currentLevel + 1);
          computeFinalScore(mm, ss);
        }
      }
    } else {
      deck[current].stat = "wrong";
      deck[previous].stat = "wrong";

      setFlipCount(flipCount + 1);

      // Update the value of the State Variable for the Animation to Kick In
      setDeck([...deck]);

      setTimeout(() => {
        deck[current].stat = "";
        deck[previous].stat = "";

        setDeck([...deck]);
        setPrevious(-1);
      }, 500);
    }
  }

  // Level Failed
  if (countdown === "00:00" && isLevelComplete === false) {
    Swal.fire({
      title: "Game Over",
      text: "You failed to complete this level.",
    });
  }

  return (
    <div>
      <div className="d-flex justify-content-evenly mx-auto">
        <div className="divMechanics bg-warning mb-3">
          <p className="m-0 px-3 border border-3 rounded">
            <FontAwesomeIcon icon={faAward} />
            &nbsp;&nbsp;
            <span className="trackers">{totalScore}</span>
          </p>
        </div>

        <div className="divMechanics bg-warning mb-3">
          <p className="m-0 px-3 border border-3 rounded">
            <FontAwesomeIcon icon={faStar} />
            &nbsp;&nbsp;
            <span className="trackers">{score}</span>
          </p>
        </div>

        <div className="divMechanics bg-warning mb-3">
          <p className="m-0 px-3 border border-3 rounded">
            <FontAwesomeIcon icon={faHourglassStart} />
            &nbsp;&nbsp;
            <span className="trackers">{countdown}</span>
          </p>
        </div>
      </div>

      <div id="divCardGrid3x4" className={"divCardGrid " + dimensions}>
        {deck.map((card, index) => (
          <Card
            key={index}
            cardIndex={index}
            cardImage={card.img}
            cardStatus={card.stat}
            cardFlipper={cardFlipper}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards4x4;
