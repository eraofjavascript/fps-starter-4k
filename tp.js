// tp.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Capsule } from 'three/addons/math/Capsule.js';

export function enableThirdPersonDebug(scene, camera, playerCollider, renderer) {
  // ---------- Orbit controls ----------
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = false; // start disabled

  // ---------- Add button ----------
  const btn = document.createElement('button');
  btn.textContent = '3rd Person';
  Object.assign(btn.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 100,
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer'
  });
  document.body.appendChild(btn);

  let active = false;
  btn.addEventListener('click', () => {
    active = !active;
    orbit.enabled = active;
    btn.style.background = active ? '#8f2' : '';
  });

  // ---------- Capsule helper ----------
  const capsuleGeo = new THREE.CapsuleGeometry(
    playerCollider.radius, 
    playerCollider.end.y - playerCollider.start.y, 
    8, 
    16
  );
  const capsuleMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.3,
    wireframe: false
  });
  const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
  scene.add(capsuleMesh);

  // ---------- Update function ----------
  function updateThirdPerson() {
    if (active) {
      // sync capsule position
      const height = playerCollider.end.y - playerCollider.start.y;
      capsuleMesh.position.set(
        (playerCollider.start.x + playerCollider.end.x) / 2,
        (playerCollider.start.y + playerCollider.end.y) / 2,
        (playerCollider.start.z + playerCollider.end.z) / 2
      );
      capsuleMesh.scale.set(1, 1, 1);

      orbit.update();
    }
    requestAnimationFrame(updateThirdPerson);
  }
  updateThirdPerson();
}