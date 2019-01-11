<template>
  <span>
    <i v-if="status === 'created'" class="fas fa-hourglass"></i>
    <i v-if="status === 'pending'" class="fas fa-hourglass"></i>
    <i v-if="status === 'received'" class="fas fa-hourglass"></i>
    <i v-if="status === 'started'" class="fas fa-spinner fa-spin"></i>
    <i v-if="status === 'running'" class="fas fa-spinner fa-spin"></i>
    <i v-if="status === 'passed'" class="fas fa-check"></i>
    <i v-if="status === 'failed'" class="fas fa-times"></i>
    <i v-if="status === 'skipped'" class="fas fa-minus"></i>
    <i v-if="status === 'canceled'" class="fas fa-ban"></i>
  </span>
</template>

<script>
export default {
  name: 'StateIcon',
  props: {
    status: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.running {
  color: orange;
}

.fa-check {
  color: green;
}

.fa-times {
  color: red;
}
</style>
