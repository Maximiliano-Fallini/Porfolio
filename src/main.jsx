import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import './styles.css'

const asset = path => `${import.meta.env.BASE_URL}${path}`

const techIcons = {
  'C#': 'csharp/csharp-original.svg',
  '.NET': 'dotnetcore/dotnetcore-original.svg',
  PowerShell: 'powershell/powershell-original.svg',
  HTML: 'html5/html5-original.svg',
  CSS: 'css3/css3-original.svg',
  JavaScript: 'javascript/javascript-original.svg',
}

const techIconUrl = name => techIcons[name]
  ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${techIcons[name]}`
  : null

const CONTACT_EMAIL = 'maximilianofallini@gmail.com'
const FORM_SUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`
const gmailCompose = ({ subject = '', body = '' } = {}) => {
  const params = new URLSearchParams({ view: 'cm', fs: '1', tf: '1', to: CONTACT_EMAIL })
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `https://mail.google.com/mail/?${params.toString().replace(/\+/g, '%20')}`
}

const projects = [
  {
    number: '01',
    type: 'Web · Landing',
    title: 'Miriam Elisabet Brito',
    description: 'Página clara y cálida para una profesional de terapias holísticas, con servicios, cursos, trabajos realizados y contacto directo.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://miriamelisabetbrito.com.ar',
    demo: 'https://miriamelisabetbrito.com.ar',
    linkLabel: 'Página web',
    image: asset('miriam.webp'),
    accent: 'sand',
  },
  {
    number: '02',
    type: 'Aplicación · Windows',
    title: 'WinForge',
    description: 'Optimizador competitivo para Windows que reúne monitoreo en vivo, modo juego, biblioteca multiplataforma y herramientas de sistema en una sola app.',
    stack: ['C#', '.NET', 'PowerShell'],
    github: 'https://github.com/Maximiliano-Fallini/WinForge',
    demo: 'https://github.com/Maximiliano-Fallini/WinForge/releases',
    linkLabel: 'Repositorio',
    image: asset('winforge.png'),
    accent: 'green',
  },
]

const technologies = [
  ['JavaScript', 'javascript/javascript-original.svg', 'Lenguaje'],
  ['React', 'react/react-original.svg', 'Interfaz'],
  ['Node.js', 'nodejs/nodejs-original.svg', 'Servidor'],
  ['MongoDB', 'mongodb/mongodb-original.svg', 'Base de datos'],
  ['HTML5', 'html5/html5-original.svg', 'Estructura'],
  ['CSS', 'css3/css3-original.svg', 'Estilos'],
  ['Sass', 'sass/sass-original.svg', 'Estilos'],
  ['Tailwind', 'tailwindcss/tailwindcss-original.svg', 'Estilos'],
  ['Express.js', 'express/express-original.svg', 'Servidor'],
  ['Firebase', 'firebase/firebase-plain.svg', 'Plataforma'],
  ['Git', 'git/git-original.svg', 'Versiones'],
  ['GitHub', 'github/github-original.svg', 'Código abierto'],
  ['Docker', 'docker/docker-original.svg', 'Despliegue'],
  ['VS Code', 'vscode/vscode-original.svg', 'Editor'],
  ['Vite', 'vite/vite-original.svg', 'Herramientas'],
]


function Arrow({ external = false }) { return <span className="arrow" aria-hidden="true">{external ? '↗' : '→'}</span> }
function Mark() { return <img className="mark" src={asset('logo.svg?v=2')} alt="" aria-hidden="true" /> }

// Cursor-following spotlight card. Adapted from the 21st.dev "Spotlight Card"
// (GlowCard) pattern, but written with CSS custom properties instead of React
// state so the glow updates without re-rendering on every mouse move.
function SpotlightCard({ className = '', children, ...rest }) {
  const ref = useRef(null)
  const point = e => e.touches?.[0] ?? e
  const track = e => {
    const el = ref.current
    const p = point(e)
    if (!el || !p) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${p.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${p.clientY - rect.top}px`)
  }
  const show = e => {
    ref.current?.style.setProperty('--spot-opacity', '1')
    track(e)
  }
  const hide = () => ref.current?.style.setProperty('--spot-opacity', '0')
  return (
    <article
      ref={ref}
      className={`spotlight-card ${className}`}
      onMouseEnter={show}
      onMouseMove={track}
      onMouseLeave={hide}
      onTouchStart={show}
      onTouchMove={track}
      onTouchEnd={hide}
      onTouchCancel={hide}
      {...rest}
    >
      {children}
    </article>
  )
}

// Same spotlight idea as the cards, but applied to the full-width horizontal
// separators (nav under-line, hero footer, footer). A single global pointer
// listener writes the cursor position into each line, so the glow sweeps along
// them as you move the mouse.
function SpotlightSeparators() {
  useEffect(() => {
    const lines = document.querySelectorAll('.nav-wrap, .hero-footer, .footer')
    const fields = document.querySelectorAll('.contact-form label, .profile-chip, .tech-card')
    if (!lines.length && !fields.length) return undefined
    const track = e => {
      lines.forEach(el => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
        el.style.setProperty('--spot-on', '1')
      })
      fields.forEach(el => {
        const rect = el.getBoundingClientRect()
        const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
        el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
        el.style.setProperty('--spot-opacity', inside ? '1' : '0')
      })
    }
    const clear = () => {
      lines.forEach(el => el.style.setProperty('--spot-on', '0'))
      fields.forEach(el => el.style.setProperty('--spot-opacity', '0'))
    }
    window.addEventListener('pointermove', track, { passive: true })
    window.addEventListener('pointerdown', track, { passive: true })
    document.addEventListener('pointerleave', clear)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('pointermove', track)
      window.removeEventListener('pointerdown', track)
      document.removeEventListener('pointerleave', clear)
      window.removeEventListener('blur', clear)
    }
  }, [])
  return null
}

function ScrollProgress() {
  const progressRef = useRef(null)

  useEffect(() => {
    const bar = progressRef.current
    if (!bar) return undefined

    let frame = 0
    const update = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const progress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0
        bar.style.transform = `scaleX(${progress})`
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>
}

function ParticleField() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined

    let width = 0
    let height = 0
    let frame = 0
    let waveFrame = 0
    const waveStart = performance.now() + 3500

    const draw = now => {
      frame = 0
      ctx.clearRect(0, 0, width, height)
      const centerX = width / 2
      const centerY = height * .46
      const radiusX = Math.min(width * .38, 320)
      const radiusY = Math.min(height * .28, 210)
      const spacing = 20
      const isMobile = width <= 760

      for (let y = 0; y <= height; y += spacing) {
        for (let x = 0; x <= width; x += spacing) {
          const dx = (x - centerX) / radiusX
          const dy = (y - centerY) / radiusY
          const field = Math.max(0, 1 - Math.hypot(dx, dy))
          const pointerDistance = Math.hypot(mouse.current.x - x, mouse.current.y - y)
          const pointerResponse = Math.max(0, 1 - pointerDistance / 260)
          const waveElapsed = now - waveStart
          const waveRadius = Math.max(0, waveElapsed * .45)
          const distanceFromCenter = Math.hypot(x - centerX, y - centerY)
          const waveResponse = waveElapsed > 0 ? Math.max(0, 1 - Math.abs(distanceFromCenter - waveRadius) / 86) : 0
          const response = Math.max(pointerResponse, waveResponse)
          if (field < .015 && response < .025) continue
          const red = Math.round(5 + 161 * response)
          const green = Math.min(255, Math.round(118 + 112 * response + 22 * field))
          const blue = Math.round(98 - 24 * response + 8 * field)
          const alpha = .04 + field * (isMobile ? .32 : .2) + response * .62
          const halfSize = 1.7 + field * (isMobile ? .7 : .45) + response * 1.45

          ctx.beginPath()
          ctx.moveTo(x - halfSize, y - halfSize)
          ctx.lineTo(x + halfSize, y + halfSize)
          ctx.moveTo(x + halfSize, y - halfSize)
          ctx.lineTo(x - halfSize, y + halfSize)
          ctx.strokeStyle = `rgba(${red},${green},${blue},${alpha})`
          ctx.lineWidth = 1 + field * .2 + response * 1
          ctx.lineCap = 'round'
          ctx.shadowBlur = response > .08 ? response * 6 : isMobile ? field * 3 : 0
          ctx.shadowColor = 'rgba(166,255,93,.7)'
          ctx.stroke()
        }
      }
      ctx.shadowBlur = 0
    }

    const scheduleDraw = () => {
      if (!frame) frame = requestAnimationFrame(now => draw(now))
    }
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      scheduleDraw()
    }
    const move = e => {
      mouse.current = { x: e.clientX, y: e.clientY }
      scheduleDraw()
    }
    const leave = () => {
      mouse.current = { x: -1000, y: -1000 }
      scheduleDraw()
    }

    resize()
    const animateWave = now => {
      if (now < waveStart + 2600) {
        draw(now)
        waveFrame = requestAnimationFrame(animateWave)
      } else {
        draw(now)
      }
    }
    waveFrame = requestAnimationFrame(animateWave)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(waveFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <canvas className="particles" ref={canvasRef} aria-hidden="true" />
}

function Vscode3D() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const stage = canvas?.parentElement
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      return undefined
    }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 100)
    const object = new THREE.Group()
    object.rotation.set(-.12, .22, -.03)
    scene.add(object)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), .06).texture
    scene.environmentIntensity = .55
    pmrem.dispose()

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#fff" fill-rule="evenodd" d="M90.767 127.126a7.968 7.968 0 0 0 6.35-.244l26.353-12.681a8 8 0 0 0 4.53-7.209V21.009a8 8 0 0 0-4.53-7.21L97.117 1.12a7.97 7.97 0 0 0-9.093 1.548l-50.45 46.026L15.6 32.013a5.328 5.328 0 0 0-6.807.302l-7.048 6.411a5.335 5.335 0 0 0-.006 7.888L20.796 64 1.74 81.387a5.336 5.336 0 0 0 .006 7.887l7.048 6.411a5.327 5.327 0 0 0 6.807.303l21.974-16.68 50.45 46.025a7.96 7.96 0 0 0 2.743 1.793Zm5.252-92.183L57.74 64l38.28 29.058V34.943Z"/></svg>`
    const svgData = new SVGLoader().parse(svg)
    const parsedShapes = SVGLoader.createShapes(svgData.paths[0])
    const byArea = [...parsedShapes].sort((a, b) => Math.abs(THREE.ShapeUtils.area(b.getPoints(24))) - Math.abs(THREE.ShapeUtils.area(a.getPoints(24))))
    const outerShape = byArea[0]
    const outerClockwise = THREE.ShapeUtils.isClockWise(outerShape.getPoints(24))
    for (const holeShape of byArea.slice(1)) {
      let pts = holeShape.getPoints(12).filter((p, i, arr) => {
        const q = arr[(i + 1) % arr.length]
        return p.distanceToSquared(q) > 1e-8
      })
      if (pts.length < 3) continue
      if (THREE.ShapeUtils.isClockWise(pts) === outerClockwise) pts = pts.slice().reverse()
      const hole = new THREE.Path()
      hole.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i += 1) hole.lineTo(pts[i].x, pts[i].y)
      hole.closePath()
      outerShape.holes.push(hole)
    }
    const shape = outerShape
    const depth = 12
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 1.4,
      bevelThickness: 3.2,
      curveSegments: 32,
    })
    geometry.computeBoundingBox()
    const shapeCenter = geometry.boundingBox.getCenter(new THREE.Vector3())
    const shapeSize = geometry.boundingBox.getSize(new THREE.Vector3())
    const uniformScale = 1.9 / Math.max(shapeSize.x, shapeSize.y)
    geometry.translate(-shapeCenter.x, -shapeCenter.y, 0)
    geometry.scale(uniformScale, -uniformScale, uniformScale)
    geometry.center()
    if (geometry.index) {
      for (let i = 0; i < geometry.index.count; i += 3) {
        const second = geometry.index.getX(i + 1)
        geometry.index.setX(i + 1, geometry.index.getX(i + 2))
        geometry.index.setX(i + 2, second)
      }
      geometry.index.needsUpdate = true
    } else {
      for (const attribute of Object.values(geometry.attributes)) {
        const { array, itemSize } = attribute
        for (let i = 0; i < attribute.count; i += 3) {
          for (let component = 0; component < itemSize; component += 1) {
            const first = (i + 1) * itemSize + component
            const second = (i + 2) * itemSize + component
            ;[array[first], array[second]] = [array[second], array[first]]
          }
        }
        attribute.needsUpdate = true
      }
    }
    geometry.computeBoundingSphere()
    const face = new THREE.MeshPhysicalMaterial({ color: 0x1aa3ff, metalness: .12, roughness: .16, clearcoat: 1, clearcoatRoughness: .08, emissive: 0x00487a, emissiveIntensity: .28, envMapIntensity: 1.1 })
    const side = new THREE.MeshPhysicalMaterial({ color: 0x0068b8, metalness: .38, roughness: .24, clearcoat: .9, clearcoatRoughness: .16, envMapIntensity: 1, emissive: 0x003a66, emissiveIntensity: .5, side: THREE.DoubleSide })
    object.add(new THREE.Mesh(geometry, [face, side]))
    const logoRadius = geometry.boundingSphere.center.length() + geometry.boundingSphere.radius + .05

    scene.add(new THREE.HemisphereLight(0xd8f2ff, 0x06203a, .9))
    const key = new THREE.DirectionalLight(0xffffff, 3.4)
    key.position.set(-3, 4, 6)
    scene.add(key)
    const blue = new THREE.PointLight(0x168fff, 10, 9)
    blue.position.set(-2.5, 1.2, 3)
    scene.add(blue)
    const rim = new THREE.DirectionalLight(0x6fdcff, 2.2)
    rim.position.set(3, 1.4, -4)
    scene.add(rim)
    const fill = new THREE.DirectionalLight(0xbfe6ff, .8)
    fill.position.set(2.5, -2, 3.5)
    scene.add(fill)

    let frame
    let dragging = false
    let hovering = false
    let lastX = 0
    let lastY = 0
    let targetX = -.12
    let targetY = .22
    const baseZ = -.03
    const enter = () => { hovering = true }
    const leave = () => { hovering = false }
    const down = e => {
      if (e.button !== undefined && e.button !== 0) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      stage.setPointerCapture?.(e.pointerId)
      stage.classList.add('is-dragging')
    }
    const move = e => {
      if (!dragging) return
      targetY += (e.clientX - lastX) * .011
      targetX += (e.clientY - lastY) * .011
      targetX = Math.max(-1.1, Math.min(1.1, targetX))
      lastX = e.clientX; lastY = e.clientY
    }
    const up = e => {
      if (!dragging) return
      dragging = false
      stage.classList.remove('is-dragging')
      if (stage.hasPointerCapture?.(e.pointerId)) stage.releasePointerCapture(e.pointerId)
    }
    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    stage.addEventListener('pointerenter', enter)
    stage.addEventListener('pointerleave', leave)
    const resize = () => {
      const box = canvas.parentElement.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      renderer.setPixelRatio(ratio)
      renderer.setSize(box.width, box.height, false)
      camera.aspect = box.width / box.height
      const verticalFov = THREE.MathUtils.degToRad(camera.fov)
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
      const limitingFov = Math.min(verticalFov, horizontalFov)
      camera.position.set(0, 0, logoRadius * 1.06 / Math.sin(limitingFov / 2))
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas.parentElement)
    resize()
    const render = clock => {
      const t = (typeof clock === 'number' ? clock : performance.now()) / 1000
      if (!dragging) targetY += .0016
      object.rotation.x += (targetX - object.rotation.x) * .08
      object.rotation.y += (targetY - object.rotation.y) * .08
      object.position.y = Math.sin(t * 1.15) * .045
      object.rotation.z = baseZ + Math.sin(t * .7) * .018
      const targetScale = hovering || dragging ? 1.055 : 1
      const nextScale = object.scale.x + (targetScale - object.scale.x) * .08
      object.scale.setScalar(nextScale)
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    render()
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); renderer.dispose(); scene.environment?.dispose?.()
      stage.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); stage.removeEventListener('pointerenter', enter); stage.removeEventListener('pointerleave', leave)
      object.traverse(child => { if (child.geometry) child.geometry.dispose(); if (child.material) Array.isArray(child.material) ? child.material.forEach(material => material.dispose()) : child.material.dispose?.() })
    }
  }, [])
  return <div className="vscode-stage" aria-label="Logo 3D de VS Code. Arrastrá para girarlo"><canvas ref={canvasRef} /><span className="vscode-hint">ARRASTRÁ PARA GIRAR</span></div>
}
const faq = [
  {
    q: '¿Cuál es tu stack tecnológico?',
    a: 'En la sección “Con qué trabajo” figuran JavaScript, React, Node.js, MongoDB, HTML5, CSS, Sass, Tailwind, Express.js, Firebase, Git, GitHub, Docker, VS Code y Vite.',
  },
  {
    q: '¿Está disponible para ser contratado?',
    a: `Sí, estoy disponible para nuevos proyectos y oportunidades. Escribime a ${CONTACT_EMAIL} o completá el formulario de contacto; respondo dentro de las 24 horas hábiles.`,
  },
  {
    q: 'Quiero desarrollar un proyecto, ¿cómo empezamos?',
    a: `¡Buenísimo! Contame brevemente qué querés construir y cuál es el objetivo. Escribime a ${CONTACT_EMAIL} o usá el formulario de contacto; te respondo dentro de las 24 horas hábiles para conversar el alcance y los próximos pasos.`,
  },
  {
    q: 'Consulta sobre precios',
    a: `El presupuesto depende del alcance, las funcionalidades y los tiempos de cada proyecto. Contame qué necesitás por el formulario de contacto o escribime a ${CONTACT_EMAIL} y te preparo una propuesta clara con costos y plazos.`,
  },
]

// Structured FAQ in a chat-style widget. Replaces the poetic copy with
// something the visitor can actually scan and interact with.
function FaqChat({ onClose }) {
  const [thread, setThread] = useState([{ from: 'bot', text: 'Soy el asistente de Max. ¿En qué puedo ayudarte?' }])
  const [asked, setAsked] = useState([])
  const [phase, setPhase] = useState('idle')
  const bodyRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [thread, phase])

  const ask = index => {
    if (phase !== 'idle') return
    const item = faq[index]
    if (!item) return
    setAsked(prev => (prev.includes(index) ? prev : [...prev, index]))
    setThread(prev => [...prev, { from: 'user', text: item.q }])
    setPhase('thinking')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setPhase('writing')
      setThread(prev => [...prev, { from: 'bot', text: '' }])
      let cursor = 0
      const writeNext = () => {
        cursor = Math.min(item.a.length, cursor + 2)
        const visible = item.a.slice(0, cursor)
        setThread(prev => {
          const last = prev[prev.length - 1]
          if (!last || last.from !== 'bot') return [...prev, { from: 'bot', text: visible }]
          return [...prev.slice(0, -1), { ...last, text: visible }]
        })
        if (cursor < item.a.length) {
          const lastChar = item.a[cursor - 1]
          const delay = /[.!?]/.test(lastChar) ? 230 : /[,;:]/.test(lastChar) ? 130 : 48 + (cursor % 4) * 5
          timer.current = setTimeout(writeNext, delay)
        } else {
          timer.current = null
          setPhase('idle')
        }
      }
      writeNext()
    }, 1500)
  }

  return (
    <div className="chat">
      <div className="chat-head">ASISTENTE <span className="chat-status" aria-label="En línea"><span className="chat-status-dot" aria-hidden="true" />EN LÍNEA</span>{onClose && <button type="button" className="chat-close" onClick={onClose} aria-label="Cerrar asistente">×</button>}</div>
      <div className="chat-body" ref={bodyRef} role="log" aria-live="polite">
        {thread.map((m, i) => {
          const writing = phase === 'writing' && i === thread.length - 1 && m.from === 'bot'
          return <p className={`msg msg-${m.from}${writing ? ' is-writing' : ''}`} key={`${m.from}-${i}`}>{m.text}</p>
        })}
        {phase === 'thinking' && <p className="msg msg-bot thinking" role="status"><span>Pensando</span><span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span></p>}
      </div>
      <div className="chat-chips">
        {faq.map((item, i) => (
          <button
            key={item.q}
            type="button"
            onClick={() => ask(i)}
            disabled={phase !== 'idle'}
            className={asked.includes(i) ? 'is-asked' : undefined}
          >
            {asked.includes(i) ? '✓ ' : ''}{item.q}
          </button>
        ))}
      </div>
    </div>
  )
}

// Floating assistant, WhatsApp-style. It lives outside the contact section so
// the FAQ is reachable from anywhere on the page.
function AssistantWidget({ open, onToggle, onClose }) {
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    if (!open) return undefined
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 760px)').matches) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  return (
    <div className={open ? 'assistant is-open' : 'assistant'}>
      <div className="assistant-panel" id="assistant-panel" role="dialog" aria-label="Asistente de preguntas frecuentes" aria-hidden={!open}>
        <FaqChat onClose={onClose} />
      </div>
      <div className="assistant-controls">
        {showBubble && <div className="fab-bubble">
          <span>¿Tenés alguna consulta?</span>
          <button type="button" className="bubble-close" aria-label="Ocultar ayuda" onClick={() => setShowBubble(false)}>×</button>
        </div>}
        <button
          type="button"
          className="assistant-fab"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="assistant-panel"
          aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        >
          <span className="fab-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5V7" stroke="#0a1008" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="12" cy="3.5" r="1.5" fill="#0a1008"/>
              <rect x="4.5" y="7" width="15" height="12" rx="4" stroke="#0a1008" stroke-width="1.8"/>
              <path d="M4.5 11H3.25M20.75 11H19.5" stroke="#0a1008" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="9" cy="12" r="1.1" fill="#0a1008"/>
              <circle cx="15" cy="12" r="1.1" fill="#0a1008"/>
              <path d="M9.5 15.5c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1" stroke="#0a1008" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    let frame = 0
    let finishTimer
    let removeTimer
    const startedAt = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ready = document.readyState === 'complete'

    const markReady = () => { ready = true }
    if (!ready) window.addEventListener('load', markReady, { once: true })
    if (document.fonts?.ready) document.fonts.ready.then(markReady)

    const tick = now => {
      const elapsed = now - startedAt
      const minimumDuration = 3500
      const timeProgress = Math.min(1, elapsed / minimumDuration)
      const canFinish = ready && elapsed >= minimumDuration
      const next = canFinish ? 100 : Math.min(99, Math.round(timeProgress * 99))
      setProgress(current => Math.max(current, next))

      if (canFinish) {
        setProgress(100)
        finishTimer = window.setTimeout(() => {
          setLeaving(true)
          document.body.classList.add('page-ready')
          window.dispatchEvent(new Event('portfolio-ready'))
        }, reducedMotion ? 80 : 260)
        removeTimer = window.setTimeout(() => {
          document.body.classList.remove('is-loading')
        }, reducedMotion ? 160 : 720)
        return
      }
      frame = window.requestAnimationFrame(tick)
    }

    document.body.classList.add('is-loading')
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('load', markReady)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(finishTimer)
      window.clearTimeout(removeTimer)
      document.body.classList.remove('is-loading')
      document.body.classList.remove('page-ready')
    }
  }, [])

  return (
    <div className={`loading-screen${leaving ? ' is-leaving' : ''}`} role="status" aria-live="polite" aria-label={`Cargando portfolio, ${progress}%`}>
      <ParticleField />
      <div className="loading-center">
        <span className="loading-kicker">MF.DEV / PORTFOLIO</span>
        <strong className="loading-percent">{String(progress).padStart(2, '0')}<small>%</small></strong>
        <div className="loading-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        <span className="loading-caption">LOADING...</span>
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState('idle')
  const [scrolled, setScrolled] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const roleLine1 = 'Desarrollador'
  const roleLine2 = 'Web'
  const roleBadge = 'Full-Stack'
  const introLead = 'Soy '
  const introName = 'Maximiliano Fallini.'
  const introTail = ' Ayudo a personas y negocios a convertir sus ideas en páginas y aplicaciones web claras, fáciles de usar y pensadas para sus clientes.'
  const introFull = introLead + introName + introTail
  const [typedIntro, setTypedIntro] = useState(0)
  const [canTypeIntro, setCanTypeIntro] = useState(false)

  const handleContactSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    formData.append('_subject', `Nuevo mensaje desde el portfolio: ${formData.get('name')}`)
    setFormStatus('sending')

    try {
      const response = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const result = await response.json()
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('FormSubmit rejected the message')
      }
      form.reset()
      setFormStatus('sent')
    } catch {
      setFormStatus('error')
    }
  }

  useEffect(() => {
    const unlockIntro = () => setCanTypeIntro(true)
    if (document.body.classList.contains('page-ready')) unlockIntro()
    window.addEventListener('portfolio-ready', unlockIntro)
    return () => window.removeEventListener('portfolio-ready', unlockIntro)
  }, [])

  useEffect(() => {
    if (!canTypeIntro) return undefined
    let timer
    let introIndex = 0
    const typeIntro = () => {
      introIndex += 1
      setTypedIntro(introIndex)
      if (introIndex < introFull.length) {
        const char = introFull[introIndex - 1]
        const delay = /[.!?]/.test(char) ? 210 : /[,;:]/.test(char) ? 130 : 40
        timer = window.setTimeout(typeIntro, delay)
      }
    }
    timer = window.setTimeout(typeIntro, 300)
    return () => window.clearTimeout(timer)
  }, [introFull, canTypeIntro])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const targets = document.querySelectorAll('.work .section-head, .project-card, .skills .section-head, .tech-card, .contact-copy, .contact-form')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { threshold: .08, rootMargin: '0px 0px -32px 0px' })

    targets.forEach((element, index) => {
      element.classList.add('scroll-reveal')
      element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`)
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Custom anchor scrolling: land on the section heading rather than the top
  // of the section, so the heading clears the sticky navbar instead of hiding
  // under it or floating too far down (scroll-margin alone can't target the
  // heading because the section has 150px of top padding).
  useEffect(() => {
    const onAnchorClick = e => {
      const anchor = e.target.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = (anchor.getAttribute('href') || '').slice(1)
      if (!id) return
      const section = document.getElementById(id)
      if (!section) return
      e.preventDefault()
      setMenuOpen(false)
      const nav = document.querySelector('.nav-shell')
      const navH = nav ? nav.offsetHeight : 92
      const target = id === 'top' ? null : section.querySelector('.section-head') || section
      const y = target
        ? target.getBoundingClientRect().top + window.scrollY - navH - 40
        : 0
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    }
    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [])

  const introLeadCount = Math.min(typedIntro, introLead.length)
  const introNameCount = Math.min(Math.max(typedIntro - introLead.length, 0), introName.length)
  const introTailCount = Math.min(Math.max(typedIntro - introLead.length - introName.length, 0), introTail.length)
  const introCaret = typedIntro > 0

  return <>
    <LoadingScreen />
    <ScrollProgress />
    <ParticleField />
    <SpotlightSeparators />
    <div className="noise" />
    <AssistantWidget open={assistantOpen} onToggle={() => setAssistantOpen(o => !o)} onClose={() => setAssistantOpen(false)} />
    <header className={scrolled ? 'nav-shell is-scrolled' : 'nav-shell'}><div className="nav-wrap">
      <a className="logo" href="#top" onClick={() => setMenuOpen(false)}><Mark /><span>MF<span className="muted">.dev</span></span></a>
      <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? 'CERRAR' : 'MENÚ'} <span>+</span></button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        <a href="#work" onClick={() => setMenuOpen(false)}>Proyectos</a><a href="#skills" onClick={() => setMenuOpen(false)}>Tecnologías</a><a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Contacto <Arrow /></a>
      </nav>
    </div></header>

    <main id="top">
      <section className="hero section-grid">
        <div className="hero-kicker"><span className="live-dot" /> DISPONIBLE PARA NUEVOS PROYECTOS</div>
        <div className="hero-copy">
          <h1 className="hero-role" aria-label={`${roleLine1} ${roleLine2} ${roleBadge}`}>
            <span className="hero-role-main">{roleLine1}</span>
            <span className="hero-role-bottom">
              <span>{roleLine2}</span>
              <b>{roleBadge}</b>
            </span>
          </h1>
          <p className="hero-intro" aria-label={introFull}>
            {introLead.slice(0, introLeadCount)}<strong>{introName.slice(0, introNameCount)}</strong>{introTail.slice(0, introTailCount)}{introCaret && <span className="typing-caret" aria-hidden="true">|</span>}
          </p>
          <div className="hero-actions"><a className="button primary" href="#work">Explorar proyectos <Arrow /></a><a className="button contact-button" href="#contact-form">Contacto <Arrow /></a></div>
        </div>
        <div className="hero-aside"><a className="profile-chip" href="https://github.com/Maximiliano-Fallini" target="_blank" rel="noreferrer" aria-label="Ver GitHub de Maximiliano Fallini"><img src={asset('github-avatar.jpg')} alt="Avatar de Maximiliano Fallini" /><span>Maximiliano Fallini<br /><small>Buenos Aires, Argentina</small></span></a><Vscode3D /></div>
        <div className="hero-footer"><span>DESLIZÁ PARA EXPLORAR <b>↓</b></span></div>
      </section>

      <section id="work" className="work section-grid section-pad"><div className="section-head"><div><h2>Mis<br /><em>proyectos.</em></h2></div></div><div className="projects">{projects.map(p => <SpotlightCard className={`project-card ${p.accent}`} key={p.title}><div className="project-visual"><img src={p.image} alt="" /><span className="project-number">{p.number}</span><a href={p.demo} target="_blank" rel="noreferrer" aria-label={`Ver demo de ${p.title}`} className="visual-link"><Arrow external /></a></div><div className="project-info"><div><p className="eyebrow">{p.type}</p><h3>{p.title}</h3></div><p>{p.description}</p><div className="project-bottom"><div className="tags">{p.stack.map(t => { const icon = techIconUrl(t); return <span key={t}>{icon && <img src={icon} alt="" loading="lazy" />}{t}</span> })}</div><a href={p.github} target="_blank" rel="noreferrer" className="text-link">{p.linkLabel ?? 'Repositorio'} <Arrow external /></a></div></div></SpotlightCard>)}</div></section>

      <section id="skills" className="skills section-grid section-pad"><div className="section-head"><div><p className="eyebrow">TECNOLOGÍAS</p><h2>Con qué<br /><em>trabajo.</em></h2></div><p className="section-note">Las herramientas que uso para llevar una idea desde el primer commit hasta producción.</p></div><div className="tech-viewport" aria-label="Carrusel infinito de tecnologías"><div className="tech-grid">{[...technologies, ...technologies].map(([name, icon, category], index) => <article className="tech-card" key={`${name}-${index}`}><div className="tech-icon"><img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`} alt="" /></div><div><h3>{name}</h3><p>{category}</p></div><span className="tech-arrow">↗</span></article>)}</div></div></section>

      <section id="contact" className="contact section-grid section-pad"><div className="contact-copy"><p className="eyebrow">CONTACTO</p><h2>Hablemos.</h2><ul className="contact-facts"><li><span>EMAIL</span><a href={gmailCompose({ subject: 'Contacto desde tu portafolio' })} target="_blank" rel="noreferrer">{CONTACT_EMAIL} <Arrow external /></a></li><li><span>UBICACIÓN</span><strong>Buenos Aires, Argentina</strong></li><li><span>RESPUESTA</span><strong>Menos de 24 h hábiles</strong></li><li><span>ASISTENTE</span><button type="button" onClick={() => setAssistantOpen(true)}>Preguntas frecuentes <Arrow /></button></li></ul><div className="socials"><a href="https://github.com/Maximiliano-Fallini" target="_blank" rel="noreferrer">GitHub <Arrow external /></a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn <Arrow external /></a></div></div><form id="contact-form" className="contact-form" action={FORM_SUBMIT_ENDPOINT} method="POST" onSubmit={handleContactSubmit}><label>NOMBRE <input required name="name" placeholder="Tu nombre" /></label><label>EMAIL <input required name="email" type="email" placeholder="tu@email.com" /></label><label>MENSAJE <textarea required name="message" rows="4" placeholder="Quiero una página web profesional" /></label>{formStatus !== 'idle' && <small role="status" aria-live="polite">{formStatus === 'sending' ? 'Enviando mensaje...' : formStatus === 'sent' ? 'Mensaje enviado. Gracias por escribirme.' : 'No se pudo enviar. Probá de nuevo o escribime por email.'}</small>}<button className="button primary" type="submit" disabled={formStatus === 'sending'}>{formStatus === 'sending' ? 'Enviando...' : formStatus === 'sent' ? 'Enviar otro mensaje' : 'Enviar mensaje'} <Arrow /></button></form></section>
    </main>
    <footer className="footer section-grid"><a className="logo" href="#top"><Mark /><span>MF<span className="muted">.dev</span></span></a><span>Diseñado y construido con intención.</span><span>© 2026 Maximiliano Fallini</span></footer>
  </>
}

export default App

createRoot(document.getElementById('root')).render(<App />)
