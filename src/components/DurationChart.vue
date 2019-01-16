<template>
  <fieldset>
    <legend>{{ title }}</legend>
    <div id="duration-history"></div>
  </fieldset>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'DurationChart',
  props: {
    label: String,
    title: String,
    data: Array,
    current: Number,
    routeTo: String,
  },
  watch: {
    current() {
      this.repaint()
    }
  },
  methods: {
    repaint() {
      var durationLabel = function (duration) {
        let minutes = Math.floor(duration / 60)
        let seconds = duration % 60
        return (minutes > 0 ? minutes + ' min ' : '') + seconds + ' sec'
      }
      this.data.forEach(item => {
        item.durationLabel = durationLabel(item.duration)
      })
      d3.select('#duration-history').select('svg').remove()
      var colours = {
        failed: 'red', errored: 'red',
        started: 'orange', running: 'orange',
        passed: 'green'
      }
      var tooltip = d3.select('body').append('div').attr('class', 'toolTip')

      var width = this.data.length * 20, height = 100
      var g = d3.select('#duration-history').append('svg').attr('width', width).attr('height', height)
      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
          y = d3.scaleLinear().rangeRound([height, 0])

      x.domain(this.data.map(d => d.id))
      y.domain([0, d3.max(this.data, d => d.duration)])

      g.selectAll('rect')
        .data(this.data)
        .enter().append('rect')
        .attr("class", d => d.id === this.current ? "active" : "")
        .attr('x', d => x(d.id))
        .attr('y', d => y(d.duration))
        .attr('width', 18)
        .attr('height', d => height - y(d.duration))
        .attr('fill', d => colours[d.state])
        .on('mousemove', d => {
          tooltip
            .style('left', d3.event.pageX + 10 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`${this.label} #${d.number}<br/>${d.durationLabel}`);
        })
        .on('mouseout', () => tooltip.style('display', 'none'))
        .on('click', d => {
          tooltip.style('display', 'none')
          this.$router.push(`${this.routeTo}/${d.id}`)
        })
    }
  },
  mounted() {
    this.repaint()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.toolTip {
  position: absolute;
  display: none;
  min-width: 80px;
  height: auto;
  background: none repeat scroll 0 0 #ffffff;
  border: 1px solid #e8e8e8;
  padding: 14px;
  text-align: center;
}

#duration-history rect, #result-history g.job-result rect {
  fill-opacity: 0.3;
  cursor: pointer;
}

#duration-history rect.active, #result-history g.job-result rect.active {
  fill-opacity: 0.6;
}

#duration-history rect:hover, #result-history g.job-result rect:hover {
  fill-opacity: 1;
}
</style>
