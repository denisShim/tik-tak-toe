import { useState } from 'react'
import './App.css'


const SYMBOL_X = "X";
const SYMBOL_O = "O";

const checkWinner = (cells) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function useGameState() {
  const [cells, setCells] = useState([null, null, null, null, null, null, null, null, null]);
  const [currentStep, setCurrentStep] = useState(SYMBOL_X);
  const [winnerCells, setWinnerCells] = useState();

  const handleCellClick = (index) => {
    if(cells[index] || winnerCells) return;
  
    const cellsCopy = cells.slice();
    cellsCopy[index] = currentStep;
  
    const winner = checkWinner(cellsCopy);
  
  
    setCells(cellsCopy);
    setCurrentStep(currentStep === SYMBOL_X ? SYMBOL_O : SYMBOL_X);
    setWinnerCells(winner);
  }
  
  const handleReset = () => {
    setCells(Array(9).fill(null));
    setWinnerCells(undefined);
    setCurrentStep(SYMBOL_X);
  }
  
  const winnerSymbol = winnerCells ? cells[winnerCells[0]] : undefined;
  const isDraw = !winnerCells && !cells.includes(null);

  return {
    cells,
    currentStep,
    winnerCells,
    handleCellClick,
    handleReset,
    winnerSymbol,
    isDraw
  }

}


function App() {

  const {
    cells,
    currentStep,
    winnerCells,
    handleCellClick,
    handleReset,
    winnerSymbol,
    isDraw
   } = useGameState();


  return (
    <>
      <div className='game'>
          <GameInfo
            isDraw={isDraw}
            currentStep={currentStep}
            winnerSymbol={winnerSymbol}
          />
        
        <div className="game-field">
          {cells.map((symbol, index) => { 
            const isWinner = winnerCells?.includes(index);
            return <Square
            key={index}
            nameClass={`cell ${isWinner ? 'cell--win' : ''}`}
            symbol={symbol}
            onCellClick={() => handleCellClick(index)}/>;
          })}
        </div>
        <div className="reset">
          <button className="reset__btn" onClick={handleReset}>RESET</button>
        </div>
      </div>
    </>
  )
}

function Square({symbol, onCellClick, nameClass}) {
  return (
    <button className={nameClass} onClick={onCellClick}>{
      // value ? <span className={`symbol ${getSymbolClassName(value)}`}>{value}</span> : null
      symbol ? <SpanCell step={symbol}/> : null
      }</button>
  );
}

function SpanCell({step}) {
  const getSymbolClassName = (symbol) => {
    if(symbol === SYMBOL_X) return "symbol--x";
    if(symbol === SYMBOL_O) return "symbol--o";
    return "";
  }
  return <span className={`symbol ${getSymbolClassName(step)}`}>{step}</span>
}

function GameInfo({isDraw, winnerSymbol, currentStep}) {
  if(isDraw) {
    return (
      <div className='game-info'>
        DRAW
      </div>
    )
  }

  if(winnerSymbol) {
    return (
      <div className='game-info'>
        Winner is - <SpanCell step={winnerSymbol}/>
      </div>
    )

  }

  return (
    <div className='game-info'>
      Move is - <SpanCell step={currentStep} />
    </div>
  )
}

export default App
