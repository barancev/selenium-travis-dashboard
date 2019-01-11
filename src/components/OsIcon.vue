<template>
  <div class="icon">
    <i v-if="os === 'linux'" class="fab fa-linux"></i>
    <i v-if="os === 'osx'" class="fab fa-apple"></i>
    <i v-if="os === 'windows'" class="fab fa-windows"></i>
    {{ os }}
  </div>
</template>

<script>
export default {
  name: 'OsIcon',
  props: {
    os: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
