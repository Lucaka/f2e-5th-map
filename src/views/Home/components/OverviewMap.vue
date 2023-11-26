<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ref, onMounted, watch } from 'vue'
import statesData from '@/assets/data/map.json'
import { useOverviewStore } from '@/stores/overview'

onMounted(() => {
  init()
})

const useOverview = useOverviewStore()
watch(
  () => useOverview.currentYearVoteData,
  (newValue) => {
    const newData = statesData.features.map((data) => {
      const info = newValue.find((value) => value?.Column1 === data.properties.COUNTYNAME)

      return {
        ...data,
        properties: {
          ...data.properties,
          info
        }
      }
    })

    updateMap(newData)
  }
)
const map = ref<L.Map>()
function init() {
  map.value = L.map('map').setView([23.58, 120.28], 6.5)

  map.value.dragging.disable()
  map.value.doubleClickZoom.disable()
  map.value.scrollWheelZoom.disable()

  // L.geoJson(statesData, { style, onEachFeature }).addTo(map)
}

function updateMap(statesData) {
  L.geoJson(statesData, { style, onEachFeature }).addTo(map.value)
}

const color = ['#B4A073', '#08C0BE', '#E756B8']
function getColor(info) {
  if (!info) return '#FFF'

  const { Column2, Column3, Column4 } = info

  const data = [
    { value: Column2, color: color[0] },
    { value: Column3, color: color[1] },
    { value: Column4, color: color[2] }
  ].sort((a, b) => b.value - a.value)
  console.log(data)
  return data[0].color
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.info),
    weight: 1,
    opacity: 1,
    color: '#333',
    fillOpacity: 0.7
  }
}

function whenClicked(e) {
  // e = event
  console.log(e.sourceTarget.feature)
  // You can make your ajax call declaration here
  //$.ajax(...
}

function onEachFeature(feature, layer) {
  layer.on({
    click: whenClicked
  })
}
</script>
<template>
  <div id="map" class="min-w-[400px] min-h-[600px] bg-transparent" />
</template>

<style>
.leaflet-control-zoom,
.leaflet-control {
  display: none;
}
</style>
