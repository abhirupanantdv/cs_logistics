 import { useEffect, useRef, useState } from 'react'
import {
  Download,
  RotateCcw,
  Undo2,
} from 'lucide-react'

const TEMPLATE_URL =
  '/files/container-damage-template.png'

const DAMAGE_TYPES = [
  {
    key: 'cut',
    label: 'Cut',
    code: 'C',
    color: '#dc2626',
  },
  {
    key: 'hole',
    label: 'Hole',
    code: 'H',
    color: '#7c3aed',
  },
  {
    key: 'dent',
    label: 'Dent',
    code: 'D',
    color: '#d97706',
  },
  {
    key: 'bruised',
    label: 'Bruised',
    code: 'BR',
    color: '#0891b2',
  },
  {
    key: 'broken',
    label: 'Broken',
    code: 'BK',
    color: '#be123c',
  },
  {
    key: 'missing',
    label: 'Missing',
    code: 'M',
    color: '#475569',
  },
  {
    key: 'bent',
    label: 'Bent',
    code: 'BT',
    color: '#16a34a',
  },
]

const MARKER_RADIUS = 15

export default function DamageAnnotation({
  onChange,
  onReady,
}) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const markersRef = useRef([])
  const onReadyRef = useRef(onReady)
  const [markers, setMarkers] =
    useState([])
  const [activeType, setActiveType] =
    useState(DAMAGE_TYPES[0])
  const [isReady, setIsReady] =
    useState(false)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  const drawCanvas = (
    markerList = markersRef.current
  ) => {
    const canvas = canvasRef.current
    const image = imageRef.current

    if (!canvas || !image) return

    const context =
      canvas.getContext('2d')

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    )
    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    )

    markerList.forEach(
      (marker, index) => {
        context.save()
        context.beginPath()
        context.arc(
          marker.x,
          marker.y,
          MARKER_RADIUS,
          0,
          Math.PI * 2
        )
        context.fillStyle =
          marker.color
        context.fill()
        context.lineWidth = 3
        context.strokeStyle = '#ffffff'
        context.stroke()

        context.font =
          marker.code.length > 1
            ? '700 10px Arial'
            : '700 13px Arial'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = '#ffffff'
        context.fillText(
          marker.code,
          marker.x,
          marker.y + 1
        )

        context.font =
          '700 12px Arial'
        context.fillStyle = '#0f172a'
        context.strokeStyle =
          '#ffffff'
        context.lineWidth = 4
        const countLabel = String(
          index + 1
        )
        context.strokeText(
          countLabel,
          marker.x +
            MARKER_RADIUS +
            9,
          marker.y -
            MARKER_RADIUS -
            1
        )
        context.fillText(
          countLabel,
          marker.x +
            MARKER_RADIUS +
            9,
          marker.y -
            MARKER_RADIUS -
            1
        )
        context.restore()
      }
    )
  }

  const syncMarkers = (
    nextMarkers
  ) => {
    markersRef.current = nextMarkers
    setMarkers(nextMarkers)
    drawCanvas(nextMarkers)
    onChange?.(nextMarkers)
  }

  useEffect(() => {
    let objectUrl = ''

    const loadTemplate =
      async () => {
        try {
          const response =
            await fetch(TEMPLATE_URL)
          const blob =
            await response.blob()
          objectUrl =
            URL.createObjectURL(blob)

          const image = new Image()

          image.onload = () => {
            const canvas =
              canvasRef.current

            if (!canvas) return

            canvas.width = image.width
            canvas.height = image.height
            imageRef.current = image
            setIsReady(true)
            drawCanvas([])

            onReadyRef.current?.({
              exportImage: () =>
                canvasRef.current?.toDataURL(
                  'image/png'
                ) || null,
            })
          }

          image.src = objectUrl
        } catch (error) {
          console.error(
            'Failed to load damage template image:',
            error
          )
        }
      }

    loadTemplate()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(
          objectUrl
        )
      }
    }
  }, [])

  useEffect(() => {
    drawCanvas(markers)
  }, [markers])

  const getCanvasCoordinates = (
    event
  ) => {
    const canvas = canvasRef.current
    if (!canvas) {
      return { x: 0, y: 0 }
    }

    const rect =
      canvas.getBoundingClientRect()
    const point =
      event.touches?.[0] ||
      event.changedTouches?.[0] ||
      event
    const scaleX =
      canvas.width / rect.width
    const scaleY =
      canvas.height / rect.height

    return {
      x:
        (point.clientX -
          rect.left) *
        scaleX,
      y:
        (point.clientY -
          rect.top) *
        scaleY,
    }
  }

  const placeMarker = (event) => {
    if (!isReady) return

    event.preventDefault()

    const { x, y } =
      getCanvasCoordinates(event)

    const nextMarkers = [
      ...markersRef.current,
      {
        id:
          window.crypto?.randomUUID?.() ||
          `${Date.now()}-${markersRef.current.length}`,
        x,
        y,
        type: activeType.key,
        label: activeType.label,
        code: activeType.code,
        color: activeType.color,
      },
    ]

    syncMarkers(nextMarkers)
  }

  const undoLastMarker = () => {
    syncMarkers(
      markersRef.current.slice(0, -1)
    )
  }

  const clearMarkers = () => {
    syncMarkers([])
  }

  const downloadAnnotation = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link =
      document.createElement('a')
    link.href = canvas.toDataURL(
      'image/png'
    )
    link.download =
      'container-damage-annotation.png'
    link.click()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
          "
        >
          <div
            className="
              border-b
              border-slate-200
              bg-slate-50
              px-3
              py-2.5
            "
          >
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Damage Types
            </h4>
          </div>

        <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-1">
          {DAMAGE_TYPES.map((type) => {
            const isActive =
              activeType.key ===
              type.key

            return (
              <button
                key={type.key}
                type="button"
                onClick={() =>
                  setActiveType(type)
                }
                className={`
                  flex
                  min-h-10
                  items-center
                  gap-3
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-left
                  text-xs
                  font-medium
                  transition
                  ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    backgroundColor:
                      type.color,
                  }}
                >
                  {type.code}
                </span>

                <span className="truncate">
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="border-t border-slate-200 p-3">
          <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            <span className="font-semibold text-slate-900">
              {markers.length}
            </span>{' '}
            damage mark
            {markers.length === 1
              ? ''
              : 's'}
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={undoLastMarker}
              disabled={!markers.length}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Undo2 size={16} />
              Undo
            </button>

            <button
              type="button"
              onClick={clearMarkers}
              disabled={!markers.length}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Clear
            </button>

            <button
              type="button"
              onClick={downloadAnnotation}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <canvas
          ref={canvasRef}
          onClick={placeMarker}
          onTouchStart={placeMarker}
          className="
            mx-auto
            block
            h-auto
            max-w-full
            touch-none
            rounded-lg
            border
            border-slate-300
            bg-white
            shadow-sm
            cursor-crosshair
          "
        />
      </div>
    </div>
  )
}
