import React from 'react';
import ReactDOM from 'react-dom';
import  './StartMenu.css';

interface StartMenuProps{
    onClick: React.MouseEventHandler
}

const StartGame : React.FC<StartMenuProps> = ({onClick}) =>{

    const startGameRoot = document.querySelector('#start-menu');
    if (!startGameRoot) return null;

    return ReactDOM.createPortal(
        <div className='start-menu__layaout'> 
            <div className='start-menu'>
            <h1 className='start-menu__title'>Flappy bat</h1>
            <button className='start-menu__button' onClick={onClick}>Start Game</button>
            </div>
        </div>
     

    , startGameRoot)

}


export default StartGame;