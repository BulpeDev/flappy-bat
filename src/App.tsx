import React, {useState, useEffect} from 'react';
import './App.css';
import Game from './modules/Game/Game';
import GameOverMenu from './modules/GameOverMenu/GameOverMenu';
import StartMenu from './modules/StartMenu/StartMenu';

const App : React.FC =()=> {

  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [showStartMenu, setShowStartMenu] = useState<boolean>(true)
  const [showGameOverMenu, setShowGameOverMenu] = useState<boolean>(false)
  const [game , setGame] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)
  
  useEffect(()=>{
    if(game)
      setShowStartMenu(false)
  },[game])

  useEffect(()=>{
    if(gameOver && !game){
      setShowGameOverMenu(true)
    }
    else{setShowGameOverMenu(false)}
    
    
  },[game])


  const handleStartGame = () : void => {
    setGame(true)
  }

  const handleRestartGame= () : void => {
    setGameOver(false)
    setGame(true)
  }

  return (
    <>
      {
        showStartMenu && <StartMenu  onClick ={()=>handleStartGame()} />
      }
      {
        showGameOverMenu &&  <GameOverMenu score={score} highScore={highScore} onClick={()=>handleRestartGame()}/>
      }
      <Game game={game} setGame={setGame} gameOver={gameOver} setGameOver={setGameOver}  highScore={highScore} score={score} setScore={setScore} setHighScore={setHighScore}/>
    </>
   
  
  );
}

export default App;
