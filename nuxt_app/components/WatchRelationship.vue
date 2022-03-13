<template>
  <div class="WatchRelationship">
    <div>
      <v-row no-gutters>
        <v-select
          v-model="componentName1"
          :items="componentsList"
          label="選択してください"
          @change="componentChanged"
        />

        <v-btn
          @click="exchange"
        >
          →交換→
        </v-btn>

        <v-select
          v-model="componentName2"
          :items="componentsList"
          label="選択してください"
          @change="componentChanged"
        />
      </v-row>
    </div>

    <div>
      <v-card
        class="text-left"
        max-width="800"
      >
        <v-list-item
          v-for="(value, index) in relationsDetailList"
          :key="index"
          two-line
        >
          <v-list-item-content>
            <v-list-item-title>{{ value[0] }}</v-list-item-title>
            <v-list-item-subtitle>{{ value[1] }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WatchRelationship',
  props: {
  },
  data () {
    return {
      componentsList: [], // 構成リスト
      relationsDetailList: [], // 関係明細リスト
      componentName1: '', // 構成 from
      componentName2: '' // 構成 to
    }
  },
  methods: {
    // 左右反転
    exchange () {
      [this.componentName1, this.componentName2] =
      [this.componentName2, this.componentName1]
      this.componentChanged()
    },
    // 強制的に代入
    componentForceChange (componentName1, componentName2) {
      this.componentName1 = componentName1
      this.componentName2 = componentName2
      this.componentChanged()
    },
    // 左右の構成要素が変わったときに、関係明細リストを更新する
    componentChanged () {
      // eslint-disable-next-line no-empty
      if (this.componentName1 === '' || this.componentName2 === '') {
      } else {
        this.$emit('changeRelationDetailList', this.componentName1, this.componentName2)
      }
    },
    // 構成要素に追加が入ったときに、構成リストを更新してリアクティブに反映させる
    updateComponentsList (_list) {
      this.componentsList.splice(0, this.componentsList.length)
      this.componentsList.push(..._list)
      this.$forceUpdate()
    },
    // 関係明細リストに追加が入ったときに、構成リストを更新してリアクティブに反映させる
    updateRelationsDetailList (_list) {
      this.relationsDetailList.splice(0, this.relationsDetailList.length)
      this.relationsDetailList.push(..._list)
      this.$forceUpdate()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
