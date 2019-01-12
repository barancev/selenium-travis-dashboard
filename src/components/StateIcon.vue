<template>
  <div class="icon">
    <template v-if="target.state === 'created'"><i class="far fa-hourglass fa-fw"></i></template>
    <template v-if="target.state === 'pending'"><i class="far fa-hourglass fa-fw"></i></template>
    <template v-if="target.state === 'received'"><i class="far fa-hourglass fa-fw"></i></template>
    <template v-if="target.state === 'started'"><i class="fas fa-spinner fa-spin fa-fw"></i></template>
    <template v-if="target.state === 'running'"><i class="fas fa-spinner fa-spin fa-fw"></i></template>
    <template v-if="target.state === 'passed'"><i class="fas fa-check fa-fw"></i></template>
    <template v-if="target.state === 'failed'"><i class="fas fa-times fa-fw"></i></template>
    <template v-if="target.state === 'errored'"><i class="fas fa-exclamation fa-fw"></i></template>
    <template v-if="target.state === 'skipped'"><i class="fas fa-minus fa-fw"></i></template>
    <template v-if="target.state === 'canceled'"><i class="fas fa-ban fa-fw"></i></template>
  </div>
</template>

<script>
export default {
  name: 'StateIcon',
  props: {
    target: Object
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
