<script setup lang="ts">
import * as d3 from 'd3'
import { watch, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    data?: number[]
    width?: number
    height?: number
    customColors?: string[]
  }>(),
  {
    data: () => [50, 50],
    width: 256,
    height: 256,
    customColors: () => ['#4E4376', '#635692']
  }
)

watch(
  () => props.data,
  (newData) => {
    updatePieChart(newData)
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => createPieChart())

function createPieChart() {
  const radius = Math.min(props.width, props.height) / 2

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')
    .attr('transform', 'translate(' + props.width / 2 + ',' + props.height / 2 + ')')

  const pie = d3.pie()
  const arcData = pie(props.data)
  const arc = d3.arc().innerRadius(0).outerRadius(radius)

  svg
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d, i) {
      return props.customColors[i]
    })
}

function updatePieChart(newData: number[]) {
  const radius = Math.min(props.width, props.height) / 2

  const pie = d3.pie()
  const arcData = pie(newData)
  const arc = d3.arc().innerRadius(0).outerRadius(radius)
  const paths = d3.select('#chart').selectAll('path').data(arcData)

  paths.transition().duration(500).attr('d', arc)
}
</script>

<template>
  <div id="chart" />
</template>
