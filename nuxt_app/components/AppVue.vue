<template>
  <div class="app-vue">
    <v-btn @click="debugFunc1">
      デバッグ用 例作成
    </v-btn>
    <v-btn @click="debugFunc2">
      デバッグ用 部屋作成
    </v-btn>
    <hr>
    <h2>ルーム変更</h2>
    <div>
      <v-text-field
        v-model="roomId"
        placeholder="room id"
        outlined
      />
      <v-btn
        @click="reload(roomId)"
      >
        ルーム変更
      </v-btn>
    </div>
    <hr>
    <div v-if="weiting">
      Weiting...
    </div>
    <h2>構成要素追加</h2>
    <div>一覧: {{ Object.keys(componentsMap).join(', ') }}</div>
    <AddComponent
      ref="ref_AddComponent"
      @addComponent="addComponent"
    />
    <h2>関係性追加</h2>
    <div>一覧: {{ Object.keys(relationsMap).join(', ') }}</div>
    <AddRelationship
      ref="ref_AddRelationship"
      :auto-get-relation-type="relationType"
      @addRelation="addRelation"
      @addRelationDetail="addRelationDetail"
      @getRelationType="getRelationType"
    />
    <h2>関係性確認</h2>
    <WatchRelationship
      ref="ref_WatchRelationship"
      @changeRelationDetailList="changeRelationDetailList"
    />
  </div>
</template>

<script>
import AddComponent from './AddComponent.vue'
import AddRelationship from './AddRelationship.vue'
import WatchRelationship from './WatchRelationship.vue'

// エラー出力用
function consoleError (error) {
  console.log(error)
}

export default {
  name: 'AppVue',
  components: {
    AddComponent,
    AddRelationship,
    WatchRelationship
  },
  data () {
    return {
      weiting: false,
      roomId: 10000,
      relationType: 0,
      componentsMap: new Map(),
      relationsMap: new Map(),
      relationDetailMap: new Map()
    }
  },
  mounted () {
    this.reload(10000)
  },
  methods: {
    // Componentを追加する
    addComponent (_component) {
      if (_component === '') {
        console.log('入力されていません')
      } else if (this.componentsMap.has(_component)) {
        console.log('重複しております')
      } else {
        this.weiting = true
        this.postComponentToDB(_component).then(
          (response) => {
            this.$set(this.componentsMap, _component, { id: response.id })
            this.updateComponentsList()
            this.$forceUpdate()
            this.weiting = false
          }
        )
      }
    },
    // Relationを追加する
    addRelation (_relation, _relationType) {
      if (_relation === '') {
        console.log('入力されていません')
      } else if (this.relationsMap.has(_relation)) {
        console.log('重複しております')
      } else {
        this.weiting = true
        this.postRelationToDB(_relation, _relationType).then(
          (response) => {
            this.$set(this.relationsMap, _relation, { id: response.id, value: _relationType })
            this.updateRelationsList()
            this.$forceUpdate()
            this.weiting = false
          }
        )
      }
    },
    // Relationの詳細を追加する
    addRelationDetail (_component1, _component2, _relation, _relationDetail) {
      const tmp = [_component1, _component2, _relation]
      if (_component1 === '' || _component2 === '' || _relation === '') {
        console.log('入力に不備あり')
      } else if (this.relationDetailMap.has(tmp)) {
        console.log('重複しております')
      } else {
        this.weiting = true
        const _component1Id = this.getComponentId(_component1)
        const _component2Id = this.getComponentId(_component2)
        const _relationId = this.getRelationId(_relation)
        this.postRelationshipToDB(_component1Id, _component2Id, _relationId, _relationDetail)
          .then(
            (response) => {
              this.$set(this.relationDetailMap, tmp, { id: response.id, value: _relationDetail })
              this.$refs.ref_WatchRelationship.componentChanged()
              this.$forceUpdate()
              this.weiting = false
            }
          )
      }
    },
    // Relationの詳細が変化した時によび、リアルタイムに表示を更新する
    changeRelationDetailList (_component1, _component2) {
      const _list = []
      const _map = this.relationDetailMap
      Object.keys(_map).forEach((key, index) => {
        const [keyComponent1, keyComponent2, _relation] = key.split(',')
        const _relationDetail = _map[key]
        if (_component1 === keyComponent1 && _component2 === keyComponent2) {
          _list.push([_relation, _relationDetail.value, this.relationsMap[_relation].value])
        }
      })
      this.updateRelationsDetailList(_list)
      this.$forceUpdate()
    },
    // 部屋id を変えるときなどに用いて、表示を完全にリセットする。
    reload (roomId) {
      if (roomId === '') {
        // pass
      } else {
        // 待ち処理
        this.weiting = true
        console.log('roomId', roomId)
        this.$axios
          .$get(
            '/api/get_all/', {
              params: {
                room_id: roomId
              }
            }
          ).then((responce) => {
            const component = responce.components
            const relation = responce.relations
            const relationDetail = responce.relations_detail
            // プロパティを全削除
            Object.keys(this.componentsMap).forEach((key) => {
              this.$delete(this.componentsMap, key)
            })
            Object.keys(this.relationsMap).forEach((key) => {
              this.$delete(this.relationsMap, key)
            })
            Object.keys(this.relationDetailMap).forEach((key) => {
              this.$delete(this.relationDetailMap, key)
            })

            component.forEach(
              ([_id, _name]) => {
                this.$set(this.componentsMap, _name, { id: _id })
              }
            )

            relation.forEach(
              ([_id, _name, _type]) => {
                this.$set(this.relationsMap, _name, { id: _id, value: _type })
              }
            )

            relationDetail.forEach(
              ([_id, _componentFrom, _componentTo, _relationName, _detail]) => {
                this.$set(
                  this.relationDetailMap,
                  [_componentFrom, _componentTo, _relationName],
                  { id: _id, value: _detail }
                )
              }
            )

            this.updateLists()
            this.$forceUpdate()
            this.weiting = false
          })
          .catch(consoleError)
      }
    },
    // 構成名からidを得る
    getComponentId (_component) {
      return this.componentsMap[_component].id
    },
    // 関係名からidを得る
    getRelationId (_relation) {
      return this.relationsMap[_relation].id
    },
    // 関係名から関係のタイプを得る（短文など）
    getRelationType (_relationName) {
      this.relationType = this.relationsMap[_relationName].value || 0
    },
    // ComponentsListを更新して子コンポーネントに伝える
    updateComponentsList () {
      const _list = Object.keys(this.componentsMap)
      this.$refs.ref_AddRelationship.updateComponentsList(_list)
      this.$refs.ref_WatchRelationship.updateComponentsList(_list)
    },
    // RelationsListを更新して子コンポーネントに伝える
    updateRelationsList () {
      const _list = Object.keys(this.relationsMap)
      this.$refs.ref_AddRelationship.updateRelationsList(_list)
    },
    // RelationsDetailListを更新して子コンポーネントに伝える
    updateRelationsDetailList (_list) {
      this.$refs.ref_WatchRelationship.updateRelationsDetailList(_list)
    },
    // updateRelationsList + updateRelationsDetailList
    updateLists () {
      this.updateComponentsList()
      this.updateRelationsList()
    },
    // db に接続 post_component
    postComponentToDB (_component) {
      return this.$axios
        .$get(
          '/api/post_component/', {
            params: {
              room_Id: this.roomId, component_name: _component
            }
          }
        ).catch(consoleError)
    },
    // db に接続 post_relation
    postRelationToDB (_relation, _relationType) {
      return this.$axios
        .$get(
          '/api/post_relation', {
            params: { room_id: this.roomId, relation_name: _relation, relation_type: _relationType }
          }
        ).catch(consoleError)
    },
    // db に接続 post_relation_detail
    postRelationshipToDB (_component1, _component2, _relation, _relationDetail) {
      return this.$axios
        .$get(
          '/api/post_relation_detail', {
            params:
              {
                room_id: this.roomId,
                component_id_from: _component1,
                component_id_to: _component2,
                relation_id: _relation,
                relation_detail: _relationDetail
              }
          }
        ).catch(consoleError)
    },
    // デバッグ用 その一
    async debugFunc1 () {
      this.addComponent('まどか')
      this.addComponent('ほむら')
      await new Promise(resolve => setTimeout(resolve, 3000))
      this.addRelation('呼び名', 1)
      this.addRelation('印象', 1)
      await new Promise(resolve => setTimeout(resolve, 3000))
      this.addRelationDetail('まどか', 'ほむら', '呼び名', 'ほむらちゃん')
      this.addRelationDetail('まどか', 'ほむら', '印象', '変わった女の子')
      await new Promise(resolve => setTimeout(resolve, 3000))
      this.$refs.ref_WatchRelationship.componentForceChange('まどか', 'ほむら')
    },
    // デバッグ用 その二
    async debugFunc2 () {
      await this.$axios
        .$get(
          '/api/post_room', {
            params: { room_name: 'debugRoom' }
          }
        ).then((responce) => {
          this.roomId = responce.id
          this.reload(this.roomId)
        }).catch(error => consoleError(error))
    }
  }
}

</script>

<style>

</style>
