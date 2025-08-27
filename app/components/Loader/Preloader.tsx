'use client';

import { useState, useEffect } from 'react';
import { constants } from '../constants';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [text1Opacity, setText1Opacity] = useState(0);
  const [text2Opacity, setText2Opacity] = useState(0);
  const [text3Opacity, setText3Opacity] = useState(0);
  const [brandOpacity, setBrandOpacity] = useState(0);
  const [revealBoxWidth, setRevealBoxWidth] = useState(0);

  useEffect(() => {
    // Sequential animation phases to prevent UI crisis
    const animationPhases = [
      // Phase 0: First text appears
      () => {
        setText1Opacity(1);
        setCurrentPhase(1);
      },
      // Phase 1: Second text appears
      () => {
        setText2Opacity(1);
        setCurrentPhase(2);
      },
      // Phase 2: Third text appears
      () => {
        setText3Opacity(1);
        setCurrentPhase(3);
      },
      // Phase 3: All texts fade out together
      () => {
        setText1Opacity(0);
        setText2Opacity(0);
        setText3Opacity(0);
        setCurrentPhase(4);
      },
      // Phase 4: Reveal box appears (brand text hidden behind it)
      () => {
        setRevealBoxWidth(100);
        setCurrentPhase(5);
      },
      // Phase 5: Reveal box fades out, brand text becomes visible
      () => {
        setRevealBoxWidth(0);
        setBrandOpacity(1);
        setCurrentPhase(6);
      },
      // Phase 6: Brand text fades out
      () => {
        setBrandOpacity(0);
        setCurrentPhase(7);
      },
      // Phase 7: Hide preloader
      () => {
        setIsVisible(false);
      },
    ];

    // Execute phases with proper timing
    const phaseTimings = [200, 600, 1000, 1800, 2000, 2400, 3000, 3500];

    phaseTimings.forEach((timing, index) => {
      setTimeout(() => {
        if (animationPhases[index]) {
          animationPhases[index]();
        }
      }, timing);
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mil-preloader">
      <div className="mil-preloader-animation">
        {/* Animation 1 - Text layers with proper positioning */}
        <div className="mil-pos-abs mil-animation-1">
          <p
            className="mil-h3 mil-muted mil-thin"
            style={{
              opacity: text1Opacity,
              transition: 'opacity 0.8s ease',
              marginRight: '15px',
            }}
          >
            Trusted
          </p>
          <p
            className="mil-h3 mil-muted font-outfit font-bold"
            style={{
              opacity: text2Opacity,
              transition: 'opacity 0.8s ease',
              marginRight: '15px',
            }}
          >
            Reliable
          </p>
          <p
            className="mil-h3 mil-muted mil-thin"
            style={{
              opacity: text3Opacity,
              transition: 'opacity 0.8s ease',
              marginRight: '15px',
            }}
          >
            Movers
          </p>
        </div>

        {/* Animation 2 - Reveal frame with brand */}
        <div className="mil-pos-abs mil-animation-2">
          <div className="mil-reveal-frame">
            {/* Reveal box that slides in from left */}
            <div
              className="mil-reveal-box"
              style={{
                width: `${revealBoxWidth}%`,
                transition: 'width 0.8s ease',
                height: '100%',
                backgroundColor: 'rgb(250 92 51 / var(--tw-text-opacity, 1))',
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 4,
              }}
            ></div>
            {/* Brand text (initially hidden behind reveal box) */}
            <p
              className="mil-h3 mil-muted mil-thin"
              style={{
                opacity: brandOpacity,
                transition: 'opacity 0.8s ease',
                position: 'relative',
                zIndex: 3,
              }}
            >
              <span className="text-theme-orange font-outfit font-bold">{constants.websiteUrl}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
