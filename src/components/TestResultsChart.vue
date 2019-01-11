<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <span class="close-button" @click="$emit('close')">&times;</span>
          <div class="modal-header">
            <h3>Test Results History</h3>
          </div>

          <div class="modal-body">
            <div class="metadata">
              <os-icon :os="current.os"></os-icon>
              <language-icon :language="current.language"></language-icon>
              <environment :env="current.env"></environment>
              <div><i class="fas fa-tasks"></i><test-class :name="testcase.testclass"></test-class>.{{ testcase.testcase }}</div>
            </div>
            <div id="test-result-history"></div>
          </div>
          <div class="exception">{{ testcase.stacktrace }}</div>

          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TestClass from '../components/TestClass.vue'
import OsIcon from '../components/OsIcon.vue'
import LanguageIcon from '../components/LanguageIcon.vue'
import Environment from '../components/Environment.vue'

import * as d3 from 'd3'

export default {
  name: 'TestResultsChart',
  props: {
    testcase: Object,
    data: Array,
    current: Object,
  },
  data: function() {
    return { exception: null }
  },
  watch: {
    data(old_value, new_value) {
      this.repaint()
    },
    current(old_value, new_value) {
      this.repaint()
    },
  },
  components: {
    TestClass, OsIcon, LanguageIcon, Environment
  },
  methods: {
    repaint() {
      d3.select('#test-result-history').select('svg').remove()
      var colours = { failed: 'red', passed: 'green' }

      var width = this.data.length * 20, height = 20
      var g = d3.select('#test-result-history').append('svg').attr('width', width).attr('height', height)
      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
          y = d3.scaleLinear().rangeRound([height, 0])

      x.domain(this.data.map(d => d.job_id))
      y.domain([0, d3.max(this.data, d => 20)])

      g.selectAll('rect')
        .data(this.data)
        .enter().append('rect')
        .attr("class", d => d.job_id === this.current.id ? "active" : "")
        .attr('x', d => x(d.job_id))
        .attr('y', d => 0)
        .attr('width', 18)
        .attr('height', d => 20)
        .attr('fill', d => colours[d.result])
        .on('click', d => {
          this.exception = d.exception
          this.$router.push(`/job/${d.job_id}`)
        })
    }
  },
  mounted() {
    this.repaint()
  },
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

.metadata {
  padding: 5px;
  margin-top: 10px;
  border: 1px solid #e0e0e0;
}

#test-result-history {
  margin: 10px 0px;
}

#test-result-history rect {
  fill-opacity: 0.3;
  cursor: pointer;
}

#test-result-history rect.active {
  fill-opacity: 0.6;
}

#test-result-history rect:hover {
  fill-opacity: 1;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  margin: 0px auto;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 40px;
  font-weight: bold;
  line-height: 0.6;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.exception {
  white-space: pre;
  max-height: 800px;
  overflow: scroll;
}
</style>
