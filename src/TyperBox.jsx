import React, { useEffect, useRef, useState } from "react";
import { wordList } from "./wordBag";

const alphabet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "æ", "ø", "å"
];

function TyperBox() {
  const inputRef = useRef(null);
  const [showcase, setShowcase] = useState("");
  const [counter, setCounter] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const currentInputRef = inputRef.current;
    if (currentInputRef) {
      currentInputRef.addEventListener("blur", handleFocus);
    }

    return () => {
      if (currentInputRef) {
        currentInputRef.removeEventListener("blur", handleFocus);
      }
    };
  }, []);

  const startTest = () => {
    setTestStarted(false);
    setTestFinished(false);
    setCounter(0);
    setShowcase("");
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setTestStarted(true);
          setTimeLeft(60);
          init();

          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);

          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === 1) {
            clearInterval(timer);
            setTestStarted(false);
            setTestFinished(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft]);

  const compare = () => {
    if (!testStarted) return;

    let newShowcase = showcase.split("");
    let input = document.getElementById("input").value.split("");

    if (newShowcase.length === 0 || input.length === 0) return;

    if (newShowcase[0] === input[0]) {
      setCounter(prevCounter => prevCounter + 1);
      newShowcase.shift();
      input.shift();
    } else {
      input.shift();
    }

    setShowcase(newShowcase.join(""));
    document.getElementById("input").value = input.join("");

    randomLetters(newShowcase);
  };

  const randomLetters = (currentShowcase) => {
    if (currentShowcase.length === 0 || (currentShowcase[0] === " " && countSpaces(currentShowcase) <= 2)) {
      currentShowcase.push(" " + returnWord());
    }
    setShowcase(currentShowcase.join(""));
  };

  const returnWord = () => {
    const dice = Math.floor(Math.random() * wordList.length);
    return wordList[dice];
  };

  const init = () => {
    let initialShowcase = "";
    for (let i = 0; i < 3; i++) {
      initialShowcase += returnWord() + " ";
    }
    setShowcase(initialShowcase.trim());
  };

  const countSpaces = (currentShowcase) => {
    return (currentShowcase.join("").match(/ /g) || []).length;
  };

  const renderShowcase = () => {
    if (showcase.length === 0) return null;
    const chars = showcase.split("");
    return chars.map((char, index) => (
      <span key={index} className={index === 0 ? 'next-char' : ''}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div>
      {!testStarted && !testFinished && <button onClick={startTest}>Start</button>}
      {countdown > 0 && <div>Starting in {countdown}</div>}
      {testStarted && (
        <div>
          <div id="counter">Words typed: {counter}</div>
          <div>Time left: {timeLeft}s</div>
          <input
            id="input"
            ref={inputRef}
            onChange={compare}
            placeholder="Start typing..."
          />
        </div>
      )}
      {testFinished && <div>Time's up! You typed {counter} words.</div>}
      <div id="showcase">{renderShowcase()}</div>
    </div>
  );
}

export default TyperBox;
