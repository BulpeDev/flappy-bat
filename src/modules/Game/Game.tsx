import React,{useRef, useState, useEffect, SetStateAction} from 'react';
import "./Game.css";
import  {BoxCollider}  from './Game.types';


interface GameProps{
    score: number;
    highScore: number;
    setScore : React.Dispatch<SetStateAction<number>>;
    setHighScore : React.Dispatch<SetStateAction<number>>;
    game : boolean;
    setGame: React.Dispatch<SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<SetStateAction<boolean>>;

}

const Game : React.FC<GameProps> = ({game, setGame , gameOver, setGameOver, score = 0, highScore, setScore, setHighScore}) =>{

    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    let canvas : HTMLCanvasElement | null = document.querySelector('#game-canvas')
    let ctx: CanvasRenderingContext2D | null;
    const batImg : HTMLImageElement = new Image();
    
    //Bat variables
    let batX : number = 50;
    let batY : number = 50;
    let batdVelocity : number = 0;
    let batdAcceleration : number = 0.1;

    //Pipe variabl
    let pipeX  = 400;
    let pipeY : number; 

    let scored = false;

    //Games Constant
    const FLAP_SPEED  = -5;
    const BAT_WIDTH = 122;
    const BAT_HEIGHT = 77                        
    const PIPE_WIDTH = 50;
    const PIPE_GAP = 175;

    

    const resetGame = () : void => {
        batX = 50;
        batY = 50;
        batdVelocity = 0;
        batdAcceleration = 0.1;
    }
   
    useEffect(() =>{

        if(canvas instanceof HTMLCanvasElement){
            ctx = canvas.getContext("2d");
            pipeY = canvas.height - 200;
             

        }
        batImg.src = `${process.env.PUBLIC_URL}/storage/images/bat.png`;
        document.body.onkeyup = (e: KeyboardEvent) =>{
            if(e.code === "Space"){
                batdVelocity = FLAP_SPEED    
            }
        }
        document.body.ontouchstart =(e : TouchEvent) =>{
            batdVelocity = FLAP_SPEED
        }

    },[game])

 
    useEffect(()=>{
        if(game && !gameOver){
            resetGame();
            loop();
        }
    },[game])

    const collisionCheck = () : boolean =>{
        if(canvas instanceof HTMLCanvasElement){
            const batBox = {
                x: batX,
                y: batY,
                width: BAT_WIDTH,
                height: BAT_HEIGHT
            }
        
            const topPipeBox = {
                x: pipeX,
                y: pipeY - PIPE_GAP + BAT_HEIGHT,
                width: PIPE_WIDTH,
                height: pipeY
            }
        
            const bottomPipeBox = {
                x: pipeX,
                y: pipeY + PIPE_GAP + BAT_HEIGHT,
                width: PIPE_WIDTH,
                height: canvas.height - pipeY - PIPE_GAP
            }
        
            // Check for collision with upper pipe box
            if (batBox.x + batBox.width > topPipeBox.x &&
                batBox.x < topPipeBox.x + topPipeBox.width &&
                batBox.y < topPipeBox.y) { 
                    return true;
            }
        
            // Check for collision with lower pipe box
            if (batBox.x + batBox.width > bottomPipeBox.x &&
                batBox.x < bottomPipeBox.x + bottomPipeBox.width &&
                batBox.y + batBox.height > bottomPipeBox.y) {
                    return true;
            }
        
            // check if bird hits boundaries
            if (batY < 0 || batY + BAT_HEIGHT > canvas.height) {
                return true;
            }
        
            
            return false;
            
        }
        
        return false;
    }

    const endGame = () => {
        if(score > highScore) setHighScore(score)
        setScore(0)
        setGame(false)
        setGameOver(true)
    }

    const increaseScore = () => {
        // increase now our counter when our flappy passes the pipes 
        
        if(batX > pipeX + PIPE_WIDTH && 
            (batY < pipeY + PIPE_GAP || 
              batY + BAT_HEIGHT > pipeY + PIPE_GAP) && 
              !scored) {
            score++;
            setScore(score)
            scored = true;
        }
    
        // reset the flag, if bird passes the pipes
        if (batX < pipeX + PIPE_WIDTH) {
            scored = false;
        }
    }

    

    const loop = () : void  =>{

        if(canvas instanceof HTMLCanvasElement && ctx instanceof CanvasRenderingContext2D){
          
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(batImg, batX, batY);
    
                ctx.fillStyle = '#11111b'         
                ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
                ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);
                
                if (collisionCheck()) {
                    endGame();
                    return;
                }   
                pipeX -= 1.5;
                if (pipeX < -50) {
                    pipeX = 400;
                    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
                }
              
                batdVelocity += batdAcceleration;
                batY += batdVelocity;
    
                increaseScore()
                //para controlar los fotogramas
                setTimeout(() =>{
                    requestAnimationFrame(loop);
                },1000/120)
                
        }   
    }
    return(

        <div className='game-box'>
            <canvas id='game-canvas' width={"400"} height={"600"}/>
            <div id="score-display">Score: {score}</div>
        </div>

    )

}


export default Game;