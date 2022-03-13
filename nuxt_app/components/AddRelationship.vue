<template>
  <div class="addRelationDetail">
    <div class="addRelationtype">
      <v-text-field
        v-model="newRelationName"
        placeholder="Relationの名前を入力"
        outlined
      />
      <div class="addRelationtypeTags">
        <v-checkbox
          v-model="newRelationType"
          :label="'short'"
          value="1"
        />
        <v-checkbox
          v-model="newRelationType"
          :label="'long'"
          value="2"
        />
        <v-checkbox
          v-model="newRelationType"
          :label="'bool'"
          value="3"
        />
        <v-checkbox
          v-model="newRelationType"
          :label="'attribute only'"
          value="4"
        />
      </div>
      <v-btn
        @click="enter_addRelation"
      >
        決定
      </v-btn>
    </div>
    <div class="addRelation">
      <div>
        <v-select
          v-model="componentName1"
          :items="componentsList"
          label="構成要素1"
        />

        <v-select
          v-model="relationName"
          :items="relationsList"
          label="Relation?"
          @change="relationChange"
        />

        <v-select
          v-model="componentName2"
          :items="componentsList"
          label="構成要素2"
        />
      </div>

      <div>
        <v-text-field
          v-if="autoGetRelationType==1"
          v-model="relation_detail_"
          placeholder="完結に入力"
          outlined
        />

        <v-textarea
          v-if="autoGetRelationType==2"
          v-model="relation_detail_"
          placeholder="複数行入力可"
        />

        <div v-if="autoGetRelationType==3">
          <v-checkbox
            v-model="boolRelationship_"
            :label="''+boolRelationship_"
          />
        </div>

        <div
          v-if="autoGetRelationType==0"
        >
          未選択
        </div>
      </div>

      <v-btn
        @click="enter_addRelationDetail"
      >
        決定
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddRelationship',
  props: {
    autoGetRelationType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      componentsList: [], // 構成要素一覧
      relationsList: [], // 関係一覧
      newRelationName: '', // 新しい関係の名前
      newRelationType: 0, // 新しい関係のtype short:1, long:2, bool:3, attribute only:4
      relationName: '', // 登録したいrelationName
      componentName1: '', // 登録したいcomponent from
      componentName2: '', // 登録したいcomponent to
      relation_detail_: '', // 登録したい関係の明細
      boolRelationship_: true // 登録したい関係の明細(bool 型)
    }
  },
  mounted () {
  },
  methods: {
    // 新しい関係を追加
    enter_addRelation () {
      console.log(this.newRelationName, this.newRelationType)
      this.$emit('addRelation', this.newRelationName, Number(this.newRelationType))
      this.newRelationName = ''
    },
    // 新しい関係明細を追加
    enter_addRelationDetail () {
      if (this.autoGetRelationType === 3) {
        this.relation_detail_ = this.boolRelationship_.toString()
        this.boolRelationship_ = true
      }
      this.$emit('addRelationDetail',
        this.componentName1, this.componentName2, this.relationName, this.relation_detail_
      );
      [this.componentName1, this.componentName2, this.relationName, this.relation_detail_] =
      ['', '', '', '']
    },
    // 登録したい関係が変わったとき
    relationChange () {
      this.$emit('getRelationType', this.relationName)
    },
    // 構成要素の更新(プルダウンを更新するため)
    updateComponentsList (_list) {
      this.componentsList.splice(0, this.componentsList.length)
      this.componentsList.push(..._list)
      this.$forceUpdate()
    },
    // 関係の更新(プルダウンを更新するため)
    updateRelationsList (_list) {
      this.relationsList.splice(0, this.relationsList.length)
      this.relationsList.push(..._list)
      this.$forceUpdate()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addRelationtypeTags{
display: flex
}
</style>
