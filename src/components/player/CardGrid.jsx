// Library Imports
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHourglassStart } from "@fortawesome/free-solid-svg-icons";

// Page & Component Imports
import Card from "./Card";

// Custom Hook Import
import useCountdownTimer from "../../hooks/useCountdownTimer";

function CardGrid({ deck, setDeck, gridWidth, gridDimensions }) {
  const [countdown, mm, ss] = useCountdownTimer({ min: 5, sec: 15 });

  const [flipCount, setFlipCount] = useState(0);

  const [previous, setPrevious] = useState(-1);

  const [score, setScore] = useState(0);

  // Card Tagger (Correct or Wrong)
  function cardTagger(current) {
    if (deck[current].id === deck[previous].id) {
      if (deck[current].type !== deck[previous].type) {
        deck[current].stat = "correct";
        deck[previous].stat = "correct";

        setScore(score + 250);

        setFlipCount(flipCount + 1);

        setDeck([...deck]);

        setPrevious(-1);

        // Determine if the status of all cards are "correct"
        // every() will only return true if all elements of the deck satisfy the conditions on statChecker
        if (deck.every(statChecker)) {
          console.log("Level Complete!");

          console.log(`Remaining minutes: ${mm}`);
          console.log(`Remaining seconds: ${ss}`);

          const overall = mm * 60 + ss;
          console.log(`Remaining time (overall): ${overall}`);

          const timeBonus = overall * 50;
          console.log(`Time Bonus (Score from remaining time): ${timeBonus}`);
          const finalScore = score + 250;
          console.log(`Score from matched pairs flipped: ${finalScore}`);

          const totalScore = finalScore + timeBonus;
          console.log(`Overall Score: ${totalScore}`);
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

  // Status Checker
  const statChecker = (element, index, array) => {
    // Returns true for the First Element
    // This will serve as the Point of Comparison
    if (index === 0) {
      return true;
    } else {
      // Returns true if the Status of the Current Element is equal to the Status of the Previous Element
      return element.stat === array[index - 1].stat;
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-evenly mx-auto"
        style={{ width: gridWidth }}>
        {/* <p
            id="lblFlipCounter"
            className="rounded border border-3 border-warning px-3">
            <FontAwesomeIcon icon={faRightLeft} />
            &nbsp;
            <span id="valFlipCounter">{flipCount}</span>
          </p> */}

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

      <div
        className={"divCardGrid " + gridDimensions}
        style={{ width: gridWidth }}>
        {deck.map((card, index) => (
          <Card
            key={index}
            cardID={index}
            cardImage={card.img}
            cardStatus={card.stat}
            cardFlipper={cardFlipper}
          />
        ))}
      </div>
    </div>
  );
}

export default CardGrid;
