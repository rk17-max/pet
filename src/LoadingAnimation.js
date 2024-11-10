

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const LoadingAnimation = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 400);
    containerRef.current.appendChild(renderer.domElement);

    // Materials with glow effect
    const createGlowMaterial = (color) => {
      return new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
    };

    const materials = {
      mint: createGlowMaterial(0x4fd1c5),
      blue: createGlowMaterial(0x4299e1),
      pink: createGlowMaterial(0xed64a6),
      yellow: createGlowMaterial(0xecc94b)
    };

    // Create platform with grid effect
    const platform = new THREE.BoxGeometry(3, 0.2, 2);
    const platformMesh = new THREE.Mesh(platform, materials.mint);
    platformMesh.position.y = -0.5;
    scene.add(platformMesh);

    // Add grid lines
    const gridHelper = new THREE.GridHelper(3, 10, 0x4fd1c5, 0x4fd1c5);
    gridHelper.position.y = -0.4;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // Particle system
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.random() * 0.5 + 0.5) * 0.8;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = Math.random() * 2 - 1;
      positions[i + 2] = Math.sin(angle) * radius;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create ring segments
    const ringSegments = [];
    const ringRadius = 0.8;
    const segmentCount = 4;

    for (let i = 0; i < segmentCount; i++) {
      const angle = (i / segmentCount) * Math.PI * 2;
      const geometry = new THREE.TorusGeometry(ringRadius, 0.05, 16, 32, Math.PI / 2);
      const material = [materials.mint, materials.blue, materials.pink, materials.yellow][i];
      const segment = new THREE.Mesh(geometry, material);

      segment.position.set(0, 0.5, 0);
      segment.rotation.z = angle;

      const glowGeometry = new THREE.TorusGeometry(ringRadius, 0.08, 16, 32, Math.PI / 2);
      const glowMaterial = material.clone();
      glowMaterial.opacity = 0.3;
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      segment.add(glow);

      ringSegments.push({
        mesh: segment,
        glow: glow,
        originalScale: segment.scale.clone()
      });
      scene.add(segment);
    }

    // Create floating notes
    const notes = [];
    const createTrail = (note) => {
      const trailCount = 5;
      const trail = [];
      for (let i = 0; i < trailCount; i++) {
        const trailGeometry = note.geometry.clone();
        const trailMaterial = note.material.clone();
        trailMaterial.opacity = 0.2 - (i * 0.04);
        const trailMesh = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.push(trailMesh);
        scene.add(trailMesh);
      }
      return trail;
    };

    for (let i = 0; i < 3; i++) {
      const noteGeometry = new THREE.PlaneGeometry(0.3, 0.4);
      const note = new THREE.Mesh(noteGeometry, materials.blue);
      note.position.set(
        Math.random() * 2 - 1,
        1 + Math.random() * 0.5,
        Math.random() * 2 - 1
      );
      note.rotation.x = -Math.PI / 4;
      const trail = createTrail(note);
      notes.push({
        mesh: note,
        trail: trail,
        initialY: note.position.y,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
      scene.add(note);
    }

    // Position camera
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Camera movement based on mouse
      camera.position.x = 4 + mousePosition.x * 0.5;
      camera.position.z = 4 + mousePosition.y * 0.5;
      camera.lookAt(0, 0, 0);

      // Rotate ring segments with pulse effect
      ringSegments.forEach((segment, i) => {
        segment.mesh.rotation.z += 0.02;
        const pulse = Math.sin(time * 2 + i) * 0.1 + 1;
        segment.mesh.scale.set(pulse, pulse, pulse);
        segment.glow.rotation.z += 0.01;
      });

      // Animate particles
      const positions = particles.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.01;
        if (positions[i + 1] > 1) positions[i + 1] = -1;
      }
      particles.attributes.position.needsUpdate = true;

      // Animate floating notes with trails
      notes.forEach(note => {
        note.mesh.position.y = note.initialY + Math.sin(time * 2 + note.floatOffset) * 0.2;
        note.mesh.rotation.z += note.rotationSpeed;

        note.trail.forEach((trailMesh, index) => {
          const delay = (index + 1) * 0.1;
          trailMesh.position.copy(note.mesh.position);
          trailMesh.position.y -= delay * 0.1;
          trailMesh.rotation.copy(note.mesh.rotation);
        });
      });

      // Platform effect
      platformMesh.scale.x = 1 + Math.sin(time) * 0.02;
      platformMesh.scale.z = 1 + Math.cos(time) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [mousePosition]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#6b46c1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '400px', height: '400px', margin: 'auto' }} ref={containerRef}>
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
            .loading-text {
              position: absolute;
              bottom: -40px;
              left: 50%;
              transform: translateX(-50%);
              color: white;
              font-size: 1.25rem; /* Equivalent to text-lg */
              animation: pulse 1s infinite;
            }
          `}
        </style>
        <div className="loading-text">
          Loading your notes...
        </div>
      </div>
    </div>
  );
  
};

export default LoadingAnimation;
