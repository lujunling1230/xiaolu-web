// Tiny singleton so any component can ask Lenis to scroll to a target,
// without threading the instance through props/context.
let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

// target: selector string ("#work"), element, or pixel number
export function scrollTo(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, duration: 1.2, ...options });
    return;
  }
  // graceful fallback if Lenis isn't ready yet
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}
