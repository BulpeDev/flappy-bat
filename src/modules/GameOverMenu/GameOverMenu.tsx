import React from 'react';
import ReactDOM from 'react-dom';
import './GameOverMenu.css'

interface GameOverMenuProps {
    onClick: React.MouseEventHandler
    score: number,
    highScore: number
}

const GameOverMenu : React.FC<GameOverMenuProps> = ({onClick, score, highScore}) => {

    const gameOverMenuRoot = document.querySelector('#gameover-menu');

    if(!gameOverMenuRoot) return null;

    return ReactDOM.createPortal(
        <div className='gameover-menu__layaout'>
            <div className = 'gameover-menu'>
                <h1 className='gameover-menu__title'>GAME OVER!</h1>
                <div className='gameover-menu__scores'>
                    <p>Score: {score}</p>
                    <p>HighScore: {highScore}</p>
                </div>
                <button className='gameover-menu__button' onClick={onClick}>Restart Game</button>
            </div>
        </div>
    , gameOverMenuRoot)


}

export default GameOverMenu;