/**
 * ============================================================
 * Member 4 — Dashboard State & Control Logic
 * Branch: feature/dashboard-state
 * 
 * Responsibilities:
 * - Maintain global state for the SCARE-KROW system
 * - Handle view switching between Camera and Dashboard
 * - Manage laser activation (manual, rule-based for night mode)
 * - Ensure dashboard reflects REAL events only
 * 
 * Design Decisions:
 * - Using React useState for reactive state management
 * - State is NOT persisted - resets on refresh (real data only)
 * - No fake/simulated data generation
 * ============================================================
 */

import { useState, useCallback } from 'react';

// Type definitions for type-safe state management
export type ViewMode = 'camera' | 'dashboard';
export type TimeMode = 'DAY' | 'NIGHT';

export interface DashboardState {
  // Core detection state - only incremented by real camera detection
  birdCount: number;
  
  // Camera state - true only when camera is actively streaming
  cameraActive: boolean;
  
  // Time-based mode - affects available features
  currentMode: TimeMode;
  
  // Laser deterrent state - manual activation only
  laserActive: boolean;
  
  // Current view being displayed
  currentView: ViewMode;
  
  // Timestamp of last detection (for display purposes)
  lastDetectionTime: Date | null;
}

export interface DashboardActions {
  // Increment bird count - called ONLY by vision.ts on real detection
  incrementBirdCount: () => void;
  
  // Camera control - updates cameraActive state
  setCameraActive: (active: boolean) => void;
  
  // Toggle between DAY and NIGHT modes
  toggleMode: () => void;
  
  // Toggle laser state - manual control only
  toggleLaser: () => void;
  
  // Switch between camera and dashboard views
  setCurrentView: (view: ViewMode) => void;
  
  // Reset all counters (for testing/demo purposes)
  resetCounters: () => void;
}

/**
 * Custom hook for managing SCARE-KROW dashboard state
 * 
 * This hook provides:
 * - Centralized state management
 * - Action functions for state updates
 * - Type-safe interface for components
 */
export function useDashboardState(): DashboardState & DashboardActions {
  // Core state - all values start at zero/false (no fake data)
  const [birdCount, setBirdCount] = useState<number>(0);
  const [cameraActive, setCameraActiveState] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<TimeMode>('DAY');
  const [laserActive, setLaserActive] = useState<boolean>(false);
  const [currentView, setCurrentViewState] = useState<ViewMode>('dashboard');
  const [lastDetectionTime, setLastDetectionTime] = useState<Date | null>(null);

  /**
   * Increment bird count by exactly 1
   * Called ONLY when vision.ts detects a real bird
   * Updates the last detection timestamp
   */
  const incrementBirdCount = useCallback(() => {
    setBirdCount(prev => prev + 1);
    setLastDetectionTime(new Date());
  }, []);

  /**
   * Update camera active state
   * When set to false, this signals that detection should stop
   */
  const setCameraActive = useCallback((active: boolean) => {
    setCameraActiveState(active);
    
    // If camera is turned off, laser should also deactivate
    // (no detection = no need for deterrent)
    if (!active) {
      setLaserActive(false);
    }
  }, []);

  /**
   * Toggle between DAY and NIGHT modes
   * Night mode enables manual laser control
   * Day mode uses camera-based detection
   */
  const toggleMode = useCallback(() => {
    setCurrentMode(prev => prev === 'DAY' ? 'NIGHT' : 'DAY');
  }, []);

  /**
   * Toggle laser deterrent
   * Only available in NIGHT mode (manual control)
   * In DAY mode, laser is controlled by detection events
   */
  const toggleLaser = useCallback(() => {
    setLaserActive(prev => !prev);
  }, []);

  /**
   * Switch between camera and dashboard views
   * Only one view visible at a time
   */
  const setCurrentView = useCallback((view: ViewMode) => {
    setCurrentViewState(view);
  }, []);

  /**
   * Reset all counters to zero
   * Used for testing or starting a new session
   */
  const resetCounters = useCallback(() => {
    setBirdCount(0);
    setLastDetectionTime(null);
  }, []);

  return {
    // State
    birdCount,
    cameraActive,
    currentMode,
    laserActive,
    currentView,
    lastDetectionTime,
    
    // Actions
    incrementBirdCount,
    setCameraActive,
    toggleMode,
    toggleLaser,
    setCurrentView,
    resetCounters,
  };
}

export default useDashboardState;
