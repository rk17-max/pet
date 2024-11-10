import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LandingPage.css';

const LandingPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create a Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, containerRef.current.offsetWidth / containerRef.current.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Create three animated divs
      const div1 = createAnimatedDiv('Upload Notes', scene, camera);
      const div2 = createAnimatedDiv('Organize and Manage', scene, camera);
      const div3 = createAnimatedDiv('Share and Collaborate', scene, camera);

      // Add the divs to the scene
      scene.add(div1, div2, div3);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        div1.rotation.x += 0.01;
        div1.rotation.y += 0.01;
        div2.rotation.x += 0.01;
        div2.rotation.y += 0.01;
        div3.rotation.x += 0.01;
        div3.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();
    }
  }, []);

  return (
    <div className="landing-page" ref={containerRef}>
      <h1 className="title">Welcome to Our Note-Taking Platform</h1>
      <p className="description">Streamline your note-taking and collaboration with our user-friendly tools.</p>
    </div>
  );
};

const createAnimatedDiv = (text, scene, camera) => {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x6b5b95 });
  const div = new THREE.Mesh(geometry, material);

  // Position the div in the scene
  div.position.set(0, 0, -5);

  // Create a div element for the text
  const textDiv = document.createElement('div');
  textDiv.className = 'animated-div';
  textDiv.textContent = text;

  // Add the div to the scene
  scene.add(div);

  // Animate the div
  div.userData = { textDiv };
  div.position.z = -5;
  div.scale.set(0.8, 0.8, 0.8);
  div.rotation.x = Math.PI / 4;
  div.rotation.y = Math.PI / 4;

  return div;
};

export default LandingPage;