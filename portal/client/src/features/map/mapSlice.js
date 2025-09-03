import { createSlice, nanoid } from '@reduxjs/toolkit'

// Map state slice for EMIR portal
// Coordinates are always stored as [lon, lat] (EPSG:4326)

const initialState = {
  center: [29, 41],
  zoom: 8,
  markers: [], // [{ id, lon, lat, properties? }]
  overlays: [], // [{ id, features: GeoJSON Feature[] }]
  ui: {
    selectedIds: [],
    clustering: false,
  },
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenterZoom(state, action) {
      const { center, zoom } = action.payload || {}
      if (Array.isArray(center) && center.length === 2) state.center = center
      if (typeof zoom === 'number') state.zoom = zoom
    },
    setMarkers(state, action) {
      state.markers = Array.isArray(action.payload) ? action.payload : []
    },
    addMarker: {
      reducer(state, action) {
        state.markers.push(action.payload)
      },
      prepare(marker) {
        return { payload: { id: marker?.id ?? nanoid(), ...marker } }
      },
    },
    updateMarker(state, action) {
      const { id, patch } = action.payload || {}
      const idx = state.markers.findIndex((m) => m.id === id)
      if (idx >= 0) state.markers[idx] = { ...state.markers[idx], ...patch }
    },
    removeMarker(state, action) {
      const id = action.payload
      state.markers = state.markers.filter((m) => m.id !== id)
    },
    clearMarkers(state) {
      state.markers = []
    },
    toggleClustering(state, action) {
      state.ui.clustering = !!action.payload
    },
    addOverlayVector: {
      reducer(state, action) {
        const exists = state.overlays.find((o) => o.id === action.payload.id)
        if (exists) {
          exists.features = action.payload.features || []
        } else {
          state.overlays.push(action.payload)
        }
      },
      prepare({ id, features }) {
        return { payload: { id: id ?? nanoid(), features: features || [] } }
      },
    },
    removeOverlayVector(state, action) {
      const id = action.payload
      state.overlays = state.overlays.filter((o) => o.id !== id)
    },
    setSelected(state, action) {
      state.ui.selectedIds = Array.isArray(action.payload) ? action.payload : []
    },
  },
})

export const {
  setCenterZoom,
  setMarkers,
  addMarker,
  updateMarker,
  removeMarker,
  clearMarkers,
  toggleClustering,
  addOverlayVector,
  removeOverlayVector,
  setSelected,
} = mapSlice.actions

export default mapSlice.reducer

