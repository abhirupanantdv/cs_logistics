//DamageAnnotation.jsx
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'

import {
  Stage,
  Layer,
  Image,
  Circle,
  Text,
} from 'react-konva'

import useImage from 'use-image'

const IMAGE_URL =
  '/files/container-damage-template.png'

const DamageAnnotation = forwardRef(
  ({ onChange, onReady }, ref) => {
    console.log(
  'DamageAnnotation Rendering'
)
    const [image] = useImage(
      IMAGE_URL
    )
useEffect(() => {
  
  console.log('Registering DamageAnnotation API')

  if (!onReady) return

  onReady({
    exportImage() {
      console.log('exportImage invoked')

      if (!stageRef.current) {
        console.log('stageRef missing')
        return null
      }

      return stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
      })
    },
  })
}, [onReady])

useEffect(() => {
  console.log(
    'DamageAnnotation Mounted'
  )
}, [])

    useImperativeHandle(
  ref,
  () => ({
    exportImage() {
      console.log('exportImage called')

      if (!stageRef.current) {
        return null
      }

      return stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
      })
    },
  }),
  []
)

    const handleClick = (e) => {
      const clickedOnMarker =
        e.target.name() ===
        'damage-marker'

      if (clickedOnMarker)
        return

      const stage =
        e.target.getStage()

      const pointer =
        stage.getPointerPosition()

      const newMarker = {
        id: Date.now(),
        x: pointer.x,
        y: pointer.y,
      }

      const updatedMarkers =
        [
          ...markers,
          newMarker,
        ]

      setMarkers(
        updatedMarkers
      )

      onChange?.(
        updatedMarkers
      )
    }

    const removeMarker = (
      id
    ) => {
      const updatedMarkers =
        markers.filter(
          (marker) =>
            marker.id !== id
        )

      setMarkers(
        updatedMarkers
      )

      onChange?.(
        updatedMarkers
      )
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h4 className="font-medium text-slate-800">
            Container Damage
            Diagram
          </h4>
        </div>

        <div className="overflow-auto p-4">
          <Stage
            width={900}
            height={500}
            ref={stageRef}
            onClick={
              handleClick
            }
          >
            <Layer>
              {image && (
                <Image
                  image={image}
                  width={900}
                  height={500}
                />
              )}

              {markers.map(
                (
                  marker,
                  index
                ) => (
                  <React.Fragment
                    key={
                      marker.id
                    }
                  >
                    <Circle
                      x={
                        marker.x
                      }
                      y={
                        marker.y
                      }
                      radius={8}
                      fill="red"
                      stroke="white"
                      strokeWidth={
                        2
                      }
                      name="damage-marker"
                      onClick={() =>
                        removeMarker(
                          marker.id
                        )
                      }
                    />

                    <Text
                      text={`${index + 1}`}
                      x={
                        marker.x +
                        12
                      }
                      y={
                        marker.y -
                        12
                      }
                      fontSize={
                        16
                      }
                      fontStyle="bold"
                      fill="#111827"
                    />
                  </React.Fragment>
                )
              )}
            </Layer>
          </Stage>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          Total Damage
          Points:
          <strong className="ml-2">
            {
              markers.length
            }
          </strong>
        </div>
      </div>
    )
  }
)

DamageAnnotation.displayName =
  'DamageAnnotation'

export default DamageAnnotation