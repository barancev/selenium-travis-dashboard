<template>
  <span>
    <i v-if="language === 'java'" class="fab fa-java"></i>
    <i v-if="language === 'python'" class="fab fa-python"></i>
    <i v-if="language === 'ruby'" class="fas fa-gem"></i>
    {{ language }}
  </span>
</template>

<script>
export default {
  name: 'LanguageIcon',
  props: {
    language: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
