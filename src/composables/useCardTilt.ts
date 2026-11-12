import { onMounted, onUnmounted, watch, type Ref } from 'vue'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function setTilt(el: HTMLElement, tiltX: number, tiltY: number, glareX: number, glareY: number, opacity: number) {
  el.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
  el.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
  el.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`)
  el.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`)
  el.style.setProperty('--glare-opacity', opacity.toFixed(3))
}

function resetTilt(el: HTMLElement) {
  setTilt(el, 0, 0, 50, 50, 0)
  el.classList.remove('is-tilting')
}

/**
 * Pointer tilt on mouse, plus device tilt on phones.
 * Touch pointers are ignored so a drag on a card can still scroll the page.
 * Writes --tilt-x/y and --glare-x/y/--glare-opacity on the element.
 */
export function useCardTilt(target: Ref<HTMLElement | null>, options?: { maxTilt?: number }) {
  const maxTilt = options?.maxTilt ?? 14
  let pointerId: number | null = null
  let bound: HTMLElement | null = null

  function applyPointer(el: HTMLElement, clientX: number, clientY: number) {
    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const px = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const py = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
    const tiltY = (px - 0.5) * 2 * maxTilt
    const tiltX = (0.5 - py) * 2 * maxTilt
    el.classList.add('is-tilting')
    setTilt(el, tiltX, tiltY, px * 100, py * 100, 0.9)
  }

  function onPointerMove(event: PointerEvent) {
    if (prefersReducedMotion() || event.pointerType !== 'mouse') return
    const el = target.value
    if (!el) return
    applyPointer(el, event.clientX, event.clientY)
  }

  function onPointerDown(event: PointerEvent) {
    if (prefersReducedMotion() || event.pointerType !== 'mouse') return
    const el = target.value
    if (!el) return
    pointerId = event.pointerId
    applyPointer(el, event.clientX, event.clientY)
  }

  function onPointerUp(event: PointerEvent) {
    const el = target.value
    if (!el) return
    if (pointerId != null && event.pointerId === pointerId) pointerId = null
    if (event.pointerType !== 'mouse') return
    resetTilt(el)
  }

  function onPointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    const el = target.value
    if (!el) return
    pointerId = null
    resetTilt(el)
  }

  function onDeviceOrientation(event: DeviceOrientationEvent) {
    if (prefersReducedMotion()) return
    const el = target.value
    if (!el || pointerId != null) return
    const gamma = event.gamma ?? 0
    const beta = event.beta ?? 0
    const tiltY = Math.max(-maxTilt, Math.min(maxTilt, gamma * 0.4))
    const tiltX = Math.max(-maxTilt, Math.min(maxTilt, (beta - 40) * 0.25))
    const glareX = 50 + tiltY * 2.2
    const glareY = 50 - tiltX * 2.2
    setTilt(el, tiltX, tiltY, glareX, glareY, 0.4)
  }

  function bind(el: HTMLElement) {
    if (bound === el) return
    if (bound) unbind(bound)
    el.classList.add('plan-a-tilt')
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('deviceorientation', onDeviceOrientation)
    bound = el
  }

  function unbind(el: HTMLElement) {
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
    el.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('deviceorientation', onDeviceOrientation)
    resetTilt(el)
    if (bound === el) bound = null
  }

  onMounted(() => {
    if (target.value && !prefersReducedMotion()) bind(target.value)
  })

  watch(target, (next, prev) => {
    if (prev) unbind(prev)
    if (next && !prefersReducedMotion()) bind(next)
  })

  onUnmounted(() => {
    if (target.value) unbind(target.value)
    else window.removeEventListener('deviceorientation', onDeviceOrientation)
  })
}
