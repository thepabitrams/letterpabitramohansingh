/* src/letter/effect/variants/hearts-chase.tsx */
import { useEffect, useRef } from 'react'

type HeartsChaseProps = {
  recipientName?: string
  senderName?: string
}

type Position = {
  x: number
  y: number
}

type ChaseMode = 'chase' | 'meet' | 'split'

type ParticleOptions = Partial<{
  speed: number
  angle: number
  life: number
  size: number
  lift: number
  drag: number
  color: string
}>

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  rotation: number
  spin: number
  drag: number
}

type ChaseState = {
  sender: Position
  recipient: Position
  senderTarget: Position
  recipientTarget: Position
  mode: ChaseMode
  timer: number
  recipientRetargetTimer: number
  hasBurst: boolean
}

const HEART_SIZE = 100
const HEART_FONT_SIZE = 100
const MAX_PARTICLES = 320
const PARTICLE_PALETTE = ['#ef4444', '#ec4899', '#f472b6', '#fb7185', '#f9a8d4', '#db2777', '#fda4af']
const BOUNDS = { xMin: 18, xMax: 82, yMin: 18, yMax: 82 }
const MOVEMENT_RATES = { senderChase: 3.6, recipientChase: 2.3, meet: 5.5, split: 3.2 }

const KEYFRAMES = `
  @keyframes heartsChaseDhakDhak {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.14); }
    50% { transform: scale(1); }
    75% { transform: scale(1.09); }
  }
`

const LABEL_STYLE: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 800,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: '#9d174d',
  backgroundColor: '#ffffff',
  padding: '8px 18px',
  borderRadius: '9999px',
  border: '1.5px solid rgba(157, 23, 77, 0.15)',
  boxShadow: '0 4px 14px rgba(157, 23, 77, 0.18)',
  whiteSpace: 'nowrap',
  maxWidth: '220px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

let cachedSenderName = 'ME'
let cachedRecipientName = 'YOU'
let isNamesCached = false

function resolveNamesFromUrl(props: HeartsChaseProps): void {
  let senderName = 'ME'
  let recipientName = 'YOU'

  if (typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/').filter((segment) => {
      return (
        segment &&
        segment.length > 1 &&
        segment.length < 30 &&
        /^[a-z0-9-]+$/i.test(segment)
      )
    })

    if (pathSegments.length >= 2) {
      senderName = pathSegments[pathSegments.length - 2].replace(/-/g, ' ').toUpperCase()
      recipientName = pathSegments[pathSegments.length - 1].replace(/-/g, ' ').toUpperCase()
    } else if (pathSegments.length === 1) {
      senderName = pathSegments[0].replace(/-/g, ' ').toUpperCase()
      recipientName = 'YOU'
    }
  } else {
    senderName = (props.senderName || 'ME').toUpperCase()
    recipientName = (props.recipientName || 'YOU').toUpperCase()
  }

  cachedSenderName = senderName
  cachedRecipientName = recipientName
  isNamesCached = true
}

const clamp = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value
}

const computeDistance = (first: Position, second: Position): number => {
  return Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2)
}

const pickRandomPosition = (avoidPosition?: Position, minDistance = 0): Position => {
  let candidateX = 50
  let candidateY = 50

  for (let attempt = 0; attempt < 40; attempt++) {
    candidateX = BOUNDS.xMin + Math.random() * (BOUNDS.xMax - BOUNDS.xMin)
    candidateY = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin)

    if (
      !avoidPosition ||
      computeDistance(
        { x: candidateX, y: candidateY },
        avoidPosition
      ) >= minDistance
    ) {
      break
    }
  }

  return { x: candidateX, y: candidateY }
}

const HeartsChaseLayer = (props: HeartsChaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const senderHeartRef = useRef<HTMLDivElement>(null)
  const recipientHeartRef = useRef<HTMLDivElement>(null)

  if (!isNamesCached) {
    resolveNamesFromUrl(props)
  }

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const senderHeart = senderHeartRef.current
    const recipientHeart = recipientHeartRef.current
    if (!container || !canvas || !senderHeart || !recipientHeart) return

    const context = canvas.getContext('2d')
    if (!context) return

    let canvasWidth = 1
    let canvasHeight = 1
    let devicePixelRatio = 1

    const handleResize = () => {
      const bounds = container.getBoundingClientRect()
      canvasWidth = Math.max(1, bounds.width)
      canvasHeight = Math.max(1, bounds.height)
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(canvasWidth * devicePixelRatio)
      canvas.height = Math.round(canvasHeight * devicePixelRatio)
      canvas.style.width = canvasWidth + 'px'
      canvas.style.height = canvasHeight + 'px'

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const particles: Particle[] = []

    const addParticle = (
      positionX: number,
      positionY: number,
      options: ParticleOptions = {}
    ) => {
      if (particles.length >= MAX_PARTICLES) particles.shift()

      const baseSpeed = options.speed ?? 26
      const directionAngle = options.angle ?? Math.random() * Math.PI * 2
      const scaledSpeed = baseSpeed * (0.35 + Math.random() * 0.9)
      const maxLife = (options.life ?? 1) * (0.6 + Math.random() * 0.8)

      particles.push({
        x: positionX,
        y: positionY,
        vx: Math.cos(directionAngle) * scaledSpeed,
        vy: Math.sin(directionAngle) * scaledSpeed - (options.lift ?? 10),
        life: 0,
        maxLife,
        size: Math.max(3, Math.round((options.size ?? 11) * (0.5 + Math.random() * 0.95))),
        color: options.color ?? PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 4,
        drag: options.drag ?? 1.7,
      })
    }

    const updateParticles = (deltaTime: number) => {
      for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index]
        particle.life += deltaTime

        if (particle.life >= particle.maxLife) {
          particles.splice(index, 1)
          continue
        }

        const dampingFactor = Math.exp(-particle.drag * deltaTime)
        particle.vx *= dampingFactor
        particle.vy *= dampingFactor
        particle.vy += 16 * deltaTime

        particle.x += particle.vx * deltaTime
        particle.y += particle.vy * deltaTime
        particle.rotation += particle.spin * deltaTime
      }
    }

    const drawParticles = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      for (const particle of particles) {
        const fadeAmount = 1 - particle.life / particle.maxLife

        context.save()
        context.globalAlpha = Math.min(1, fadeAmount * 1.8)
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.fillStyle = particle.color
        context.font = particle.size + 'px system-ui, sans-serif'
        context.fillText('♥', 0, 0)
        context.restore()
      }
    }

    const triggerBurst = (burstX: number, burstY: number, particleCount: number) => {
      for (let index = 0; index < particleCount; index++) {
        const angle = (index / particleCount) * Math.PI * 2 + Math.random() * 0.4
        addParticle(burstX, burstY, {
          angle,
          speed: 115,
          life: 1.2,
          size: 14,
          lift: 0,
          drag: 1.6,
        })
      }
    }

    const state: ChaseState = {
      sender: { x: 30, y: 40 },
      recipient: { x: 70, y: 60 },
      senderTarget: { x: 30, y: 40 },
      recipientTarget: { x: 70, y: 60 },
      mode: 'chase',
      timer: 2.5,
      recipientRetargetTimer: 0,
      hasBurst: false,
    }

    const moveSenderTowardTarget = (deltaTime: number, rate: number) => {
      const interpolationFactor = 1 - Math.exp(-rate * deltaTime)
      state.sender.x = clamp(
        state.sender.x + (state.senderTarget.x - state.sender.x) * interpolationFactor,
        BOUNDS.xMin,
        BOUNDS.xMax
      )
      state.sender.y = clamp(
        state.sender.y + (state.senderTarget.y - state.sender.y) * interpolationFactor,
        BOUNDS.yMin,
        BOUNDS.yMax
      )
    }

    const moveRecipientTowardTarget = (deltaTime: number, rate: number) => {
      const interpolationFactor = 1 - Math.exp(-rate * deltaTime)
      state.recipient.x = clamp(
        state.recipient.x + (state.recipientTarget.x - state.recipient.x) * interpolationFactor,
        BOUNDS.xMin,
        BOUNDS.xMax
      )
      state.recipient.y = clamp(
        state.recipient.y + (state.recipientTarget.y - state.recipient.y) * interpolationFactor,
        BOUNDS.yMin,
        BOUNDS.yMax
      )
    }

    const updateChaseLogic = (deltaTime: number) => {
      state.timer -= deltaTime

      if (state.mode === 'chase') {
        state.recipientRetargetTimer -= deltaTime

        if (state.recipientRetargetTimer <= 0) {
          state.recipientRetargetTimer = 0.7 + Math.random() * 1.0
          const newTarget = pickRandomPosition(state.sender, 28)
          state.recipientTarget.x = newTarget.x
          state.recipientTarget.y = newTarget.y
        }

        state.senderTarget.x = state.recipient.x
        state.senderTarget.y = state.recipient.y

        moveSenderTowardTarget(deltaTime, MOVEMENT_RATES.senderChase)
        moveRecipientTowardTarget(deltaTime, MOVEMENT_RATES.recipientChase)

        const currentDistance = computeDistance(state.sender, state.recipient)

        if (currentDistance < 7 || state.timer <= 0) {
          state.mode = 'meet'
          state.timer = 1.8
          state.hasBurst = false
        }
      } else if (state.mode === 'meet') {
        state.senderTarget.x = 50
        state.senderTarget.y = 50
        state.recipientTarget.x = 50
        state.recipientTarget.y = 50

        moveSenderTowardTarget(deltaTime, MOVEMENT_RATES.meet)
        moveRecipientTowardTarget(deltaTime, MOVEMENT_RATES.meet)

        const currentDistance = computeDistance(state.sender, state.recipient)

        if (!state.hasBurst && currentDistance < 5) {
          state.hasBurst = true
          triggerBurst(canvasWidth / 2, canvasHeight / 2, 30)
        }

        if (state.timer <= 0) {
          if (!state.hasBurst) {
            triggerBurst(canvasWidth / 2, canvasHeight / 2, 18)
          }

          state.mode = 'split'
          state.timer = 1.3

          const senderSplitPoint = pickRandomPosition()
          const recipientSplitPoint = pickRandomPosition(senderSplitPoint, 40)

          state.senderTarget.x = senderSplitPoint.x
          state.senderTarget.y = senderSplitPoint.y
          state.recipientTarget.x = recipientSplitPoint.x
          state.recipientTarget.y = recipientSplitPoint.y
        }
      } else {
        moveSenderTowardTarget(deltaTime, MOVEMENT_RATES.split)
        moveRecipientTowardTarget(deltaTime, MOVEMENT_RATES.split)

        if (state.timer <= 0) {
          state.mode = 'chase'
          state.timer = 2.5 + Math.random() * 2.5
          state.recipientRetargetTimer = 0
        }
      }
    }

    let previousTimestamp = 0
    let elapsedTime = 0
    let trailAccumulator = 0
    let animationFrameId = 0

    const renderFrame = (timestamp: number) => {
      if (!previousTimestamp) previousTimestamp = timestamp
      const deltaTime = Math.min((timestamp - previousTimestamp) / 1000, 0.05)
      previousTimestamp = timestamp
      elapsedTime += deltaTime

      updateChaseLogic(deltaTime)
      updateParticles(deltaTime)

      const wobbleAmount = 2.4
      const senderWobbledX = state.sender.x + Math.sin(elapsedTime * 1.9) * wobbleAmount
      const senderWobbledY = state.sender.y + Math.cos(elapsedTime * 2.4) * wobbleAmount
      const recipientWobbledX = state.recipient.x + Math.cos(elapsedTime * 2.1) * wobbleAmount
      const recipientWobbledY = state.recipient.y + Math.sin(elapsedTime * 1.6) * wobbleAmount

      const senderPixelX = (senderWobbledX / 100) * canvasWidth
      const senderPixelY = (senderWobbledY / 100) * canvasHeight
      const recipientPixelX = (recipientWobbledX / 100) * canvasWidth
      const recipientPixelY = (recipientWobbledY / 100) * canvasHeight

      senderHeart.style.transform = `translate3d(${senderPixelX.toFixed(2)}px, ${senderPixelY.toFixed(2)}px, 0)`
      recipientHeart.style.transform = `translate3d(${recipientPixelX.toFixed(2)}px, ${recipientPixelY.toFixed(2)}px, 0)`

      trailAccumulator += deltaTime
      while (trailAccumulator >= 0.045) {
        trailAccumulator -= 0.045
        addParticle(senderPixelX, senderPixelY, { speed: 18, life: 0.75, size: 9, lift: 20, drag: 1.4 })
        addParticle(recipientPixelX, recipientPixelY, { speed: 18, life: 0.75, size: 9, lift: 20, drag: 1.4 })
      }

      drawParticles()
      animationFrameId = requestAnimationFrame(renderFrame)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(container)
    }

    animationFrameId = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        <div
          ref={senderHeartRef}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: HEART_SIZE,
            height: HEART_SIZE,
            marginLeft: -HEART_SIZE / 2,
            marginTop: -HEART_SIZE / 2,
            zIndex: 2,
            willChange: 'transform',
          }}
        >
          <div
            className="absolute text-center"
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 8,
            }}
          >
            <span style={LABEL_STYLE}>{cachedSenderName}</span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center leading-none"
            style={{
              fontSize: HEART_FONT_SIZE,
              color: '#ef4444',
              filter: 'drop-shadow(0 6px 20px rgba(239, 68, 68, 0.6))',
              animation: 'heartsChaseDhakDhak 1.2s ease-in-out infinite',
            }}
          >
            ♥
          </div>
        </div>

        <div
          ref={recipientHeartRef}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: HEART_SIZE,
            height: HEART_SIZE,
            marginLeft: -HEART_SIZE / 2,
            marginTop: -HEART_SIZE / 2,
            zIndex: 2,
            willChange: 'transform',
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center leading-none"
            style={{
              fontSize: HEART_FONT_SIZE,
              color: '#e11d48',
              filter: 'drop-shadow(0 6px 20px rgba(239, 68, 68, 0.6))',
              animation: 'heartsChaseDhakDhak 1.2s ease-in-out -0.35s infinite',
            }}
          >
            ♥
          </div>
          <div
            className="absolute text-center"
            style={{
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 8,
            }}
          >
            <span style={LABEL_STYLE}>{cachedRecipientName}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default {
  id: 'hearts-chase',
  name: 'Hearts Chase',
  component: HeartsChaseLayer,

  standalone: {
    script: `
      (function () {
        var effectLayer = document.getElementById('effects');
        if (!effectLayer) return;

        var SENDER_NAME = '__SENDER__';
        var RECIPIENT_NAME = '__RECIPIENT__';

        var HEART_SIZE = 100;
        var HEART_FONT_SIZE = 100;
        var MAX_PARTICLES = 320;
        var PARTICLE_PALETTE = ['#ef4444', '#ec4899', '#f472b6', '#fb7185', '#f9a8d4', '#db2777', '#fda4af'];
        var BOUNDS = { xMin: 18, xMax: 82, yMin: 18, yMax: 82 };
        var MOVEMENT_RATES = { senderChase: 3.6, recipientChase: 2.3, meet: 5.5, split: 3.2 };
        var LABEL_STYLE = 'display:inline-block;font-size:13px;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:#9d174d;background-color:#ffffff;padding:8px 18px;border-radius:9999px;border:1.5px solid rgba(157,23,77,0.15);box-shadow:0 4px 14px rgba(157,23,77,0.18);white-space:nowrap;max-width:220px;overflow:hidden;text-overflow:ellipsis;';

        var styleElement = document.createElement('style');
        styleElement.textContent = '@keyframes heartsChaseDhakDhak { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.14); } 50% { transform: scale(1); } 75% { transform: scale(1.09); } }';
        document.head.appendChild(styleElement);

        var canvasElement = document.createElement('canvas');
        canvasElement.style.cssText = 'position:absolute;inset:0;display:block;pointer-events:none;z-index:1;';
        effectLayer.appendChild(canvasElement);

        function buildHeartElement(className, name, namePosition, color) {
          var heartElement = document.createElement('div');
          heartElement.className = className;
          heartElement.style.cssText = 'position:absolute;left:0;top:0;width:' + HEART_SIZE + 'px;height:' + HEART_SIZE + 'px;margin-left:' + (-HEART_SIZE / 2) + 'px;margin-top:' + (-HEART_SIZE / 2) + 'px;will-change:transform;pointer-events:none;z-index:2;';

          var bodyElement = document.createElement('div');
          bodyElement.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:' + HEART_FONT_SIZE + 'px;line-height:1;color:' + color + ';filter:drop-shadow(0 6px 20px rgba(239,68,68,0.6));transform-origin:center;will-change:transform;animation:heartsChaseDhakDhak 1.2s ease-in-out infinite;';
          bodyElement.textContent = '\\u2665';
          heartElement.appendChild(bodyElement);

          var labelWrapper = document.createElement('div');
          labelWrapper.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);';

          if (namePosition === 'above') {
            labelWrapper.style.bottom = '100%';
            labelWrapper.style.marginBottom = '8px';
          } else {
            labelWrapper.style.top = '100%';
            labelWrapper.style.marginTop = '8px';
          }

          var labelTextElement = document.createElement('span');
          labelTextElement.style.cssText = LABEL_STYLE;
          labelTextElement.textContent = name;

          labelWrapper.appendChild(labelTextElement);
          heartElement.appendChild(labelWrapper);

          effectLayer.appendChild(heartElement);
          return heartElement;
        }

        var senderHeartElement = buildHeartElement('heart-sender', SENDER_NAME, 'above', '#ef4444');
        var recipientHeartElement = buildHeartElement('heart-recipient', RECIPIENT_NAME, 'below', '#e11d48');

        var canvasContext = canvasElement.getContext('2d');
        var canvasWidth = 1;
        var canvasHeight = 1;
        var devicePixelRatio = 1;

        function handleResize() {
          var bounds = effectLayer.getBoundingClientRect();
          canvasWidth = Math.max(1, bounds.width);
          canvasHeight = Math.max(1, bounds.height);
          devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

          canvasElement.width = Math.round(canvasWidth * devicePixelRatio);
          canvasElement.height = Math.round(canvasHeight * devicePixelRatio);
          canvasElement.style.width = canvasWidth + 'px';
          canvasElement.style.height = canvasHeight + 'px';

          canvasContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        }

        var particles = [];

        function addParticle(positionX, positionY, options) {
          options = options || {};
          if (particles.length >= MAX_PARTICLES) particles.shift();

          var baseSpeed = options.speed == null ? 26 : options.speed;
          var directionAngle = options.angle == null ? Math.random() * Math.PI * 2 : options.angle;
          var scaledSpeed = baseSpeed * (0.35 + Math.random() * 0.9);
          var particleLife = (options.life == null ? 1 : options.life) * (0.6 + Math.random() * 0.8);

          particles.push({
            x: positionX,
            y: positionY,
            vx: Math.cos(directionAngle) * scaledSpeed,
            vy: Math.sin(directionAngle) * scaledSpeed - (options.lift == null ? 10 : options.lift),
            life: 0,
            maxLife: particleLife,
            size: Math.max(3, Math.round((options.size == null ? 11 : options.size) * (0.5 + Math.random() * 0.95))),
            color: options.color || PARTICLE_PALETTE[(Math.random() * PARTICLE_PALETTE.length) | 0],
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 4,
            drag: options.drag == null ? 1.7 : options.drag
          });
        }

        function updateParticles(deltaTime) {
          for (var index = particles.length - 1; index >= 0; index--) {
            var particle = particles[index];
            particle.life += deltaTime;

            if (particle.life >= particle.maxLife) {
              particles.splice(index, 1);
              continue;
            }

            var dampingFactor = Math.exp(-particle.drag * deltaTime);
            particle.vx *= dampingFactor;
            particle.vy *= dampingFactor;
            particle.vy += 16 * deltaTime;

            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.rotation += particle.spin * deltaTime;
          }
        }

        function drawParticles() {
          canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
          canvasContext.textAlign = 'center';
          canvasContext.textBaseline = 'middle';

          for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            var fadeAmount = 1 - particle.life / particle.maxLife;

            canvasContext.save();
            canvasContext.globalAlpha = Math.min(1, fadeAmount * 1.8);
            canvasContext.translate(particle.x, particle.y);
            canvasContext.rotate(particle.rotation);
            canvasContext.fillStyle = particle.color;
            canvasContext.font = particle.size + 'px system-ui, sans-serif';
            canvasContext.fillText('\\u2665', 0, 0);
            canvasContext.restore();
          }
        }

        function triggerBurst(burstX, burstY, particleCount) {
          for (var index = 0; index < particleCount; index++) {
            var angle = (index / particleCount) * Math.PI * 2 + Math.random() * 0.4;
            addParticle(burstX, burstY, {
              angle: angle,
              speed: 115,
              life: 1.2,
              size: 14,
              lift: 0,
              drag: 1.6
            });
          }
        }

        function clampValue(value, min, max) {
          return value < min ? min : value > max ? max : value;
        }

        function computeDistance(first, second) {
          return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
        }

        function pickRandomPosition(avoidPosition, minDistance) {
          var candidateX = 50;
          var candidateY = 50;

          for (var attempt = 0; attempt < 40; attempt++) {
            candidateX = BOUNDS.xMin + Math.random() * (BOUNDS.xMax - BOUNDS.xMin);
            candidateY = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin);

            if (!avoidPosition || computeDistance({ x: candidateX, y: candidateY }, avoidPosition) >= minDistance) {
              break;
            }
          }

          return { x: candidateX, y: candidateY };
        }

        var chaseState = {
          sender: { x: 30, y: 40 },
          recipient: { x: 70, y: 60 },
          senderTarget: { x: 30, y: 40 },
          recipientTarget: { x: 70, y: 60 },
          mode: 'chase',
          timer: 2.5,
          recipientRetargetTimer: 0,
          hasBurst: false
        };

        function moveSenderTowardTarget(deltaTime, rate) {
          var interpolationFactor = 1 - Math.exp(-rate * deltaTime);
          chaseState.sender.x = clampValue(chaseState.sender.x + (chaseState.senderTarget.x - chaseState.sender.x) * interpolationFactor, BOUNDS.xMin, BOUNDS.xMax);
          chaseState.sender.y = clampValue(chaseState.sender.y + (chaseState.senderTarget.y - chaseState.sender.y) * interpolationFactor, BOUNDS.yMin, BOUNDS.yMax);
        }

        function moveRecipientTowardTarget(deltaTime, rate) {
          var interpolationFactor = 1 - Math.exp(-rate * deltaTime);
          chaseState.recipient.x = clampValue(chaseState.recipient.x + (chaseState.recipientTarget.x - chaseState.recipient.x) * interpolationFactor, BOUNDS.xMin, BOUNDS.xMax);
          chaseState.recipient.y = clampValue(chaseState.recipient.y + (chaseState.recipientTarget.y - chaseState.recipient.y) * interpolationFactor, BOUNDS.yMin, BOUNDS.yMax);
        }

        function updateChaseLogic(deltaTime) {
          chaseState.timer -= deltaTime;

          if (chaseState.mode === 'chase') {
            chaseState.recipientRetargetTimer -= deltaTime;

            if (chaseState.recipientRetargetTimer <= 0) {
              chaseState.recipientRetargetTimer = 0.7 + Math.random() * 1.0;
              var newTarget = pickRandomPosition(chaseState.sender, 28);
              chaseState.recipientTarget.x = newTarget.x;
              chaseState.recipientTarget.y = newTarget.y;
            }

            chaseState.senderTarget.x = chaseState.recipient.x;
            chaseState.senderTarget.y = chaseState.recipient.y;

            moveSenderTowardTarget(deltaTime, MOVEMENT_RATES.senderChase);
            moveRecipientTowardTarget(deltaTime, MOVEMENT_RATES.recipientChase);

            var currentDistance = computeDistance(chaseState.sender, chaseState.recipient);

            if (currentDistance < 7 || chaseState.timer <= 0) {
              chaseState.mode = 'meet';
              chaseState.timer = 1.8;
              chaseState.hasBurst = false;
            }
          } else if (chaseState.mode === 'meet') {
            chaseState.senderTarget.x = 50;
            chaseState.senderTarget.y = 50;
            chaseState.recipientTarget.x = 50;
            chaseState.recipientTarget.y = 50;

            moveSenderTowardTarget(deltaTime, MOVEMENT_RATES.meet);
            moveRecipientTowardTarget(deltaTime, MOVEMENT_RATES.meet);

            var meetDistance = computeDistance(chaseState.sender, chaseState.recipient);

            if (!chaseState.hasBurst && meetDistance < 5) {
              chaseState.hasBurst = true;
              triggerBurst(canvasWidth / 2, canvasHeight / 2, 30);
            }

            if (chaseState.timer <= 0) {
              if (!chaseState.hasBurst) {
                triggerBurst(canvasWidth / 2, canvasHeight / 2, 18);
              }

              chaseState.mode = 'split';
              chaseState.timer = 1.3;

              var senderSplitPoint = pickRandomPosition(null, 0);
              var recipientSplitPoint = pickRandomPosition(senderSplitPoint, 40);

              chaseState.senderTarget.x = senderSplitPoint.x;
              chaseState.senderTarget.y = senderSplitPoint.y;
              chaseState.recipientTarget.x = recipientSplitPoint.x;
              chaseState.recipientTarget.y = recipientSplitPoint.y;
            }
          } else {
            moveSenderTowardTarget(deltaTime, MOVEMENT_RATES.split);
            moveRecipientTowardTarget(deltaTime, MOVEMENT_RATES.split);

            if (chaseState.timer <= 0) {
              chaseState.mode = 'chase';
              chaseState.timer = 2.5 + Math.random() * 2.5;
              chaseState.recipientRetargetTimer = 0;
            }
          }
        }

        var previousTimestamp = 0;
        var elapsedTime = 0;
        var trailAccumulator = 0;

        function renderFrame(timestamp) {
          if (!previousTimestamp) previousTimestamp = timestamp;
          var deltaTime = Math.min((timestamp - previousTimestamp) / 1000, 0.05);
          previousTimestamp = timestamp;
          elapsedTime += deltaTime;

          updateChaseLogic(deltaTime);
          updateParticles(deltaTime);

          var wobbleAmount = 2.4;
          var senderWobbledX = chaseState.sender.x + Math.sin(elapsedTime * 1.9) * wobbleAmount;
          var senderWobbledY = chaseState.sender.y + Math.cos(elapsedTime * 2.4) * wobbleAmount;
          var recipientWobbledX = chaseState.recipient.x + Math.cos(elapsedTime * 2.1) * wobbleAmount;
          var recipientWobbledY = chaseState.recipient.y + Math.sin(elapsedTime * 1.6) * wobbleAmount;

          var senderPixelX = (senderWobbledX / 100) * canvasWidth;
          var senderPixelY = (senderWobbledY / 100) * canvasHeight;
          var recipientPixelX = (recipientWobbledX / 100) * canvasWidth;
          var recipientPixelY = (recipientWobbledY / 100) * canvasHeight;

          senderHeartElement.style.transform = 'translate3d(' + senderPixelX.toFixed(2) + 'px,' + senderPixelY.toFixed(2) + 'px,0)';
          recipientHeartElement.style.transform = 'translate3d(' + recipientPixelX.toFixed(2) + 'px,' + recipientPixelY.toFixed(2) + 'px,0)';

          trailAccumulator += deltaTime;
          while (trailAccumulator >= 0.045) {
            trailAccumulator -= 0.045;
            addParticle(senderPixelX, senderPixelY, { speed: 18, life: 0.75, size: 9, lift: 20, drag: 1.4 });
            addParticle(recipientPixelX, recipientPixelY, { speed: 18, life: 0.75, size: 9, lift: 20, drag: 1.4 });
          }

          drawParticles();
          requestAnimationFrame(renderFrame);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        if (window.ResizeObserver) {
          new ResizeObserver(handleResize).observe(effectLayer);
        }
        requestAnimationFrame(renderFrame);
      })();
    `,
  },
}