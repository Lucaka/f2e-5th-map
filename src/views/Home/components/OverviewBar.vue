<script setup lang="ts">
import { onMounted } from 'vue'
import { useOverviewStore } from '@/stores/overview'
import * as d3 from 'd3'
import { watch } from 'vue'
const useOverview = useOverviewStore()

onMounted(() => createBarChart([]))

watch(
  () => useOverview.currentYearVoteData,
  (newValue) => {
    if (newValue) updateBarChart(newValue)
  }
)

function createBarChart(data) {
  const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 1500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // Parse the Data

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = ['Column2', 'Column3', 'Column4']

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map((d) => d.Column1)

  // Add X axis
  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2])
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .style('color', '#FFF')

  // Add Y axis
  const maxNumber = Math.max(...data.map((d) => Math.max(d.Column2, d.Column3, d.Column4)))
  const y = d3.scaleLinear().domain([0, maxNumber * 1.1]).range([height, 0])
  svg.append('g').call(d3.axisLeft(y)).style('color', '#FFF')

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05])

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal().domain(subgroups).range(['#B4A073', '#08C0BE', '#E756B8'])

  // Show the bars
  svg
    .append('g')
    .selectAll('g')
    // Enter in data = loop group per group
    .data(data)
    .join('g')
    .attr('transform', (d) => `translate(${x(d.Column1) * 1.2}, 0)`)
    .selectAll('rect')
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] }
      })
    })
    .join('rect')
    .attr('x', (d) => xSubgroup(d.key))
    .attr('y', (d) => y(d.value))
    .attr('width', xSubgroup.bandwidth())
    .attr('height', (d) => height - y(d.value))
    .attr('fill', (d) => color(d.key))
}

function updateBarChart(newData) {
  d3.select('#my_dataviz').select('svg').remove()
  createBarChart(newData)
}
</script>

<template>
  <div id="my_dataviz"></div>
</template>
