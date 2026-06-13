import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react"

export interface ImageGalleryHandle {
  goTo: (index: number) => void
  next: () => void
  prev: () => void
}

const images = [
  {
    title: "Valentina Ríos",
    url: "https://images.unsplash.com/photo-1630939687530-241d630735df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  },
  {
    title: "Carlos Mendoza",
    url: "https://images.unsplash.com/photo-1716471453667-94383b1e4859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  },
  {
    title: "Diego Farfán",
    url: "https://images.unsplash.com/photo-1603764377193-75b991876878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  },
]

export const ImageGallery = forwardRef<ImageGalleryHandle, { onActiveChange?: (index: number) => void }>(function ImageGallery({ onActiveChange }, ref) {
  const [opened, setOpened] = useState(0)
  const [inPlace, setInPlace] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [gsapReady, setGsapReady] = useState(false)
  const autoplayTimer = useRef<number | null>(null)
  const isManualPause = useRef(false)

  useImperativeHandle(ref, () => ({
    goTo(index: number) {
      if (!disabled) {
        isManualPause.current = true
        setOpened(index)
      }
    },
    next() {
      if (!disabled) {
        isManualPause.current = true
        setOpened((c) => (c + 1) % images.length)
      }
    },
    prev() {
      if (!disabled) {
        isManualPause.current = true
        setOpened((c) => (c - 1 + images.length) % images.length)
      }
    },
  }), [disabled])

  useEffect(() => {
    const loadScripts = () => {
      if ((window as any).gsap && (window as any).MotionPathPlugin) {
        ;(window as any).gsap.registerPlugin((window as any).MotionPathPlugin)
        setGsapReady(true)
        return
      }

      const gsapScript = document.createElement("script")
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
      gsapScript.onload = () => {
        const motionPathScript = document.createElement("script")
        motionPathScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"
        motionPathScript.onload = () => {
          if ((window as any).gsap && (window as any).MotionPathPlugin) {
            ;(window as any).gsap.registerPlugin((window as any).MotionPathPlugin)
            setGsapReady(true)
          }
        }
        document.body.appendChild(motionPathScript)
      }
      document.body.appendChild(gsapScript)
    }

    loadScripts()
  }, [])

  const onClick = (index: number) => {
    if (!disabled) {
      setOpened(index)
      isManualPause.current = true
    }
  }

  const onInPlace = (index: number) => {
    setInPlace(index)
    onActiveChange?.(index)
  }

  const next = useCallback(() => {
    isManualPause.current = true
    setOpened((currentOpened) => {
      let nextIndex = currentOpened + 1
      if (nextIndex >= images.length) nextIndex = 0
      return nextIndex
    })
  }, [])

  const prev = useCallback(() => {
    isManualPause.current = true
    setOpened((currentOpened) => {
      let prevIndex = currentOpened - 1
      if (prevIndex < 0) prevIndex = images.length - 1
      return prevIndex
    })
  }, [])

  useEffect(() => setDisabled(true), [opened])
  useEffect(() => setDisabled(false), [inPlace])

  useEffect(() => {
    if (!gsapReady) return

    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current)
    }

    const delay = isManualPause.current ? 30000 : 5000
    isManualPause.current = false

    autoplayTimer.current = window.setInterval(next, delay)

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current)
      }
    }
  }, [opened, gsapReady, next])

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full max-w-[500px] h-[320px] overflow-hidden rounded-[20px]">
        {gsapReady &&
          images.map((image, i) => (
            <div
              key={image.url}
              className="absolute left-0 top-0 h-full w-full"
              style={{ zIndex: inPlace === i ? i : images.length + 1 }}
            >
              <GalleryImage
                total={images.length}
                id={i}
                url={image.url}
                title={image.title}
                open={opened === i}
                inPlace={inPlace === i}
                onInPlace={onInPlace}
              />
            </div>
          ))}
        <div className="absolute left-0 top-0 z-[100] h-full w-full pointer-events-none">
          <Tabs images={images} onSelect={onClick} />
        </div>
      </div>

      <button
        className="absolute left-2 top-1/2 z-[101] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-white/95 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] outline-none transition-all duration-300 ease-out hover:scale-110 hover:bg-white hover:border-white/40 hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] active:scale-95 focus-visible:ring-4 focus-visible:ring-white/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        onClick={prev}
        disabled={disabled}
        aria-label="Anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="absolute right-2 top-1/2 z-[101] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-white/95 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] outline-none transition-all duration-300 ease-out hover:scale-110 hover:bg-white hover:border-white/40 hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] active:scale-95 focus-visible:ring-4 focus-visible:ring-white/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        onClick={next}
        disabled={disabled}
        aria-label="Siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
})

interface GalleryImageProps {
  url: string
  title: string
  open: boolean
  inPlace: boolean
  id: number
  onInPlace: (id: number) => void
  total: number
}

function GalleryImage({ url, title, open, inPlace, id, onInPlace, total }: GalleryImageProps) {
  const [firstLoad, setLoaded] = useState(true)
  const clip = useRef<SVGCircleElement>(null)

  const gap = 10
  const circleRadius = 7
  const defaults = { transformOrigin: "center center" }
  const duration = 0.4
  const width = 600
  const height = 400
  const scale = 700

  const bigSize = circleRadius * scale
  const overlap = 0

  const getPosSmall = () => ({
    cx: width / 2 - (total * (circleRadius * 2 + gap) - gap) / 2 + id * (circleRadius * 2 + gap),
    cy: height - 30,
    r: circleRadius,
  })
  const getPosSmallAbove = () => ({
    cx: width / 2 - (total * (circleRadius * 2 + gap) - gap) / 2 + id * (circleRadius * 2 + gap),
    cy: height / 2,
    r: circleRadius * 2,
  })
  const getPosCenter = () => ({ cx: width / 2, cy: height / 2, r: circleRadius * 7 })
  const getPosEnd = () => ({ cx: width / 2 - bigSize + overlap, cy: height / 2, r: bigSize })
  const getPosStart = () => ({ cx: width / 2 + bigSize - overlap, cy: height / 2, r: bigSize })

  useEffect(() => {
    const gsap = (window as any).gsap
    if (!gsap) return

    setLoaded(false)
    if (clip.current) {
      const flipDuration = firstLoad ? 0 : duration
      const upDuration = firstLoad ? 0 : 0.2
      const bounceDuration = firstLoad ? 0.01 : 1
      const delay = firstLoad ? 0 : flipDuration + upDuration

      if (open) {
        gsap
          .timeline()
          .set(clip.current, { ...defaults, ...getPosSmall() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            duration: upDuration,
            ease: "power3.inOut",
          })
          .to(clip.current, {
            ...defaults,
            ...getPosEnd(),
            duration: flipDuration,
            ease: "power4.in",
            onComplete: () => onInPlace(id),
          })
      } else {
        gsap
          .timeline({ overwrite: true })
          .set(clip.current, { ...defaults, ...getPosStart() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            delay: delay,
            duration: flipDuration,
            ease: "power4.out",
          })
          .to(clip.current, {
            ...defaults,
            motionPath: {
              path: [getPosSmallAbove(), getPosSmall()],
              curviness: 1,
            },
            duration: bounceDuration,
            ease: "bounce.out",
          })
      }
    }
  }, [open])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <clipPath id={`${id}_circleClip`}>
          <circle className="clip" cx="0" cy="0" r={circleRadius} ref={clip}></circle>
        </clipPath>
        <clipPath id={`${id}_squareClip`}>
          <rect className="clip" width={width} height={height}></rect>
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}${inPlace ? "_squareClip" : "_circleClip"})`}>
        <image width={width} height={height} href={url} className="pointer-events-none"></image>
      </g>
    </svg>
  )
}

interface TabsProps {
  images: { title: string; url: string }[]
  onSelect: (index: number) => void
}

function Tabs({ images, onSelect }: TabsProps) {
  const gap = 10
  const circleRadius = 7
  const width = 600
  const height = 400

  const getPosX = (i: number) =>
    width / 2 - (images.length * (circleRadius * 2 + gap) - gap) / 2 + i * (circleRadius * 2 + gap)
  const getPosY = () => height - 30

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      {images.map((image, i) => (
        <g key={image.url} className="pointer-events-auto">
          <defs>
            <clipPath id={`tab_${i}_clip`}>
              <circle cx={getPosX(i)} cy={getPosY()} r={circleRadius} />
            </clipPath>
          </defs>
          <image
            x={getPosX(i) - circleRadius}
            y={getPosY() - circleRadius}
            width={circleRadius * 2}
            height={circleRadius * 2}
            href={image.url}
            clipPath={`url(#tab_${i}_clip)`}
            className="pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle
            onClick={() => onSelect(i)}
            className="cursor-pointer fill-white/0 stroke-white/70 hover:stroke-white/100 transition-all"
            strokeWidth="2"
            cx={getPosX(i)}
            cy={getPosY()}
            r={circleRadius + 2}
          />
        </g>
      ))}
    </svg>
  )
}
