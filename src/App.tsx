import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import placeBalayAmani from './assets/place-balay-amani.jpg'
import placeCrescent   from './assets/place-the-crescent.jpg'
import placeBku        from './assets/place-bku-resto.jpg'
import placeKinaiyahan from './assets/place-kinaiyahan.jpg'

import cat1 from './assets/no-1b7f3315-68b1-445c-85bb-113ce83db475.jpg'
import cat2 from './assets/no-0e4dde77-15e5-471c-8a14-4cfc98bac459.jpg'
import cat3 from './assets/no-27872038-5933-4153-9e9d-3667f04c17b5.jpg'
import cat4 from './assets/no-832d1b48-b1fb-4b40-82f1-2ee140291cae.jpg'
import cat5 from './assets/no-80c946fe-22e2-441c-802e-2ec306170933.jpg'
import cat6 from './assets/no-b308d12c-9f64-49f4-a916-d0a4f76ef39f.jpg'
import cat7 from './assets/no-8d8f476d-3965-49ae-9e53-9264dd2e5c80.jpg'

const CAT_IMAGES = [cat1, cat2, cat3, cat4, cat5, cat6, cat7]
const CAT_CAPTIONS = [
  'Are you sure about that?',
  'Excuse me??',
  'Did you just try to say no?!',
  "I don't think so.",
  'Try again, Jill.',
  'Wrong answer!',
  'Nope. Just… nope.',
]

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = 'envelope' | 'question' | 'yes' | 'location' | 'datetime' | 'final'

interface DateLocation {
  id: string
  name: string
  description: string
  image: string
}

const DATE_LOCATIONS: DateLocation[] = [
  {
    id: 'balay-amani',
    name: 'Balay Amani',
    description: 'A peaceful rooftop getaway — just us and the view.',
    image: placeBalayAmani,
  },
  {
    id: 'the-crescent',
    name: 'The Crescent',
    description: 'Cozy cafe vibes, warm drinks, and good conversations.',
    image: placeCrescent,
  },
  {
    id: 'bku-resto',
    name: 'BKU Resto & Cafe',
    description: 'Great food, great company — the perfect combo.',
    image: placeBku,
  },
  {
    id: 'kinaiyahan',
    name: 'Kinaiyahan Forest Park',
    description: 'Nature, fresh air, and quality time together.',
    image: placeKinaiyahan,
  },
]

const NO_TAUNTS = [
  'Are you sure?',
  'Nice try!',
  'You almost got me!',
  'Nope!',
  'Think again, Jill.',
  'Too slow!',
  'Hehehe...',
  'Catch me if you can!',
]

// ─── SVG Heart icon ───────────────────────────────────────────────────────────
function HeartIcon({ size = 24, color = '#ff4d6d', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

// ─── Decorative diamond / star spark ─────────────────────────────────────────
function StarIcon({ size = 16, color = '#ffd6e0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  )
}

// ─── Floating Hearts ──────────────────────────────────────────────────────────
function FloatingHearts({ count = 12 }: { count?: number }) {
  const hearts = Array.from({ length: count }, (_, i) => i)
  const sizes = [10, 14, 18, 22, 12, 16, 20]
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-5%',
          }}
          animate={{ y: '-130vh', opacity: [0, 0.6, 0] }}
          transition={{
            duration: 7 + Math.random() * 8,
            delay: Math.random() * 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <HeartIcon
            size={sizes[i % sizes.length]}
            color={['#ff4d6d', '#f48fb1', '#fda4af', '#fbc4d0', '#c9184a'][i % 5]}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Sparkle burst ────────────────────────────────────────────────────────────
function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0], rotate: [0, 90, 180] }}
      transition={{ duration: 0.7 }}
    >
      <StarIcon size={20} color="#ffd6e0" />
    </motion.div>
  )
}

// ─── Rose petals (SVG circles) ────────────────────────────────────────────────
function RosePetals() {
  const petals = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {petals.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `-${5 + Math.random() * 10}%`,
            opacity: 0.4,
          }}
          animate={{
            y: `${110 + Math.random() * 30}vh`,
            x: (Math.random() - 0.5) * 140,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 9 + Math.random() * 10,
            delay: Math.random() * 14,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <HeartIcon size={10 + Math.random() * 10} color="#f48fb1" />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Page background ──────────────────────────────────────────────────────────
function PageBg({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-4 py-10"
      style={{
        background: 'linear-gradient(160deg, #3d0a1a 0%, #6b1030 35%, #a0174a 70%, #c9184a 100%)',
      }}
    >
      {children}
    </div>
  )
}

// ─── Shared card style ────────────────────────────────────────────────────────
const CARD_STYLE = {
  background: 'rgba(255,255,255,0.09)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1.5px solid rgba(255,182,193,0.3)',
  boxShadow: '0 24px 64px rgba(100,0,40,0.5)',
}

// ─── Back Button ──────────────────────────────────────────────────────────────
function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <motion.button
      onClick={onBack}
      className="fixed top-4 left-4 z-50 rounded-full px-4 py-2 flex items-center gap-1.5 font-body text-sm font-semibold shadow-md"
      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,182,193,0.3)', color: '#fda4af', backdropFilter: 'blur(12px)' }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      &#8592; Back
    </motion.button>
  )
}

// ─── Music Button ─────────────────────────────────────────────────────────────
function MusicButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 flex items-center justify-center font-body text-xs font-bold shadow-lg"
      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,182,193,0.3)', color: '#fda4af', backdropFilter: 'blur(12px)' }}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
    >
      {muted ? 'OFF' : 'ON'}
    </button>
  )
}

// ─── Page 1 — Envelope ────────────────────────────────────────────────────────
function EnvelopePage({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const sparkleId = useRef(0)

  function handleClick() {
    if (opening) return
    setOpening(true)
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        const id = sparkleId.current++
        const cx = window.innerWidth / 2 + (Math.random() - 0.5) * 280
        const cy = window.innerHeight / 2 + (Math.random() - 0.5) * 180
        setSparkles((s) => [...s, { id, x: cx, y: cy }])
        setTimeout(() => setSparkles((s) => s.filter((sp) => sp.id !== id)), 900)
      }, i * 70)
    }
    setTimeout(onOpen, 2100)
  }

  return (
    <PageBg>
      <FloatingHearts count={16} />
      <RosePetals />
      {sparkles.map((s) => <Sparkle key={s.id} x={s.x} y={s.y} />)}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center flex flex-col items-center"
      >
        {/* Stars above title */}
        <div className="flex items-center gap-3 mb-3">
          <StarIcon size={14} color="rgba(255,182,193,0.6)" />
          <StarIcon size={10} color="rgba(255,182,193,0.4)" />
          <StarIcon size={14} color="rgba(255,182,193,0.6)" />
        </div>

        <motion.h1
          className="font-display text-4xl md:text-5xl font-semibold mb-1"
          style={{ color: '#ffd6e0', textShadow: '0 0 30px rgba(255,100,150,0.7)' }}
          animate={{ textShadow: ['0 0 20px rgba(255,100,150,0.5)', '0 0 55px rgba(255,100,150,0.95)', '0 0 20px rgba(255,100,150,0.5)'] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          A Special Message
        </motion.h1>
        <p className="font-display italic mb-12" style={{ color: '#f48fb1', fontSize: '1.25rem' }}>
          for Jill
        </p>

        {/* Envelope */}
        <motion.div
          onClick={handleClick}
          className="relative cursor-pointer select-none"
          style={{ width: 300, height: 210 }}
          whileHover={{ scale: 1.04, filter: 'drop-shadow(0 0 36px rgba(255,100,150,0.8))' }}
          whileTap={{ scale: 0.97 }}
          animate={opening
            ? { scale: [1, 1.06, 1], filter: 'drop-shadow(0 0 60px rgba(255,100,150,1))' }
            : { filter: 'drop-shadow(0 0 20px rgba(255,100,150,0.45))' }
          }
        >
          {/* Body */}
          <div className="absolute inset-0 rounded-2xl" style={{
            background: 'linear-gradient(160deg, #fff8f0 0%, #fde8d8 50%, #fbd0bc 100%)',
            border: '2px solid rgba(255,150,130,0.45)',
            boxShadow: '0 14px 55px rgba(180,40,80,0.4), inset 0 1px 0 rgba(255,255,255,0.7)',
          }} />

          {/* Decorative inner border */}
          <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: '1px dashed rgba(220,90,110,0.28)' }} />

          {/* Corner star accents */}
          <div className="absolute top-3 left-3 opacity-40"><StarIcon size={12} color="#c9184a" /></div>
          <div className="absolute top-3 right-3 opacity-40"><StarIcon size={12} color="#c9184a" /></div>

          {/* Bottom V-fold */}
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: 105,
            background: 'linear-gradient(to top, #f9a8b8 0%, #fbd0d8 100%)',
            clipPath: 'polygon(0 100%, 50% 28%, 100% 100%)',
            borderRadius: '0 0 16px 16px',
          }} />
          {/* Left fold */}
          <div className="absolute top-0 left-0 bottom-0" style={{
            width: 150,
            background: 'linear-gradient(to right, #f9c0cc, #fde0e8)',
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
          }} />
          {/* Right fold */}
          <div className="absolute top-0 right-0 bottom-0" style={{
            width: 150,
            background: 'linear-gradient(to left, #f9c0cc, #fde0e8)',
            clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
          }} />

          {/* Top flap */}
          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{
              height: 115,
              background: 'linear-gradient(170deg, #fde8d0 0%, #f9c0c8 100%)',
              clipPath: 'polygon(0 0, 50% 80%, 100% 0)',
              borderRadius: '16px 16px 0 0',
              transformOrigin: 'top center',
            }}
            animate={opening ? { rotateX: -175, opacity: 0 } : { rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Wax seal */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full z-10"
            style={{
              width: 54, height: 54,
              background: 'radial-gradient(circle, #e63950, #c9184a)',
              boxShadow: '0 3px 18px rgba(201,24,74,0.7)',
            }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <HeartIcon size={26} color="#fff" />
          </motion.div>
        </motion.div>

        {/* Prompt */}
        <motion.p
          className="mt-10 font-display italic text-xl"
          style={{ color: '#ffd6e0' }}
          animate={{ opacity: opening ? 0 : [0.55, 1, 0.55] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          {opening ? '' : 'Tap the envelope to open'}
        </motion.p>
        {opening && (
          <motion.p
            className="mt-10 font-display italic text-xl"
            style={{ color: '#ffd6e0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Opening…
          </motion.p>
        )}
        <p className="mt-3 font-body text-sm" style={{ color: 'rgba(255,182,193,0.7)' }}>
          I have something special for you…
        </p>
      </motion.div>
    </PageBg>
  )
}

// ─── Cat Popup ────────────────────────────────────────────────────────────────
function CatPopup({ src, caption, onDone }: { src: string; caption: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center"
        style={{ maxWidth: 280, ...CARD_STYLE }}
        initial={{ scale: 0.5, rotate: -8 }}
        animate={{ scale: 1, rotate: [-8, 4, -2, 0] }}
        exit={{ scale: 0.4, opacity: 0, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <img src={src} alt="reaction" className="w-full object-cover" style={{ height: 240 }} />
        <div className="px-5 py-3 text-center">
          <p className="font-display italic font-semibold text-base leading-snug" style={{ color: '#ffd6e0' }}>
            {caption}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page 2 — The Question ────────────────────────────────────────────────────
function QuestionPage({ onYes, onBack }: { onYes: () => void; onBack: () => void }) {
  const BTN_W = 112
  const BTN_H = 48
  const MARGIN = 20

  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [blink, setBlink] = useState(false)
  const [taunt, setTaunt] = useState('')
  const [tauntKey, setTauntKey] = useState(0)
  const noBtnRef = useRef<HTMLButtonElement>(null)
  const [catPopup, setCatPopup] = useState<{ src: string; caption: string; key: number } | null>(null)
  const catKeyRef = useRef(0)

  function safeRandom(currentX: number, currentY: number) {
    const maxX = window.innerWidth - BTN_W - MARGIN
    const maxY = window.innerHeight - BTN_H - MARGIN
    let best = { left: MARGIN + Math.random() * maxX, top: MARGIN + Math.random() * maxY }
    let bestDist = 0
    for (let i = 0; i < 10; i++) {
      const cx = MARGIN + Math.random() * maxX
      const cy = MARGIN + Math.random() * maxY
      const dist = (cx - currentX) ** 2 + (cy - currentY) ** 2
      if (dist > bestDist) { bestDist = dist; best = { left: cx, top: cy } }
    }
    return best
  }

  function dodge(e: React.PointerEvent | React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    let fromX = pos?.left ?? window.innerWidth / 2
    let fromY = pos?.top  ?? window.innerHeight / 2
    if (!pos && noBtnRef.current) {
      const r = noBtnRef.current.getBoundingClientRect()
      fromX = r.left; fromY = r.top
    }
    setBlink(true)
    setTimeout(() => { setPos(safeRandom(fromX, fromY)); setBlink(false) }, 120)
    setTaunt(NO_TAUNTS[Math.floor(Math.random() * NO_TAUNTS.length)])
    setTauntKey((k) => k + 1)
    const idx = Math.floor(Math.random() * CAT_IMAGES.length)
    setCatPopup({ src: CAT_IMAGES[idx], caption: CAT_CAPTIONS[idx], key: ++catKeyRef.current })
  }

  return (
    <PageBg>
      <BackButton onBack={onBack} />
      <FloatingHearts count={14} />
      <RosePetals />

      {/* Taunt */}
      <div className="fixed top-5 inset-x-0 flex justify-center z-50 pointer-events-none">
        <AnimatePresence mode="wait">
          {taunt && (
            <motion.p
              key={tauntKey}
              className="px-5 py-1.5 rounded-full font-body font-semibold text-sm italic shadow"
              style={{ ...CARD_STYLE, color: '#ffd6e0' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              {taunt}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Cat popup */}
      <AnimatePresence>
        {catPopup && (
          <CatPopup key={catPopup.key} src={catPopup.src} caption={catPopup.caption} onDone={() => setCatPopup(null)} />
        )}
      </AnimatePresence>

      {/* Floating NO button */}
      {pos && (
        <motion.button
          onPointerDown={dodge}
          onMouseEnter={dodge}
          className="fixed z-40 font-body font-semibold rounded-full border text-sm select-none touch-none"
          style={{
            width: BTN_W, height: BTN_H, left: pos.left, top: pos.top, cursor: 'pointer',
            color: '#fda4af', borderColor: 'rgba(255,182,193,0.4)',
            background: 'rgba(60,0,20,0.6)', backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(100,0,40,0.5)',
          }}
          animate={blink ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          No
        </motion.button>
      )}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center rounded-3xl px-8 py-12 max-w-md w-full relative z-10"
        style={CARD_STYLE}
      >
        {/* Decorative hearts row */}
        <div className="flex justify-center gap-2 mb-5">
          <HeartIcon size={14} color="rgba(255,182,193,0.5)" />
          <HeartIcon size={20} color="#ff4d6d" />
          <HeartIcon size={14} color="rgba(255,182,193,0.5)" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-semibold leading-snug mb-3"
          style={{ color: '#ffd6e0', textShadow: '0 0 24px rgba(255,100,150,0.55)' }}>
          Jill, will you go<br />on a date with me?
        </h1>

        <div className="flex justify-center my-4">
          <div style={{ width: 60, height: 1, background: 'rgba(255,182,193,0.35)' }} />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            onClick={onYes}
            className="font-body font-bold text-white px-10 py-3 rounded-full text-xl"
            style={{
              background: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
              boxShadow: '0 4px 28px rgba(255,77,109,0.75)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes
          </motion.button>

          {!pos && (
            <motion.button
              ref={noBtnRef}
              onPointerDown={dodge}
              onMouseEnter={dodge}
              className="font-body font-semibold rounded-full border text-base select-none touch-none"
              style={{
                width: BTN_W, height: BTN_H, cursor: 'pointer',
                color: '#fda4af', borderColor: 'rgba(255,182,193,0.4)',
                background: 'rgba(255,255,255,0.10)',
              }}
              animate={blink ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              No
            </motion.button>
          )}
        </div>

        <p className="font-body text-xs mt-6 italic" style={{ color: 'rgba(255,182,193,0.5)' }}>
          {pos ? 'The No button is hiding...' : 'Choose wisely'}
        </p>
      </motion.div>
    </PageBg>
  )
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => i)
  const colors = ['#ff4d6d', '#f48fb1', '#ffd6e0', '#ff9a3c', '#a78bfa', '#34d399']
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {pieces.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${Math.random() * 100}%`, top: '-5%', backgroundColor: colors[i % colors.length] }}
          animate={{ y: '110vh', x: (Math.random() - 0.5) * 200, rotate: Math.random() * 720, opacity: [1, 1, 0] }}
          transition={{ duration: 2.5 + Math.random() * 2, delay: Math.random() * 1.5, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

// ─── Page 3 — YES ─────────────────────────────────────────────────────────────
function YesPage({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <PageBg>
      <BackButton onBack={onBack} />
      <FloatingHearts count={22} />
      <RosePetals />
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="text-center rounded-3xl px-8 py-12 max-w-md w-full"
        style={CARD_STYLE}
      >
        <motion.div
          className="flex justify-center mb-5"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <HeartIcon size={64} color="#ff4d6d" />
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#ffd6e0', textShadow: '0 0 32px rgba(255,100,150,0.7)' }}>
          You said YES!
        </h1>

        <div className="flex justify-center gap-2 my-4">
          {[12, 18, 12].map((s, i) => (
            <HeartIcon key={i} size={s} color="rgba(255,182,193,0.5)" />
          ))}
        </div>

        <p className="font-display italic text-xl mb-3" style={{ color: '#fda4af' }}>
          You made me really happy, Jill.
        </p>
        <p className="font-body text-lg mb-8" style={{ color: '#fbc4d0' }}>
          Now let's choose where we're going…
        </p>

        <motion.button
          onClick={onNext}
          className="font-body font-bold text-white px-8 py-3 rounded-full text-lg"
          style={{ background: 'linear-gradient(135deg, #ff4d6d, #c9184a)', boxShadow: '0 4px 28px rgba(255,77,109,0.75)' }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          Choose Our Date
        </motion.button>
      </motion.div>
    </PageBg>
  )
}

// ─── Page 4 — Location ────────────────────────────────────────────────────────
function LocationPage({ onNext, onBack }: { onNext: (loc: DateLocation) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <PageBg>
      <BackButton onBack={onBack} />
      <FloatingHearts count={8} />
      <RosePetals />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl px-3"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-3">
            <StarIcon size={12} color="rgba(255,182,193,0.5)" />
            <StarIcon size={16} color="rgba(255,182,193,0.7)" />
            <StarIcon size={12} color="rgba(255,182,193,0.5)" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2"
            style={{ color: '#ffd6e0', textShadow: '0 0 28px rgba(255,100,150,0.6)' }}>
            Where should we go?
          </h1>
          <p className="font-body" style={{ color: '#fda4af' }}>
            Pick your perfect date spot, Jill
          </p>
          <div className="flex justify-center mt-3">
            <div style={{ width: 48, height: 1, background: 'rgba(255,182,193,0.35)' }} />
          </div>
        </div>

        {/* 2x2 grid — full-image cards */}
        <div className="grid grid-cols-2 gap-4">
          {DATE_LOCATIONS.map((loc) => {
            const isSelected = selected === loc.id
            return (
              <motion.div
                key={loc.id}
                onClick={() => setSelected(loc.id)}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  boxShadow: isSelected
                    ? '0 0 0 2.5px #ff4d6d, 0 12px 40px rgba(201,24,74,0.55)'
                    : '0 8px 32px rgba(80,0,30,0.45)',
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Full image */}
                <div className="relative" style={{ paddingTop: '75%' }}>
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ background: 'linear-gradient(160deg, #5c0f2b, #8b1a3a)' }}
                  />
                  {/* Dark romantic overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(to top, rgba(201,24,74,0.75) 0%, rgba(60,0,20,0.2) 55%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(30,0,15,0.82) 0%, rgba(60,0,20,0.35) 55%, transparent 100%)',
                    }}
                  />

                  {/* Name + description overlaid on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display font-semibold text-sm leading-tight mb-0.5"
                      style={{ color: '#ffd6e0' }}>
                      {loc.name}
                    </h3>
                    <p className="font-body text-xs leading-snug" style={{ color: 'rgba(255,210,220,0.75)' }}>
                      {loc.description}
                    </p>
                  </div>

                  {/* Selected check */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2.5 right-2.5 rounded-full flex items-center justify-center"
                      style={{ width: 26, height: 26, background: '#ff4d6d', boxShadow: '0 2px 10px rgba(201,24,74,0.6)' }}
                    >
                      <HeartIcon size={14} color="#fff" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Next button */}
        <div className="text-center mt-8">
          <motion.button
            onClick={() => {
              const loc = DATE_LOCATIONS.find((l) => l.id === selected)
              if (loc) onNext(loc)
            }}
            disabled={!selected}
            className="font-body font-bold text-white px-10 py-3 rounded-full text-lg disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
              boxShadow: selected ? '0 4px 28px rgba(255,77,109,0.75)' : 'none',
            }}
            whileHover={selected ? { scale: 1.07 } : {}}
            whileTap={selected ? { scale: 0.95 } : {}}
          >
            Next — Choose Date & Time
          </motion.button>
          {!selected && (
            <p className="font-body text-sm mt-2 italic" style={{ color: 'rgba(255,182,193,0.55)' }}>
              Pick a spot first
            </p>
          )}
        </div>
      </motion.div>
    </PageBg>
  )
}

// ─── Page 5 — Date & Time ─────────────────────────────────────────────────────
function DateTimePage({
  location, onConfirm, onBack,
}: {
  location: DateLocation
  onConfirm: (date: string, time: string) => void
  onBack: () => void
}) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const ready = date && time

  const formattedDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const formattedTime = time
    ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : null

  const inputStyle = {
    background: 'rgba(255,255,255,0.12)',
    border: '1.5px solid rgba(255,182,193,0.35)',
    color: '#ffd6e0',
    colorScheme: 'dark' as const,
  }

  return (
    <PageBg>
      <BackButton onBack={onBack} />
      <FloatingHearts count={8} />
      <RosePetals />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl px-8 py-10 max-w-md w-full"
        style={CARD_STYLE}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <HeartIcon size={36} color="#ff4d6d" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mb-2"
            style={{ color: '#ffd6e0', textShadow: '0 0 22px rgba(255,100,150,0.55)' }}>
            Okay, Jill… when are you free?
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-full mt-1"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,182,193,0.28)' }}>
            <span className="font-body text-sm font-semibold" style={{ color: '#fda4af' }}>
              {location.name}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-body font-semibold text-sm block mb-1.5" style={{ color: '#fda4af' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl px-4 py-2.5 font-body outline-none transition-colors"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-sm block mb-1.5" style={{ color: '#fda4af' }}>
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 font-body outline-none transition-colors"
              style={inputStyle}
            />
          </div>
        </div>

        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl p-4 text-center space-y-1.5"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,182,193,0.22)' }}
            >
              <p className="font-body text-sm font-semibold mb-2" style={{ color: '#fda4af' }}>Our date plan</p>
              {[
                { label: 'Where', value: location.name },
                { label: 'When', value: formattedDate },
                { label: 'Time', value: formattedTime },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="font-body text-xs uppercase tracking-wide" style={{ color: 'rgba(255,182,193,0.55)' }}>{label}</span>
                  <span className="font-body text-sm font-semibold" style={{ color: '#ffd6e0' }}>{value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => { if (ready) onConfirm(date, time) }}
          disabled={!ready}
          className="w-full mt-6 font-body font-bold text-white py-3 rounded-full text-lg disabled:opacity-35 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
            boxShadow: ready ? '0 4px 28px rgba(255,77,109,0.75)' : 'none',
          }}
          whileHover={ready ? { scale: 1.04 } : {}}
          whileTap={ready ? { scale: 0.96 } : {}}
        >
          Confirm Our Date
        </motion.button>
      </motion.div>
    </PageBg>
  )
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(targetDate: string, targetTime: string) {
  const getRemaining = useCallback(() => {
    const diff = new Date(`${targetDate}T${targetTime}`).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
      past: false,
    }
  }, [targetDate, targetTime])

  const [remaining, setRemaining] = useState(getRemaining)
  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [getRemaining])
  return remaining
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl w-16 h-16 flex items-center justify-center"
        style={{ background: 'rgba(255,77,109,0.18)', border: '1px solid rgba(255,182,193,0.28)', boxShadow: '0 4px 16px rgba(201,24,74,0.3)' }}>
        <span className="font-display font-bold text-2xl leading-none" style={{ color: '#ffd6e0' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-body text-xs mt-1 uppercase tracking-wide" style={{ color: 'rgba(255,182,193,0.65)' }}>{label}</span>
    </div>
  )
}

// ─── Page 6 — Final ───────────────────────────────────────────────────────────
function FinalPage({ location, date, time, onBack }: { location: DateLocation; date: string; time: string; onBack: () => void }) {
  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const countdown = useCountdown(date, time)

  return (
    <PageBg>
      <BackButton onBack={onBack} />
      <FloatingHearts count={20} />
      <RosePetals />
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 14 }}
        className="rounded-3xl px-6 py-10 max-w-md w-full text-center"
        style={CARD_STYLE}
      >
        <motion.div
          className="flex justify-center mb-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          <HeartIcon size={72} color="#ff4d6d" />
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-2"
          style={{ color: '#ffd6e0', textShadow: '0 0 44px rgba(255,100,150,0.85)' }}>
          It's a Date!
        </h1>

        <div className="flex justify-center gap-2 my-4">
          {[10, 16, 10].map((s, i) => <HeartIcon key={i} size={s} color="rgba(255,182,193,0.45)" />)}
        </div>

        {/* Date plan */}
        <div className="rounded-2xl p-4 mb-5 text-left space-y-3"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,182,193,0.22)' }}>
          <p className="font-body text-sm font-semibold text-center mb-3" style={{ color: '#fda4af' }}>
            Our Little Date Plan
          </p>
          {[
            { label: 'Where', value: location.name },
            { label: 'When', value: formattedDate },
            { label: 'Time', value: formattedTime },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <HeartIcon size={14} color="rgba(255,77,109,0.6)" />
              <div>
                <p className="font-body text-xs uppercase tracking-wide" style={{ color: 'rgba(255,182,193,0.55)' }}>{label}</p>
                <p className="font-body font-semibold text-sm" style={{ color: '#ffd6e0' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="rounded-2xl p-4 mb-5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,182,193,0.22)' }}>
          <p className="font-body text-sm font-semibold mb-3" style={{ color: '#fda4af' }}>
            {countdown.past ? "It's time! See you now!" : 'Counting down to our date…'}
          </p>
          {!countdown.past && (
            <div className="flex justify-center gap-3">
              <CountdownUnit value={countdown.days}    label="days" />
              <CountdownUnit value={countdown.hours}   label="hrs"  />
              <CountdownUnit value={countdown.minutes} label="min"  />
              <CountdownUnit value={countdown.seconds} label="sec"  />
            </div>
          )}
        </div>

        <p className="font-display italic text-lg mb-1" style={{ color: '#fda4af' }}>
          "No backing out now."
        </p>
        <p className="font-display italic text-base" style={{ color: '#f9a8b8' }}>
          See you there, Jill. I'll be waiting for you.
        </p>

        <motion.div
          className="mt-5 flex justify-center gap-2"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          {[14, 20, 14].map((s, i) => <HeartIcon key={i} size={s} color={i === 1 ? '#ff4d6d' : 'rgba(255,182,193,0.5)'} />)}
        </motion.div>
      </motion.div>
    </PageBg>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('envelope')
  const [muted, setMuted] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<DateLocation | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    return () => { audioRef.current?.pause() }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (muted) audioRef.current.pause()
    else audioRef.current.play().catch(() => {})
  }, [muted])

  function handleFirstInteraction() { if (muted) setMuted(false) }

  const pageVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -60 },
  }

  return (
    <div onClick={handleFirstInteraction} onTouchStart={handleFirstInteraction}>
      <MusicButton muted={muted} onToggle={() => setMuted((m) => !m)} />

      <AnimatePresence mode="wait">
        {page === 'envelope' && (
          <motion.div key="envelope" {...pageVariants} transition={{ duration: 0.4 }}>
            <EnvelopePage onOpen={() => setPage('question')} />
          </motion.div>
        )}
        {page === 'question' && (
          <motion.div key="question" {...pageVariants} transition={{ duration: 0.4 }}>
            <QuestionPage onYes={() => setPage('yes')} onBack={() => setPage('envelope')} />
          </motion.div>
        )}
        {page === 'yes' && (
          <motion.div key="yes" {...pageVariants} transition={{ duration: 0.4 }}>
            <YesPage onNext={() => setPage('location')} onBack={() => setPage('question')} />
          </motion.div>
        )}
        {page === 'location' && (
          <motion.div key="location" {...pageVariants} transition={{ duration: 0.4 }}>
            <LocationPage
              onNext={(loc) => { setSelectedLocation(loc); setPage('datetime') }}
              onBack={() => setPage('yes')}
            />
          </motion.div>
        )}
        {page === 'datetime' && selectedLocation && (
          <motion.div key="datetime" {...pageVariants} transition={{ duration: 0.4 }}>
            <DateTimePage
              location={selectedLocation}
              onConfirm={(d, t) => { setSelectedDate(d); setSelectedTime(t); setPage('final') }}
              onBack={() => setPage('location')}
            />
          </motion.div>
        )}
        {page === 'final' && selectedLocation && (
          <motion.div key="final" {...pageVariants} transition={{ duration: 0.4 }}>
            <FinalPage
              location={selectedLocation}
              date={selectedDate}
              time={selectedTime}
              onBack={() => setPage('datetime')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
