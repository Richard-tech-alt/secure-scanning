// import React, { useEffect, useRef, useState } from "react";
// import "./SystemUpdate.css"; // move CSS into its own file
// import { useNavigate } from "react-router-dom";

// export default function SystemUpdate() {
//   const [prankEnded, setPrankEnded] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [logs, setLogs] = useState([]);
//   const popupLayerRef = useRef(null);


//    const navigate = useNavigate(); // 👈 add this

//   // ...

//    useEffect(() => {
//     // Simulate scanning process
//     const timer = setTimeout(() => {
//       // After scan is done, redirect
//       navigate("/secure");
//     }, 10000); // 3 sec scan

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   function reveal() {
//     setPrankEnded(true);
//     navigate("/secure"); // 👈 redirect instead of showing UI
//   }

//   const TOTAL_DURATION_MS = 15000;
//   const POPUP_SPAWN_EVERY = 1100;
//   const POPUP_LIFETIME = 4200;

//   const LOG_LINES = [
//     "Initializing secure update channel…",
//     "Downloading patch set v3.14…",
//     "Verifying checksums…",
//     "Error loading module: win32api.dll — retrying…",
//     "Encrypting registry hive…",
//     "Loading Windows Components…",
//     "Error: Component comctl32 failed to register — skipping…",
//     "Optimizing assets…",
//     "Cleaning temporary files…",
//     "Applying critical system policies…",
//     "Finalizing…",
//   ];

//   const POPUP_TITLES = [
//     "Microsoft Windows",
//     "Windows Defender",
//     "System Notification",
//     "Windows Problem Reporting",
//     "Settings",
//   ];

//   const POPUP_BODIES = [
//     "Application not responding. If you wait, the program might respond.",
//     "System encountered a problem while loading.",
//     "A critical error occurred during initialization.",
//     "Some components failed to start correctly.",
//     "Please wait while Windows tries to recover.",
//   ];

//   // ---- Helpers ----
//   function appendLine(t) {
//     setLogs((prev) => [...prev, t]);
//   }

//   function spawnPopup() {
//     if (prankEnded || !popupLayerRef.current) return;
//     const title = POPUP_TITLES[Math.floor(Math.random() * POPUP_TITLES.length)];
//     const body = POPUP_BODIES[Math.floor(Math.random() * POPUP_BODIES.length)];

//     const popup = document.createElement("div");
//     popup.className = "win-pop";
//     popup.innerHTML = `
//       <div class="win-titlebar">
//         <span>${title}</span>
//         <div class="spin"></div>
//       </div>
//       <div class="win-body">
//         <div>${body}</div>
//         <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
//           <div class="spin"></div><div>Working on it…</div>
//         </div>
//       </div>
//       <div class="win-actions">
//         <button class="win-btn">Close</button>
//         <button class="win-btn">OK</button>
//       </div>
//     `;

//     const vw = window.innerWidth;
//     const vh = window.innerHeight;
//     popup.style.left = Math.max(6, Math.random() * (vw - 372)) + "px";
//     popup.style.top = Math.max(6, Math.random() * (vh - 190)) + "px";

//     popupLayerRef.current.appendChild(popup);
//     setTimeout(() => popup.remove(), POPUP_LIFETIME);
//   }

//   function runPrank() {
//     setLogs([]);
//     setProgress(0);
//     let prankOver = false;

//     const start = performance.now();
//     let nextLog = 0;
//     const logEvery = TOTAL_DURATION_MS / LOG_LINES.length;

//     const popupTimer = setInterval(spawnPopup, POPUP_SPAWN_EVERY);

//     function step(now) {
//       if (prankOver) return;
//       const elapsed = now - start;
//       const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
//       setProgress(pct);

//       if (elapsed >= nextLog && nextLog / logEvery < LOG_LINES.length) {
//         const line = LOG_LINES[Math.floor(nextLog / logEvery)];
//         appendLine(line);
//         nextLog += logEvery;
//       }

//       if (elapsed < TOTAL_DURATION_MS) requestAnimationFrame(step);
//       else {
//         clearInterval(popupTimer);
//         reveal();
//         prankOver = true;
//       }
//     }
//     requestAnimationFrame(step);
//   }

//   function reveal() {
//     setPrankEnded(true);
//   }

//   // Run on mount
//   useEffect(() => {
//     runPrank();
//   }, []);

//   return (
//     <div className="wrap">
//       {!prankEnded ? (
//         <div className="panel">
//           <div className="title glitch">
//             <span className="pulse"></span>
//             System Update • Please do not turn off your device
//           </div>
//           <div className="muted">
//             Applying security patches, optimizing storage, and finalizing
//             configuration…
//           </div>

//           <div className="rows">
//             <div className="bar">
//               <div
//                 className="fill"
//                 style={{ width: progress.toFixed(2) + "%" }}
//               ></div>
//             </div>
//             <div className="log">
//               {logs.map((line, i) => (
//                 <div key={i}>{line}</div>
//               ))}
//             </div>
//           </div>

//           <div className="hint">(System not responding…)</div>
//         </div>
//       ) : null}

//       {/* Popup layer */}
//       <div ref={popupLayerRef} id="popup-layer"></div>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SystemUpdate.css";

export default function SystemUpdate() {
  const [prankEnded, setPrankEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const popupLayerRef = useRef(null);
  const navigate = useNavigate();

  const TOTAL_DURATION_MS = 15000;
  const POPUP_SPAWN_EVERY = 1100;
  const POPUP_LIFETIME = 4200;

  const LOG_LINES = [
    "Initializing secure update channel…",
    "Downloading patch set v3.14…",
    "Verifying checksums…",
    "Error loading module: win32api.dll — retrying…",
    "Encrypting registry hive…",
    "Loading Windows Components…",
    "Error: Component comctl32 failed to register — skipping…",
    "Optimizing assets…",
    "Cleaning temporary files…",
    "Applying critical system policies…",
    "Finalizing…",
  ];

  const POPUP_TITLES = [
    "Microsoft Windows",
    "Windows Defender",
    "System Notification",
    "Windows Problem Reporting",
    "Settings",
  ];

  const POPUP_BODIES = [
    "Application not responding. If you wait, the program might respond.",
    "System encountered a problem while loading.",
    "A critical error occurred during initialization.",
    "Some components failed to start correctly.",
    "Please wait while Windows tries to recover.",
  ];

  function appendLine(t) {
    setLogs((prev) => [...prev, t]);
  }

  function spawnPopup() {
    if (prankEnded || !popupLayerRef.current) return; // null check here ✅
    const title = POPUP_TITLES[Math.floor(Math.random() * POPUP_TITLES.length)];
    const body = POPUP_BODIES[Math.floor(Math.random() * POPUP_BODIES.length)];

    const popup = document.createElement("div");
    popup.className = "win-pop";
    popup.innerHTML = `
      <div class="win-titlebar">
        <span>${title}</span>
        <div class="spin"></div>
      </div>
      <div class="win-body">
        <div>${body}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
          <div class="spin"></div><div>Working on it…</div>
        </div>
      </div>
      <div class="win-actions">
        <button class="win-btn">Close</button>
        <button class="win-btn">OK</button>
      </div>
    `;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    popup.style.left = Math.max(6, Math.random() * (vw - 372)) + "px";
    popup.style.top = Math.max(6, Math.random() * (vh - 190)) + "px";

    popupLayerRef.current.appendChild(popup);
    setTimeout(() => popup.remove(), POPUP_LIFETIME);
  }

  function runPrank() {
    setLogs([]);
    setProgress(0);
    let prankOver = false;

    const start = performance.now();
    let nextLog = 0;
    const logEvery = TOTAL_DURATION_MS / LOG_LINES.length;

    const popupTimer = setInterval(spawnPopup, POPUP_SPAWN_EVERY);

    function step(now) {
      if (prankOver) return;
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed >= nextLog && nextLog / logEvery < LOG_LINES.length) {
        const line = LOG_LINES[Math.floor(nextLog / logEvery)];
        appendLine(line);
        nextLog += logEvery;
      }

      if (elapsed < TOTAL_DURATION_MS) {
        requestAnimationFrame(step);
      } else {
        clearInterval(popupTimer);
        setPrankEnded(true);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        prankOver = true;

        // redirect to /secure after prank ends
        setTimeout(() => {
          navigate("/secure");
        }, 800);
      }
    }
    requestAnimationFrame(step);
  }

  useEffect(() => {
    // enter fullscreen immediately
    function enterFullScreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }

    enterFullScreen();
    runPrank();
  }, []);

  return (
    <div className="wrap">
      {!prankEnded ? (
        <div className="panel">
          <div className="title glitch">
            <span className="pulse"></span>
            System Update • Please do not turn off your device
          </div>
          <div className="muted">
            Applying security patches, optimizing storage, and finalizing
            configuration…
          </div>

          <div className="rows">
            <div className="bar">
              <div
                className="fill"
                style={{ width: progress.toFixed(2) + "%" }}
              ></div>
            </div>
            <div className="log">
              {logs.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          <div className="hint">(System not responding…)</div>
        </div>
      ) : (
        <div className="done">✅ Fake system update completed!</div>
      )}

      {/* Popup layer */}
      <div ref={popupLayerRef} id="popup-layer"></div>
    </div>
  );
}
