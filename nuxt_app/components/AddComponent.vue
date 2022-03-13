<template>
  <div class="addComponent">
    <v-text-field
      v-model="componentName"
      placeholder="構成要素の名前を入力"
      outlined
    />
    <v-btn
      @click="enterFunc"
    >
      決定
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'AddComponent',
  data () {
    return { componentName: '' }
  },
  methods: {
    enterFunc () {
      this.$emit('addComponent', this.componentName)
      this.componentName = ''
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
