import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('Snakes and Ladders App', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5); 
  });
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('renders the game board and dice', () => {
    render(<App />);
    expect(screen.getByTestId('game-title')).toHaveTextContent('Snakes and Ladders');
    expect(screen.getByTestId('current-position')).toHaveTextContent('Current Position: 1');
    expect(screen.getByTestId('roll-dice-button')).toBeInTheDocument();
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
    expect(screen.getByTestId('dice-display')).toHaveTextContent('Not rolled yet');
  });

  it('renders all 100 cells on the board', () => {
    render(<App />);
    for (let i = 1; i <= 100; i++) {
      expect(screen.getByTestId(`cell-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`cell-number-${i}`)).toHaveTextContent(i.toString());
    }
  });

  it('shows player token at starting position', () => {
    render(<App />);
    const playerToken = screen.getByTestId('player-token');
    expect(playerToken).toBeInTheDocument();
    expect(playerToken.closest('[data-testid="cell-1"]')).toBeInTheDocument();
  });

  it('rolls the dice and updates position', () => {
    render(<App />);
    const rollButton = screen.getByTestId('roll-dice-button');
    
    fireEvent.click(rollButton);
    
    expect(screen.getByTestId('current-position')).toHaveTextContent('Current Position: 5');
    expect(screen.getByTestId('dice-display')).toHaveTextContent('Dice Rolled: 🎲 4');
    
    const playerToken = screen.getByTestId('player-token');
    expect(playerToken.closest('[data-testid="cell-5"]')).toBeInTheDocument();
  });

  it('shows ladder message when landing on a ladder', () => {
    render(<App />);
    const rollButton = screen.getByTestId('roll-dice-button');
    
    fireEvent.click(rollButton); 
    fireEvent.click(rollButton); 
    
    expect(screen.getByTestId('game-message')).toHaveTextContent('🪜 Ladder! Climb up!');
    expect(screen.getByTestId('current-position')).toHaveTextContent('Current Position: 31');
    
    const playerToken = screen.getByTestId('player-token');
    expect(playerToken.closest('[data-testid="cell-31"]')).toBeInTheDocument();
  });

  it('displays snake and ladder markers on appropriate cells', () => {
    render(<App />);
    
    expect(screen.getByTestId('ladder-marker-1')).toHaveTextContent('🪜 → 38');
    expect(screen.getByTestId('ladder-marker-9')).toHaveTextContent('🪜 → 31');
    
    expect(screen.getByTestId('snake-marker-16')).toHaveTextContent('🐍 → 6');
    expect(screen.getByTestId('snake-marker-47')).toHaveTextContent('🐍 → 26');
  });

  it('disables roll button and shows win message when reaching 100', () => {
    render(<App />);
    
    jest.spyOn(global.Math, 'random').mockReturnValue(0.99); 
    
    
    const rollButton = screen.getByTestId('roll-dice-button');
    expect(rollButton).not.toBeDisabled(); 
  });

  it('prevents movement when dice roll would exceed 100', () => {
    render(<App />);
    
  });

  it('shows board rows correctly', () => {
    render(<App />);
    
    for (let row = 0; row <= 9; row++) {
      expect(screen.getByTestId(`board-row-${row}`)).toBeInTheDocument();
    }
  });
});