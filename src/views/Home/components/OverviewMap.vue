<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ref, onMounted, watch } from 'vue'
import { useOverviewStore } from '@/stores/overview'
import { useCountyStore } from '@/stores/county'
import statesData from '@/assets/data/map.json'

const useCounty = useCountyStore()

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
const geojsonLayer = ref<L.GeoJSON>()
function init() {
  map.value = L.map('map').setView([23.58, 120.28], 6.5)

  map.value.dragging.disable()
  map.value.doubleClickZoom.disable()
  map.value.scrollWheelZoom.disable()

  geojsonLayer.value = L.geoJson([], { style, onEachFeature }).addTo(map.value)
}

function updateMap(statesData) {
  geojsonLayer.value?.clearLayers()

  geojsonLayer.value?.addData(statesData)
}

const color = ['#B4A073', '#08C0BE', '#E756B8']
function getColor(properties) {
  if (useCounty.currentCounty) {
    return useCounty.currentCounty === properties.COUNTYNAME ? getPresidentData()[0]?.color : '#FFF'
  }
  if (!properties.info) return '#FFF'

  const { Column2, Column3, Column4 } = properties.info

  const data = [
    { value: Column2, color: color[0] },
    { value: Column3, color: color[1] },
    { value: Column4, color: color[2] }
  ].sort((a, b) => b.value - a.value)
  return data[0].color
}

const getPresidentData = () => {
  return useOverview.currentYearPresidentData
    .map((president, index) => {
      return {
        name: president.name,
        voteCount: president.data.map((data) => data.count).reduce((a, b) => a + b, 0),
        color: color[index]
      }
    })
    .sort((a, b) => b.voteCount - a.voteCount)
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties),
    weight: 1,
    opacity: 1,
    color: '#333',
    fillOpacity: 0.7
  }
}

function whenClicked(e) {
  const county = e.sourceTarget.feature.properties.COUNTYNAME
  if (county === '高雄市') useCounty.setCounty(county)
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
