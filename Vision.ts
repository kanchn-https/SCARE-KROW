/**
 * ============================================================
 * Member 3 — Camera & Bird Detection Logic
 * Branch: feature/bird-vision
 * 
 * Responsibilities:
 * - Access laptop camera using getUserMedia API
 * - Start camera ONLY when user clicks "Open Camera"
 * - Process real camera frames for detection
 * - Detect ONLY birds using TensorFlow.js + COCO-SSD
 * - Increment birdCount by exactly 1 per detection
 * - Stop detection immediately when camera is closed
 * 
 * Technical Implementation:
 * - Uses TensorFlow.js for browser-based ML inference
 * - COCO-SSD model pre-trained on 80 classes including "bird"
 * - Real-time object detection on video frames
 * - NO simulated or random data generation
 * ============================================================
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

interface UseVisionProps {
  // Callback to increment bird count in dashboard state
  onBirdDetected: () => void;
  
  // Callback to update camera active state
  onCameraStateChange: (active: boolean) => void;
  
  // Current camera active state from dashboard
  cameraActive: boolean;
}

interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

interface UseVisionReturn {
  // Ref to attach to video element
  videoRef: React.RefObject<HTMLVideoElement>;
  
  // Ref to attach to canvas element (for detection overlay)
  canvasRef: React.RefObject<HTMLCanvasElement>;
  
  // Start camera stream
  startCamera: () => Promise<void>;
  
  // Stop camera stream and detection
  stopCamera: () => void;
  
  // Model loading state
  isModelLoading: boolean;
  
  // Current detections for display
  currentDetections: Detection[];
}

/**
 * Custom hook for camera access and REAL bird detection
 * 
 * Uses TensorFlow.js with COCO-SSD model for actual ML inference
 * COCO dataset includes "bird" as class ID 15
 * 
 * Detection pipeline:
 * 1. Load COCO-SSD model on mount
 * 2. Start camera stream when requested
 * 3. Run inference on each frame
 * 4. Filter detections to ONLY birds
 * 5. Call onBirdDetected for each new bird detected
 */
export function useVision({
  onBirdDetected,
  onCameraStateChange,
  cameraActive,
}: UseVisionProps): UseVisionReturn {
  // Refs for DOM elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ref to store the media stream for cleanup
  const streamRef = useRef<MediaStream | null>(null);
  
  // Ref for detection animation frame
  const animationFrameRef = useRef<number | null>(null);
  
  // Ref to track if currently streaming
  const isStreamingRef = useRef<boolean>(false);
  
  // ML Model state
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  
  // Current detections for overlay display
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  
  // Ref to track last detection time (debounce rapid detections)
  const lastDetectionTimeRef = useRef<number>(0);
  
  // Minimum time between counting new birds (prevents counting same bird multiple times)
  const DETECTION_COOLDOWN_MS = 2000;
  
  // Confidence threshold for bird detection
  const CONFIDENCE_THRESHOLD = 0.5;

  /**
   * Load COCO-SSD model on component mount
   * This happens once and the model stays loaded
   */
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('[Vision] Loading TensorFlow.js backend...');
        await tf.ready();
        console.log('[Vision] TensorFlow.js ready, backend:', tf.getBackend());
        
        console.log('[Vision] Loading COCO-SSD model...');
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2' // Fast model suitable for real-time detection
        });
        
        setModel(loadedModel);
        setIsModelLoading(false);
        console.log('[Vision] COCO-SSD model loaded successfully!');
      } catch (error) {
        console.error('[Vision] Failed to load model:', error);
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  /**
   * Start the camera stream
   * Called when user clicks "Open Camera" button
   */
  const startCamera = useCallback(async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      isStreamingRef.current = true;
      onCameraStateChange(true);

      // Start detection loop if model is loaded
      if (model) {
        startDetectionLoop();
      }

      console.log('[Vision] Camera started successfully');
    } catch (error) {
      console.error('[Vision] Failed to start camera:', error);
      isStreamingRef.current = false;
      onCameraStateChange(false);
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          alert('Camera access denied. Please allow camera access to use bird detection.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera found. Please connect a camera and try again.');
        }
      }
    }
  }, [model, onCameraStateChange]);

  /**
   * Stop the camera stream and detection
   */
  const stopCamera = useCallback(() => {
    // Cancel detection loop FIRST
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear detections
    setCurrentDetections([]);

    // Update states
    isStreamingRef.current = false;
    onCameraStateChange(false);

    console.log('[Vision] Camera stopped');
  }, [onCameraStateChange]);

  /**
   * Main detection loop using requestAnimationFrame
   * Runs inference on each frame and filters for birds
   */
  const startDetectionLoop = useCallback(() => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const detectFrame = async () => {
      // Stop if camera is no longer streaming
      if (!isStreamingRef.current) return;

      // Ensure video has valid dimensions
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        try {
          // Run COCO-SSD detection on current frame
          const predictions = await model.detect(video);
          
          // Filter to ONLY birds with confidence above threshold
          const birdDetections = predictions.filter(
            pred => pred.class === 'bird' && pred.score >= CONFIDENCE_THRESHOLD
          );

          // Update current detections for overlay
          setCurrentDetections(birdDetections.map(p => ({
            bbox: p.bbox as [number, number, number, number],
            class: p.class,
            score: p.score
          })));

          // Draw detection boxes on canvas
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            birdDetections.forEach(detection => {
              const [x, y, width, height] = detection.bbox;
              
              // Draw bounding box
              ctx.strokeStyle = '#84cc16'; // Primary lime green
              ctx.lineWidth = 3;
              ctx.strokeRect(x, y, width, height);
              
              // Draw label background
              ctx.fillStyle = '#84cc16';
              const label = `BIRD ${(detection.score * 100).toFixed(0)}%`;
              const textWidth = ctx.measureText(label).width;
              ctx.fillRect(x, y - 25, textWidth + 10, 25);
              
              // Draw label text
              ctx.fillStyle = '#0a0c0f';
              ctx.font = 'bold 14px Inter, sans-serif';
              ctx.fillText(label, x + 5, y - 7);
            });
          }

          // Increment bird count (with cooldown to prevent counting same bird repeatedly)
          if (birdDetections.length > 0) {
            const now = Date.now();
            if (now - lastDetectionTimeRef.current > DETECTION_COOLDOWN_MS) {
              // Count each unique bird detected in this frame
              // For simplicity, we count 1 per cooldown period when birds are present
              onBirdDetected();
              lastDetectionTimeRef.current = now;
              console.log('[Vision] Bird detected! Confidence:', birdDetections[0].score.toFixed(2));
            }
          }
        } catch (error) {
          console.error('[Vision] Detection error:', error);
        }
      }

      // Continue detection loop
      animationFrameRef.current = requestAnimationFrame(detectFrame);
    };

    // Start the loop
    animationFrameRef.current = requestAnimationFrame(detectFrame);
  }, [model, onBirdDetected]);

  // Start detection loop when model loads and camera is already active
  useEffect(() => {
    if (model && isStreamingRef.current && !animationFrameRef.current) {
      startDetectionLoop();
    }
  }, [model, startDetectionLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Auto-stop camera when cameraActive becomes false externally
  useEffect(() => {
    if (!cameraActive && isStreamingRef.current) {
      stopCamera();
    }
  }, [cameraActive, stopCamera]);

  return {
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    isModelLoading,
    currentDetections,
  };
}

export default useVision;
