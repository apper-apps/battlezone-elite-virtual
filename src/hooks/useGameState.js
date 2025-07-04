import { useState, useEffect, useCallback } from 'react';
import gameService from '@/services/api/gameService';

export const useGameState = () => {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeGame = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initialState = await gameService.initializeGame();
      setGameState(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGame = useCallback(async (currentState) => {
    try {
      const updatedState = await gameService.updateGame(currentState);
      setGameState(updatedState);
      return updatedState;
    } catch (err) {
      setError(err.message);
      return currentState;
    }
  }, []);

  const movePlayer = useCallback(async (dx, dy) => {
    if (!gameState) return;
    
    try {
      const updatedState = await gameService.movePlayer(gameState, dx, dy);
      setGameState(updatedState);
    } catch (err) {
      setError(err.message);
    }
  }, [gameState]);

  const shootWeapon = useCallback(async (targetX, targetY) => {
    if (!gameState) return;
    
    try {
      const updatedState = await gameService.shootWeapon(gameState, targetX, targetY);
      setGameState(updatedState);
    } catch (err) {
      setError(err.message);
    }
  }, [gameState]);

  const selectWeapon = useCallback(async (weapon) => {
    if (!gameState) return;
    
    try {
      const updatedState = await gameService.selectWeapon(gameState, weapon);
      setGameState(updatedState);
    } catch (err) {
      setError(err.message);
    }
  }, [gameState]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    gameState,
    isLoading,
    error,
    initializeGame,
    updateGame,
    movePlayer,
    shootWeapon,
    selectWeapon
  };
};