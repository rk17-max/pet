import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const styles = `
  .loading-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .loading-text {
    font-size: 1.5rem;
    margin-top: 2rem;
    font-family: 'Segoe UI', sans-serif;
    letter-spacing: 2px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .fallback-loader {
    display: none;
  }

  /* Fallback animation when Three.js fails to load */
  .three-js-error .fallback-loader {
    display: block;
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }

  .fallback-loader::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 4px solid #0ff;
    border-radius: 12px;
    animation: loader-spin 3s linear infinite;
  }

  .fallback-loader::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 40%;
    background: #0ff;
    border-radius: 4px;
    animation: loader-pulse 1s ease-in-out infinite;
  }

  .loading-progress {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin-top: 1rem;
    overflow: hidden;
    position: relative;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #00ffff, #0099ff);
    animation: progress 2s ease-in-out infinite;
  }

  @keyframes loader-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes loader-pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes progress {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 0%; }
  }

  #loading-canvas {
    width: 300px !important;
    height: 300px !important;
  }
`;

const LoadingAnimation = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const frameIdRef = useRef(null);

    useEffect(() => {
        // Inject styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        let camera, scene, renderer;
        let folder, papers;

        try {
            // Initialize Three.js scene
            init();
            animate();
        } catch (error) {
            console.error('Three.js initialization failed:', error);
            if (containerRef.current) {
                containerRef.current.classList.add('three-js-error');
            }
        }

        function init() {
            // Scene setup
            scene = new THREE.Scene();
            sceneRef.current = scene;
            camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.z = 5;

            // Renderer setup
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: true
            });
            renderer.setSize(300, 300);
            renderer.setClearColor(0x000000, 0);

            // Create folder geometry
            const folderGeometry = new THREE.BoxGeometry(2, 1.5, 0.2);
            const folderMaterial = new THREE.MeshPhongMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            folder = new THREE.Mesh(folderGeometry, folderMaterial);
            scene.add(folder);

            // Create floating papers
            papers = [];
            for (let i = 0; i < 5; i++) {
                const paperGeometry = new THREE.PlaneGeometry(0.8, 1);
                const paperMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide
                });
                const paper = new THREE.Mesh(paperGeometry, paperMaterial);
                paper.position.y = 0.1 + i * 0.1;
                paper.position.z = 0.1 + i * 0.1;
                paper.rotation.x = Math.random() * 0.2;
                papers.push(paper);
                scene.add(paper);
            }

            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0x00ffff, 1);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);
        }

        function animate() {
            frameIdRef.current = requestAnimationFrame(animate);

            if (folder && papers.length) {
                folder.rotation.y += 0.01;
                
                papers.forEach((paper, index) => {
                    paper.position.y = 0.1 + index * 0.1 + Math.sin(Date.now() * 0.002 + index) * 0.1;
                    paper.rotation.x = Math.sin(Date.now() * 0.001 + index) * 0.1;
                });
            }

            renderer.render(scene, camera);
        }

        // Cleanup
        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
            document.head.removeChild(styleSheet);
            
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }
            
            if (renderer) {
                renderer.dispose();
            }
        };
    }, []);

    return (
        <div className="loading-container" ref={containerRef}>
            <canvas ref={canvasRef} id="loading-canvas" />
            <div className="fallback-loader" />
            <div className="loading-text">Loading Your Files...</div>
            <div className="loading-progress">
                <div className="progress-bar" />
            </div>
        </div>
    );
};

export default LoadingAnimation;