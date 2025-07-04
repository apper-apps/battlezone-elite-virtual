import { useState, useEffect, useCallback } from 'react';
import gameService from '@/services/api/gameService';
import audioService from '@/services/audioService';
import { calculateDistance3D } from '@/utils/gameUtils';
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

const movePlayer = useCallback(async (dx, dy, dz = 0) => {
    if (!gameState) return;
    
    try {
      const oldPosition = gameState.player.position;
      const updatedState = await gameService.movePlayer(gameState, dx, dy, dz);
      setGameState(updatedState);
      
      // Play movement audio if significant movement
      const newPosition = updatedState.player.position;
      const distance = calculateDistance3D(oldPosition, newPosition);
      if (distance > 0.1) {
        audioService.playSound('footstep', 0.3);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [gameState]);

const shootWeapon = useCallback(async (targetX, targetY, targetZ = 0) => {
    if (!gameState) return;
    
    try {
      const updatedState = await gameService.shootWeapon(gameState, targetX, targetY, targetZ);
      setGameState(updatedState);
      
      // Play weapon audio
      audioService.playSound('gunshot', 0.6);
      
      // Play hit sound if target was hit
      if (updatedState.hitTarget) {
        audioService.playSound('hit', 0.4);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [gameState]);

const selectWeapon = useCallback(async (weapon) => {
    if (!gameState) return;
    
    try {
      const updatedState = await gameService.selectWeapon(gameState, weapon);
      setGameState(updatedState);
      
      // Play weapon switch audio
      audioService.playSound('weaponSwitch', 0.4);
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