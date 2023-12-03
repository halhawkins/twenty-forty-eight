import React, { useEffect } from 'react';
import './App.css';
import GameBoard from './GameBoard/GameBoard';

type ScoreProps = {
  score: number
}
function Score(props: ScoreProps) {
  return (
    <div className='score-container'>
      <div className='score'>Score: {props.score}</div>
    </div>
  );
}

type AllTimeHighProps = {
  score: number
}
function AllTimeHigh(props: AllTimeHighProps) {

  return (
    <div className='score-container'>
      <div className='all-time-high-score'>All time high score: {props.score}</div>
    </div>
  );
}
function App() {
  const [score, setScore] = React.useState(0);
  const [allTimeHighScore, setAllTimeHighScore] = React.useState<number>(Number(localStorage.getItem('allTimeHighScore')) || 0);

  useEffect(() => {
    setAllTimeHighScore(Number(localStorage.getItem('allTimeHighScore')) || 0);
    console.log("allTimeHighScore",allTimeHighScore)
  })

  const addToScore = (num: number) => {
    console.log("addToScore", num);
    if (num > allTimeHighScore){
      localStorage.setItem('allTimeHighScore', num.toString());
      setAllTimeHighScore(num);
    }
    setScore(score + num);
  }

  return (
    <div className="App">
      <AllTimeHigh score={score}/>
      <Score score={score}/>
      <GameBoard score={addToScore}/> 
      {/* score={(score:addToScore) => addToScore(score)} */}
    </div>
  );
}

export default App;
