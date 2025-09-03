import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useDispatch } from 'react-redux'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CButtonGroup,
  CFormSwitch,
  CFormRange,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAlert,
} from '@coreui/react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import { toLonLat } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'
import VectorSource from 'ol/source/Vector'
import ClusterSource from 'ol/source/Cluster'
import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import Select from 'ol/interaction/Select'
import Draw from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import Overlay from 'ol/Overlay'
import Geolocation from 'ol/Geolocation'
import { click as clickCondition } from 'ol/events/condition'
import { addOverlayVector } from '../features/map/mapSlice'

// Utility styles
const styles = {
  mapWrap: { width: '100%', minHeight: '600px', position: 'relative' },
  mapDiv: { width: '100%', height: '100%' },
  panel: { maxHeight: 300, overflowY: 'auto' },
  popup: {
    background: 'white',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: 4,
    minWidth: 180,
  },
}

// Default styles for layers
const markerStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: '#2c7be5' }),
    stroke: new Stroke({ color: '#ffffff', width: 2 }),
  }),
})

const clusterStyle = (feature) => {
  const size = feature?.get('features')?.length || 1
  return new Style({
    image: new CircleStyle({
      radius: Math.max(10, Math.min(20, 8 + size)),
      fill: new Fill({ color: '#6610f2' }),
      stroke: new Stroke({ color: '#fff', width: 2 }),
    }),
    text: new Text({
      text: size > 1 ? String(size) : '',
      fill: new Fill({ color: '#fff' }),
    }),
  })
}

const sketchStyle = new Style({
  stroke: new Stroke({ color: '#20c997', width: 2 }),
  fill: new Fill({ color: 'rgba(32, 201, 151, 0.2)' }),
  image: new CircleStyle({ radius: 5, fill: new Fill({ color: '#20c997' }) }),
})

const measureStyle = new Style({
  stroke: new Stroke({ color: '#e55353', width: 2, lineDash: [6, 6] }),
  fill: new Fill({ color: 'rgba(229, 83, 83, 0.15)' }),
})

const MapViewer = forwardRef(function MapViewer(
  {
    center = [29, 41],
    zoom = 8,
    markers = [],
    overlays = [],
    clustering = false,
    selectedIds = [],
  },
  ref,
) {
  const dispatch = useDispatch()

  const mapElRef = useRef(null)
  const mapRef = useRef(null)
  const viewRef = useRef(null)

  // Base layers
  const [baseLayers, setBaseLayers] = useState({
    osm: { title: 'OSM', visible: true, opacity: 1 },
    cartoDark: { title: 'Carto Dark', visible: false, opacity: 1 },
    stamenToner: { title: 'Stamen Toner', visible: false, opacity: 1 },
  })

  // Overlays toggles and opacity
  const [overlayVis, setOverlayVis] = useState({ markers: true, sketch: true, wms: false })
  const [overlayOpacity, setOverlayOpacity] = useState({ markers: 1, sketch: 1, wms: 0.7 })

  // OL layers references
  const layersRef = useRef({})
  const sourcesRef = useRef({})

  // Interactions + helpers
  const selectRef = useRef(null)
  const drawRef = useRef(null)
  const modifyRef = useRef(null)
  const measureDrawRef = useRef(null)
  const tooltipOverlayRef = useRef(null)
  const tooltipElRef = useRef(null)
  const popupOverlayRef = useRef(null)
  const popupElRef = useRef(null)
  const geolocRef = useRef(null)
  const geolocFeatureRef = useRef(null)

  // Init map once
  useEffect(() => {
    if (mapRef.current) return

    // View
    const view = new View({
      center: fromLonLat(center),
      zoom,
    })
    viewRef.current = view

    // Base layers
    const osm = new TileLayer({ source: new OSM(), visible: baseLayers.osm.visible, opacity: 1 })
    const carto = new TileLayer({
      source: new XYZ({
        url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap, © CARTO',
        crossOrigin: 'anonymous',
      }),
      visible: baseLayers.cartoDark.visible,
    })
    const stamen = new TileLayer({
      source: new XYZ({ url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', crossOrigin: 'anonymous' }),
      visible: baseLayers.stamenToner.visible,
    })

    layersRef.current.osm = osm
    layersRef.current.cartoDark = carto
    layersRef.current.stamenToner = stamen

    // Marker layer (Vector or Cluster)
    const markerSource = new VectorSource()
    sourcesRef.current.markerSource = markerSource

    const clusterSource = new ClusterSource({ distance: 40, source: markerSource })
    sourcesRef.current.clusterSource = clusterSource

    const markerLayer = new VectorLayer({
      source: clustering ? clusterSource : markerSource,
      style: (f) => (clustering && f.get('features') ? clusterStyle(f) : markerStyle),
      visible: overlayVis.markers,
      opacity: overlayOpacity.markers,
    })
    layersRef.current.markers = markerLayer

    // Sketch layer (for draw/modify)
    const sketchSource = new VectorSource()
    sourcesRef.current.sketchSource = sketchSource
    const sketchLayer = new VectorLayer({ source: sketchSource, style: sketchStyle, visible: overlayVis.sketch })
    layersRef.current.sketch = sketchLayer

    // WMS placeholder (CORS may apply)
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: { LAYERS: 'topp:states', TILED: true },
        crossOrigin: 'anonymous',
      }),
      visible: overlayVis.wms,
      opacity: overlayOpacity.wms,
    })
    layersRef.current.wms = wmsLayer

    // Map
    const map = new Map({
      target: mapElRef.current,
      view,
      layers: [osm, carto, stamen, wmsLayer, markerLayer, sketchLayer],
      controls: [], // Use CoreUI for UI; keep OL controls empty
    })
    mapRef.current = map

    // Selection interaction
    const select = new Select({ condition: clickCondition })
    map.addInteraction(select)
    selectRef.current = select

    // Popup overlay
    const popupEl = document.createElement('div')
    popupEl.style.position = 'absolute'
    popupEl.style.transform = 'translate(-50%, -100%)'
    const inner = document.createElement('div')
    inner.style.cssText = Object.entries(styles.popup)
      .map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`)
      .join(';')
    popupEl.appendChild(inner)
    popupElRef.current = inner
    const popupOverlay = new Overlay({ element: popupEl, offset: [0, -10] })
    map.addOverlay(popupOverlay)
    tooltipOverlayRef.current = popupOverlay

    // Geolocation
    const geoloc = new Geolocation({ tracking: false, projection: view.getProjection() })
    geolocRef.current = geoloc
    geoloc.on('change:position', () => {
      const coords = geoloc.getPosition()
      if (!coords) return
      if (!geolocFeatureRef.current) {
        geolocFeatureRef.current = new Feature({ geometry: new Point(coords) })
        geolocFeatureRef.current.setStyle(
          new Style({ image: new CircleStyle({ radius: 6, fill: new Fill({ color: '#0d6efd' }), stroke: new Stroke({ color: '#fff', width: 2 }) }) }),
        )
        sourcesRef.current.sketchSource.addFeature(geolocFeatureRef.current)
      } else {
        geolocFeatureRef.current.getGeometry().setCoordinates(coords)
      }
    })

    // On select show popup
    select.on('select', (evt) => {
      const feature = evt.selected?.[0]
      const coordinate = evt.mapBrowserEvent?.coordinate
      if (!feature || !coordinate) {
        popupOverlay.setPosition(undefined)
        return
      }
      const props = feature.getProperties()
      const content = document.createElement('div')
      content.innerHTML = `<strong>Feature</strong><br/>` +
        Object.entries(props)
          .filter(([k]) => k !== 'geometry')
          .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
          .join('<br/>')
      popupElRef.current.innerHTML = ''
      popupElRef.current.appendChild(content)
      popupOverlay.setPosition(coordinate)
    })

    return () => {
      map.setTarget(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync base layers visibility/opacity
  useEffect(() => {
    if (!mapRef.current) return
    ;['osm', 'cartoDark', 'stamenToner'].forEach((k) => {
      const layer = layersRef.current[k]
      const conf = baseLayers[k]
      if (layer && conf) {
        layer.setVisible(!!conf.visible)
        layer.setOpacity(conf.opacity ?? 1)
      }
    })
  }, [baseLayers])

  // Sync overlays visibility/opacity
  useEffect(() => {
    if (!mapRef.current) return
    Object.entries(overlayVis).forEach(([k, v]) => layersRef.current[k]?.setVisible(!!v))
    Object.entries(overlayOpacity).forEach(([k, v]) => layersRef.current[k]?.setOpacity(v ?? 1))
  }, [overlayVis, overlayOpacity])

  // Sync center/zoom with animation
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.animate({ center: fromLonLat(center), duration: 300 })
    if (typeof zoom === 'number') view.animate({ zoom, duration: 300 })
  }, [center, zoom])

  // Build/update marker features on change
  useEffect(() => {
    const source = sourcesRef.current.markerSource
    const clusterSource = sourcesRef.current.clusterSource
    if (!source || !layersRef.current.markers) return

    source.clear()
    const feats = (markers || [])
      .filter((m) => Array.isArray(m?.coordinates) || (m.lon != null && m.lat != null) || (m.lonLat && m.lonLat.length === 2))
      .map((m) => {
        const [lon, lat] = m.coordinates || m.lonLat || [m.lon, m.lat]
        const f = new Feature({
          id: m.id,
          ...('properties' in m ? m.properties : {}),
          geometry: new Point(fromLonLat([Number(lon), Number(lat)])),
        })
        return f
      })
    source.addFeatures(feats)
    layersRef.current.markers.setSource(clustering ? clusterSource : source)
  }, [markers, clustering])

  // Sync overlay vectors (array of {id, features})
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    const current = layersRef.current

    const existingIds = new Set(Object.keys(current).filter((k) => k.startsWith('overlay:')))
    const desiredIds = new Set((overlays || []).map((o) => 'overlay:' + o.id))

    // Remove missing overlays
    existingIds.forEach((lid) => {
      if (!desiredIds.has(lid)) {
        const layer = current[lid]
        map.removeLayer(layer)
        delete current[lid]
      }
    })

    // Add/update overlays
    const fmt = new GeoJSON()
    ;(overlays || []).forEach((o) => {
      const lid = 'overlay:' + o.id
      let layer = current[lid]
      if (!layer) {
        layer = new VectorLayer({ source: new VectorSource(), style: sketchStyle, visible: true })
        current[lid] = layer
        map.addLayer(layer)
      }
      const src = layer.getSource()
      src.clear()
      try {
        const feats = fmt.readFeatures({ type: 'FeatureCollection', features: o.features || [] }, {
          dataProjection: 'EPSG:4326',
          featureProjection: viewRef.current.getProjection(),
        })
        src.addFeatures(feats)
      } catch (e) {
        // ignore parse errors
      }
    })
  }, [overlays])

  // Measure helpers
  const startMeasure = (type) => {
    stopMeasure()
    if (!mapRef.current) return
    const map = mapRef.current
    const draw = new Draw({ source: sourcesRef.current.sketchSource, type, style: measureStyle })
    measureDrawRef.current = draw

    // Tooltip element
    const tooltipEl = document.createElement('div')
    tooltipEl.className = 'ol-tooltip ol-tooltip-measure'
    tooltipEl.style.cssText = 'background: #343a40; color: white; padding: 4px 6px; border-radius: 4px;'
    tooltipElRef.current = tooltipEl
    const overlay = new Overlay({ element: tooltipEl, offset: [10, 0], positioning: 'center-left' })
    map.addOverlay(overlay)

    draw.on('drawstart', (evt) => {
      const geom = evt.feature.getGeometry()
      geom.on('change', () => {
        let msg = ''
        if (geom instanceof LineString) {
          const len = Math.round(geom.getLength())
          msg = `${len} m`
        } else if (geom instanceof Polygon) {
          const area = Math.round(geom.getArea())
          msg = `${area} m²`
        }
        tooltipEl.innerText = msg
        const last = geom.getLastCoordinate?.() || geom.getCoordinates()[0]
        overlay.setPosition(last)
      })
    })
    draw.on('drawend', () => {
      // keep result on map; remove overlay
      setTimeout(() => {
        map.removeOverlay(overlay)
      }, 100)
    })

    map.addInteraction(draw)
  }

  const stopMeasure = () => {
    if (!mapRef.current) return
    const map = mapRef.current
    if (measureDrawRef.current) {
      map.removeInteraction(measureDrawRef.current)
      measureDrawRef.current = null
    }
  }

  // Drawing
  const startDraw = (type) => {
    stopMeasure()
    if (!mapRef.current) return
    const map = mapRef.current
    if (drawRef.current) map.removeInteraction(drawRef.current)
    const draw = new Draw({ source: sourcesRef.current.sketchSource, type })
    drawRef.current = draw
    map.addInteraction(draw)
  }
  const stopDraw = () => {
    if (!mapRef.current || !drawRef.current) return
    mapRef.current.removeInteraction(drawRef.current)
    drawRef.current = null
  }

  const toggleModify = (enabled) => {
    if (!mapRef.current) return
    const map = mapRef.current
    if (enabled && !modifyRef.current) {
      const m = new Modify({ source: sourcesRef.current.sketchSource })
      modifyRef.current = m
      map.addInteraction(m)
    } else if (!enabled && modifyRef.current) {
      map.removeInteraction(modifyRef.current)
      modifyRef.current = null
    }
  }

  // File import/export
  const handleImportGeoJSON = async (file) => {
    if (!file) return
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      const fmt = new GeoJSON()
      const feats = fmt.readFeatures(json, {
        dataProjection: 'EPSG:4326',
        featureProjection: viewRef.current.getProjection(),
      })
      // Convert to plain GeoJSON Feature[]
      const featuresPlain = fmt.writeFeaturesObject(feats, {
        dataProjection: 'EPSG:4326',
        featureProjection: viewRef.current.getProjection(),
      }).features

      dispatch(addOverlayVector({ features: featuresPlain }))
    } catch (e) {
      console.error('Import failed', e)
    }
  }

  const handleExportGeoJSON = () => {
    const fmt = new GeoJSON()
    // Markers → Features
    const markerFeats = (sourcesRef.current.markerSource?.getFeatures() || [])
    const sketchFeats = (sourcesRef.current.sketchSource?.getFeatures() || [])
    const all = [...markerFeats, ...sketchFeats]
    const json = fmt.writeFeaturesObject(all, {
      dataProjection: 'EPSG:4326',
      featureProjection: viewRef.current.getProjection(),
    })
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'emir-export.geojson'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Forwarded API
  useImperativeHandle(ref, () => ({
    zoomIn: () => viewRef.current?.animate({ zoom: (viewRef.current.getZoom() || 2) + 1, duration: 200 }),
    zoomOut: () => viewRef.current?.animate({ zoom: (viewRef.current.getZoom() || 2) - 1, duration: 200 }),
    resetView: () => viewRef.current?.animate({ center: fromLonLat([29, 41]), zoom: 8, duration: 300 }),
    fitToAll: () => {
      const map = mapRef.current
      if (!map) return
      const layers = Object.values(layersRef.current)
      let extent
      layers.forEach((lyr) => {
        if (lyr?.getSource?.()?.getFeatures) {
          const feats = lyr.getSource().getFeatures()
          feats.forEach((f) => {
            const e = f.getGeometry()?.getExtent?.()
            if (!e) return
            if (!extent) extent = e.slice()
            else {
              extent[0] = Math.min(extent[0], e[0])
              extent[1] = Math.min(extent[1], e[1])
              extent[2] = Math.max(extent[2], e[2])
              extent[3] = Math.max(extent[3], e[3])
            }
          })
        }
      })
      if (extent) map.getView().fit(extent, { duration: 300, padding: [20, 20, 20, 20] })
    },
    addTempMarker: (lon, lat, props = {}) => {
      const f = new Feature({ geometry: new Point(fromLonLat([lon, lat])), ...props })
      sourcesRef.current.sketchSource?.addFeature(f)
    },
    setLayerVisibility: (id, visible) => {
      layersRef.current[id]?.setVisible(!!visible)
    },
    setLayerOpacity: (id, opacity) => {
      const v = Math.max(0, Math.min(1, Number(opacity)))
      layersRef.current[id]?.setOpacity(v)
    },
  }))

  // UI helpers
  const fileInputRef = useRef(null)

  return (
    <CCard className="mb-3">
      <CCardHeader>Map Tools</CCardHeader>
      <CCardBody>
        <CRow className="gy-2">
          <CCol md={8}>
            <CButtonGroup className="me-2 mb-2">
              <CButton color="primary" onClick={() => viewRef.current?.animate({ zoom: (viewRef.current.getZoom() || 2) + 1, duration: 150 })}>
                Zoom In
              </CButton>
              <CButton color="primary" variant="outline" onClick={() => viewRef.current?.animate({ zoom: (viewRef.current.getZoom() || 2) - 1, duration: 150 })}>
                Zoom Out
              </CButton>
              <CButton color="secondary" onClick={() => viewRef.current?.animate({ center: fromLonLat(center), zoom, duration: 250 })}>
                Reset
              </CButton>
              <CButton color="secondary" variant="outline" onClick={() => ref?.current?.fitToAll?.()}>Fit</CButton>
              <CButton
                color="info"
                onClick={() => {
                  const g = geolocRef.current
                  if (!g) return
                  g.setTracking(true)
                  setTimeout(() => {
                    const pos = g.getPosition()
                    if (pos) viewRef.current?.animate({ center: pos, zoom: 14, duration: 250 })
                    g.setTracking(false)
                  }, 600)
                }}
              >
                Locate
              </CButton>
            </CButtonGroup>

            <CButtonGroup className="me-2 mb-2">
              <CDropdown>
                <CDropdownToggle color="success">Draw</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => startDraw('Point')}>Point</CDropdownItem>
                  <CDropdownItem onClick={() => startDraw('LineString')}>Line</CDropdownItem>
                  <CDropdownItem onClick={() => startDraw('Polygon')}>Polygon</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <CButton color="success" variant="outline" onClick={() => stopDraw()}>
                Stop Draw
              </CButton>
              <CButton color="warning" onClick={() => toggleModify(true)}>
                Modify
              </CButton>
              <CButton color="warning" variant="outline" onClick={() => toggleModify(false)}>
                Stop Modify
              </CButton>
              <CDropdown>
                <CDropdownToggle color="danger">Measure</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => startMeasure('LineString')}>Distance</CDropdownItem>
                  <CDropdownItem onClick={() => startMeasure('Polygon')}>Area</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <CButton color="danger" variant="outline" onClick={() => stopMeasure()}>
                Stop Measure
              </CButton>
              <CButton color="dark" variant="outline" onClick={() => sourcesRef.current.sketchSource?.clear()}>Clear</CButton>
            </CButtonGroup>

            <CButtonGroup className="mb-2">
              <CButton color="secondary" onClick={() => fileInputRef.current?.click()}>Import</CButton>
              <input ref={fileInputRef} type="file" accept="application/geo+json,application/json,.geojson" style={{ display: 'none' }} onChange={(e) => handleImportGeoJSON(e.target.files?.[0])} />
              <CButton color="secondary" variant="outline" onClick={handleExportGeoJSON}>
                Export
              </CButton>
            </CButtonGroup>
          </CCol>

          <CCol md={4}>
            <CCard className="mb-2" style={styles.panel}>
              <CCardHeader>Base Layers</CCardHeader>
              <CCardBody>
                {[
                  ['osm', 'OSM'],
                  ['cartoDark', 'Carto Dark'],
                  ['stamenToner', 'Stamen Toner'],
                ].map(([k, label]) => (
                  <div key={k} className="d-flex align-items-center mb-2">
                    <CFormSwitch
                      id={`bl-${k}`}
                      checked={!!baseLayers[k]?.visible}
                      onChange={(e) =>
                        setBaseLayers((prev) => ({ ...prev, [k]: { ...prev[k], visible: e.target.checked } }))
                      }
                      label={label}
                    />
                    <CFormRange
                      className="ms-2"
                      min={0}
                      max={1}
                      step={0.05}
                      value={baseLayers[k]?.opacity ?? 1}
                      onChange={(e) =>
                        setBaseLayers((prev) => ({ ...prev, [k]: { ...prev[k], opacity: Number(e.target.value) } }))
                      }
                    />
                  </div>
                ))}
              </CCardBody>
            </CCard>

            <CCard style={styles.panel}>
              <CCardHeader>Overlays</CCardHeader>
              <CCardBody>
                {[
                  ['markers', 'Markers'],
                  ['sketch', 'Sketch'],
                  ['wms', 'WMS (demo)'],
                ].map(([k, label]) => (
                  <div key={k} className="d-flex align-items-center mb-2">
                    <CFormSwitch
                      id={`ov-${k}`}
                      checked={!!overlayVis[k]}
                      onChange={(e) => setOverlayVis((p) => ({ ...p, [k]: e.target.checked }))}
                      label={label}
                    />
                    <CFormRange
                      className="ms-2"
                      min={0}
                      max={1}
                      step={0.05}
                      value={overlayOpacity[k] ?? 1}
                      onChange={(e) => setOverlayOpacity((p) => ({ ...p, [k]: Number(e.target.value) }))}
                    />
                  </div>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div style={styles.mapWrap}>
          <div ref={mapElRef} style={styles.mapDiv} />
        </div>

        <CAlert color="light" className="mt-2">
          Tips: Ensure the container has non-zero height; always convert [lon, lat] with fromLonLat; exporting uses EPSG:4326; WMS demo may be subject to CORS.
        </CAlert>
      </CCardBody>
    </CCard>
  )
})

export default MapViewer

