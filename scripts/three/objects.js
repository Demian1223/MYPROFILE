function roundedPanelGeometry(THREE, width, height, radius, depth, segments) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: Math.max(2, Math.floor(segments / 4)),
    bevelSize: 0.055,
    bevelThickness: 0.055,
    curveSegments: segments
  }).center();
}

function panel(THREE, geometry, material, edgeMaterial, name) {
  const group = new THREE.Group();
  group.name = name;
  const mesh = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 28), edgeMaterial);
  edges.scale.setScalar(1.003);
  group.add(mesh, edges);
  return group;
}

export function createAlignmentSystem(THREE, materials, quality) {
  const system = new THREE.Group();
  system.name = 'product-technology-business-system';
  const geometry = roundedPanelGeometry(THREE, quality.mobile ? 2.15 : 2.55, quality.mobile ? 3.25 : 3.65, 0.38, 0.1, quality.segments);
  const product = panel(THREE, geometry, materials.product, materials.edge, 'product-user');
  const technology = panel(THREE, geometry, materials.technology, materials.edge, 'technology');
  const business = panel(THREE, geometry, materials.business, materials.edge, 'business');
  system.add(product, technology, business);
  return { system, panels: [product, technology, business], geometry };
}

export const separatedState = [
  { position: [-1.15, 0.25, 0.05], rotation: [-0.08, -0.32, -0.18] },
  { position: [0.08, 0.05, 0.42], rotation: [0.06, 0.08, 0.12] },
  { position: [1.18, -0.22, -0.1], rotation: [-0.04, 0.36, 0.24] }
];

export const alignedState = [
  { position: [-0.22, 0.1, -0.18], rotation: [0, -0.05, -0.035] },
  { position: [0, 0, 0], rotation: [0, 0, 0] },
  { position: [0.22, -0.1, 0.18], rotation: [0, 0.05, 0.035] }
];

export function applyState(THREE, panels, from, to, progress) {
  panels.forEach((panel, index) => {
    panel.position.lerpVectors(new THREE.Vector3(...from[index].position), new THREE.Vector3(...to[index].position), progress);
    panel.rotation.set(
      THREE.MathUtils.lerp(from[index].rotation[0], to[index].rotation[0], progress),
      THREE.MathUtils.lerp(from[index].rotation[1], to[index].rotation[1], progress),
      THREE.MathUtils.lerp(from[index].rotation[2], to[index].rotation[2], progress)
    );
  });
}
