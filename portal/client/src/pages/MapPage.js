import React, { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardHeader, CCardBody, CButton, CButtonGroup } from '@coreui/react'
import MapViewer from '../components/mapViewer'
import {
  addMarker,
  clearMarkers,
  toggleClustering,
  addOverlayVector,
} from '../features/map/mapSlice'

const MapPage = () => {
  const dispatch = useDispatch()
  const mapRef = useRef(null)

  const center = useSelector((s) => s.map.center)
  const zoom = useSelector((s) => s.map.zoom)
  const markers = useSelector((s) => s.map.markers)
  const overlays = useSelector((s) => s.map.overlays)
  const clustering = useSelector((s) => s.map.ui.clustering)
  const selectedIds = useSelector((s) => s.map.ui.selectedIds)

  const addAnkara = () => {
    dispatch(
      addMarker({
        lon: 32.8597,
        lat: 39.9334,
        properties: { name: 'Ankara', kind: 'city' },
      }),
    )
    // Focus
    setTimeout(() => mapRef.current?.fitToAll?.(), 0)
  }

  const addExampleOverlay = () => {
    // Add a small GeoJSON polygon (EPSG:4326)
    const features = [
      {
        type: 'Feature',
        properties: { name: 'Sample AOI' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [29.0, 41.0],
              [29.2, 41.0],
              [29.2, 41.2],
              [29.0, 41.2],
              [29.0, 41.0],
            ],
          ],
        },
      },
    ]
    dispatch(addOverlayVector({ features }))
  }

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader>EMIR • Map</CCardHeader>
        <CCardBody>
          <CButtonGroup className="mb-2">
            <CButton color="primary" onClick={addAnkara}>
              Add Ankara
            </CButton>
            <CButton color="secondary" variant="outline" onClick={() => dispatch(clearMarkers())}>
              Clear markers
            </CButton>
            <CButton color="info" onClick={() => dispatch(toggleClustering(!clustering))}>
              {clustering ? 'Disable' : 'Enable'} clustering
            </CButton>
            <CButton color="success" variant="outline" onClick={addExampleOverlay}>
              Add overlay
            </CButton>
            <CButton color="dark" onClick={() => mapRef.current?.resetView?.()}>Reset view</CButton>
          </CButtonGroup>
        </CCardBody>
      </CCard>

      <MapViewer
        ref={mapRef}
        center={center}
        zoom={zoom}
        markers={markers}
        overlays={overlays}
        clustering={clustering}
        selectedIds={selectedIds}
      />
    </>
  )
}

export default MapPage

