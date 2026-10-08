function sculpturalForm(THREE, geometry, material, edgeMaterial, name, edge = true) {
  const group = new THREE.Group();
  group.name = name;
  group.add(new THREE.Mesh(geometry, material));
  if (edge) {
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 32), edgeMaterial);
    lines.scale.setScalar(1.004);
    group.add(lines);
  }
  return group;
}

function createDecisionField(THREE, mobile) {
  const count = mobile ? 24 : 52;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.399963;
    const radius = 2.05 + ((index % 7) / 7) * 1.25;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle * 1.37) * (1.25 + (index % 3) * 0.2);
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.72;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x9aabff, size: mobile ? 0.035 : 0.045, transparent: true, opacity: 0.46, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  points.name = 'decision-signals';
  return { points, geometry, material };
}

export function createAlignmentSystem(THREE, materials, quality) {
  const system = new THREE.Group();
  system.name = 'product-technology-business-system';
  const detail = quality.tier === 'high' ? 128 : quality.tier === 'medium' ? 88 : 56;
  const radial = quality.tier === 'high' ? 18 : quality.tier === 'medium' ? 12 : 8;
  const productGeometry = new THREE.TorusKnotGeometry(1.05, 0.19, detail, radial, 2, 3);
  const technologyGeometry = new THREE.IcosahedronGeometry(1.48, quality.tier === 'high' ? 2 : 1);
  const businessGeometry = new THREE.TorusGeometry(1.72, 0.105, radial, detail);
  const product = sculpturalForm(THREE, productGeometry, materials.product, materials.edge, 'product-user', false);
  const technology = sculpturalForm(THREE, technologyGeometry, materials.technology, materials.edge, 'technology');
  const business = sculpturalForm(THREE, businessGeometry, materials.business, materials.edge, 'business', false);
  technology.scale.setScalar(0.92);
  const field = createDecisionField(THREE, quality.mobile);
  system.add(field.points, product, technology, business);
  const geometries = [productGeometry, technologyGeometry, businessGeometry, field.geometry];
  const geometry = { dispose() { geometries.forEach(item => item.dispose()); field.material.dispose(); } };
  return { system, panels: [product, technology, business], geometry, field: field.points };
}

export const separatedState = [
  { position: [-1.05, 0.38, 0.28], rotation: [0.45, -0.45, -0.3] },
  { position: [0.38, -0.12, -0.35], rotation: [-0.2, 0.45, 0.12] },
  { position: [1.18, -0.34, 0.18], rotation: [1.05, 0.12, 0.55] }
];

export const alignedState = [
  { position: [0, 0, 0.28], rotation: [0.35, 0.15, -0.18] },
  { position: [0, 0, 0], rotation: [0.08, 0.25, 0] },
  { position: [0, 0, -0.22], rotation: [1.18, 0.08, 0.22] }
];

export function applyState(THREE, panels, from, to, progress) {
  panels.forEach((form, index) => {
    form.position.lerpVectors(new THREE.Vector3(...from[index].position), new THREE.Vector3(...to[index].position), progress);
    form.rotation.set(
      THREE.MathUtils.lerp(from[index].rotation[0], to[index].rotation[0], progress),
      THREE.MathUtils.lerp(from[index].rotation[1], to[index].rotation[1], progress),
      THREE.MathUtils.lerp(from[index].rotation[2], to[index].rotation[2], progress)
    );
  });
}
