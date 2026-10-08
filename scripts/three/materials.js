export function createMaterials(THREE, quality) {
  const physical = (options) => quality.transmission
    ? new THREE.MeshPhysicalMaterial({
        transparent: true,
        transmission: options.transmission,
        thickness: 0.65,
        roughness: options.roughness,
        metalness: options.metalness,
        color: options.color,
        emissive: options.emissive,
        emissiveIntensity: 0.08,
        opacity: 0.92,
        side: THREE.DoubleSide
      })
    : new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.76,
        roughness: options.roughness,
        metalness: options.metalness,
        color: options.color,
        emissive: options.emissive,
        emissiveIntensity: 0.06,
        side: THREE.DoubleSide
      });

  return {
    product: physical({ color: 0xe8d8cc, emissive: 0x241915, transmission: 0.58, roughness: 0.24, metalness: 0.08 }),
    technology: physical({ color: 0x6682ff, emissive: 0x10173c, transmission: 0.46, roughness: 0.2, metalness: 0.18 }),
    business: physical({ color: 0x8f8ba4, emissive: 0x1c1828, transmission: 0.28, roughness: 0.3, metalness: 0.52 }),
    edge: new THREE.LineBasicMaterial({ color: 0xdde3ff, transparent: true, opacity: 0.28 })
  };
}

export function disposeMaterials(materials) {
  Object.values(materials).forEach(material => material.dispose());
}
