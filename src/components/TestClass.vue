<template>
  <span class="test-class">{{ abbreviatedName }}</span>
</template>

<script>
export default {
  name: 'TestClass',
  props: {
    name: String,
  },
  computed: {
    abbreviatedName: function() {
      var parts = this.name.split('.')
      var lastPart = parts.pop()
      return parts.map(p => p[0]).join('.') + '.' + lastPart
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.test-class {
  padding-right: 0px;
}
</style>
