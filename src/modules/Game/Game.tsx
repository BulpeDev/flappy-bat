import React,{useRef, useState, useEffect, SetStateAction} from 'react';
import "./Game.css";
import  {BoxCollider}  from './Game.types';


interface GameProps{
    highScore: number;
    score: number;
    setScore : React.Dispatch<SetStateAction<number>>;
    setHighScore : React.Dispatch<SetStateAction<number>>;
    game : boolean;
    setGame: React.Dispatch<SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<SetStateAction<boolean>>;

}

const Game : React.FC<GameProps> = ({game, setGame , gameOver, score, setGameOver, highScore, setScore, setHighScore}) =>{



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

    let gameSpeed = 1000 / 120;
    let gameInterval : any;

    //audios

    const scoreAudio : HTMLAudioElement = new Audio(`${process.env.PUBLIC_URL}/storage/sound/score.mp3`);
    const flapAudio : HTMLAudioElement = new Audio(`${process.env.PUBLIC_URL}/storage/sound/flap.mp3`);
    const failAudio : HTMLAudioElement = new Audio(`${process.env.PUBLIC_URL}/storage/sound/fail.mp3`);
    const soundtrack : HTMLAudioElement = new Audio(`${process.env.PUBLIC_URL}/storage/sound/cave-9207.mp3`);
    
    soundtrack.volume = 0.6;
    flapAudio.volume = 1;
    let flapPlaying = false;
    soundtrack.loop = true;
    

    const resetGame = () : void => {
        batX = 50;
        batY = 50;
        batdVelocity = 0;
        batdAcceleration = 0.1;
        score = 0;
        setScore(0);
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
        document.body.onkeydown= (e: KeyboardEvent) =>{
            if(e.code === "Space" && game){
                if(!flapPlaying){
                    flapAudio.currentTime = 0;
                    flapAudio.play();
                    flapPlaying = true;
                }
                else {
                    flapAudio.pause();
                    flapAudio.currentTime = 0;
                    flapAudio.play();
                    flapPlaying = false;
                }
            }
        }
        document.body.ontouchstart =(e : TouchEvent) =>{
            batdVelocity = FLAP_SPEED
            if(!flapPlaying && game){
                flapAudio.currentTime = 0;
                flapAudio.play();
                flapPlaying = true;
            }
            if(flapPlaying && game) {
                flapAudio.pause();
                flapAudio.currentTime = 0;
                flapAudio.play();
                flapPlaying = false;
            }
        }

    },[game])

 
    useEffect(()=>{
        if(game && !gameOver){
            resetGame();
            soundtrack.play();
        }
    },[game])

    useEffect(()=>{ gameOver && clearInterval(gameInterval)},[gameOver])

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
                y: pipeY + PIPE_GAP ,
                width: PIPE_WIDTH,
                height: canvas.height - pipeY - PIPE_GAP
            }
        
            // Check for collision with upper pipe box
            if (batBox.x + batBox.width > topPipeBox.x &&
                batBox.x < topPipeBox.x + topPipeBox.width &&
                batBox.y < topPipeBox.y) { 
                    failAudio.play();
                    return true;
            }
        
            // Check for collision with lower pipe box
            if (batBox.x + batBox.width > bottomPipeBox.x &&
                batBox.x < bottomPipeBox.x + bottomPipeBox.width &&
                batBox.y + batBox.height >= bottomPipeBox.y) {
                    console.log(batBox.y + batBox.height , bottomPipeBox.y)
                    failAudio.play();
                    return true;
            }
        
            // check if bird hits boundaries
            if (batY < 0 || batY + BAT_HEIGHT > canvas.height) {
                failAudio.play();
                return true;
            }
        
            
            return false;
            
        }
        
        return false;
    }

    const endGame = () => {
        soundtrack.pause();
        if(score > highScore) setHighScore(score)
        setGame(false)
        setGameOver(true)
    }

    const increaseScore = () => {
        // increase now our counter when our flappy passes the pipes 
        
        if(batX > pipeX + PIPE_WIDTH && 
            (batY < pipeY + PIPE_GAP || 
              batY + BAT_HEIGHT > pipeY + PIPE_GAP) && 
              !scored) {
            scoreAudio.play();
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
                    clearInterval(gameInterval)
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

        }   
    }

    gameInterval = setInterval(loop, gameSpeed);
   

    return(

        <div className='game-box'>
            <canvas id='game-canvas' width={"400"} height={"600"}/>
            <div id="score-display">Score: {score}</div>
        </div>

    )

}


export default Game;