const express = require('express')
const app = express()

function getConnection () {
  const mysql = require('mysql2')
  const connection = mysql.createConnection({
    host: 'db',
    user: 'docker_user',
    database: 'docker_db',
    password: 'docker_pass',
    multipleStatements: true
  })
  return connection
}
// room_idを指定してそれに当てはまるすべてのものをとってくる
app.get('/get_all', function (req, res) {
  const ret = {}
  const connection = getConnection()
  const params = req.query
  // eslint-disable-next-line camelcase
  const room_id = params.room_id

  console.log('server function: api/get_all')
  console.log('room_id:', room_id)

  connection.query(
    `
    SELECT * FROM \`components\` WHERE \`room_id\` = ?;
    SELECT * FROM \`relations\` WHERE \`room_id\` = ?;
    SELECT 
    relation_detail_id,
    components1.component_name AS component_from, 
    components2.component_name AS component_to,
    relations.relation_name AS relation_name,
    relation_detail AS relation_detail
    FROM relations_detail
    INNER JOIN components AS components1
    ON relations_detail.component_id_from = components1.component_id
    INNER JOIN components AS components2
    ON relations_detail.component_id_to = components2.component_id
    INNER JOIN relations AS relations
    ON relations_detail.relation_id = relations.relation_id
    WHERE relations_detail.room_id = ?;
    `
    ,
    // eslint-disable-next-line camelcase
    [room_id, room_id, room_id],
    function (error, results) {
      if (error) {
        console.log(error)
      } else {
        // eslint-disable-next-line camelcase
        ret.roomId = room_id
        ret.components = results[0].map(
          row => [row.component_id, row.component_name]
        )
        ret.relations = results[1].map(
          row => [row.relation_id, row.relation_name, row.relation_type]
        )
        ret.relations_detail = results[2].map(
          row => [row.relation_detail_id, row.component_from, row.component_to, row.relation_name, row.relation_detail]
        )
        res.header('Content-Type', 'application/json; charset=utf8mb4')
        res.send(JSON.stringify(ret))
      }
    })
  connection.end()
}
)

// 新しい部屋を作り、idを得る
app.get('/post_room', function (req, res) {
  const ret = {}
  const connection = getConnection()
  const params = req.query
  console.log(params)

  connection.query(
    'INSERT INTO rooms SET ?;', params,
    function (error, results) {
      if (error) {
        console.log(error)
      } else {
        ret.id = results.insertId
        res.header('Content-Type', 'application/json; charset=utf8mb4')
        res.send(JSON.stringify(ret))
        console.log(ret)
      }
    })
  connection.end()
}
)

// room_idを指定して新しい構成要素を作り、idを得る
app.get('/post_component', function (req, res) {
  const ret = {}
  const connection = getConnection()
  const params = req.query
  console.log(params)

  connection.query(
    'INSERT INTO components SET ?;', params,
    function (error, results) {
      if (error) {
        console.log(error)
      } else {
        ret.id = results.insertId
        res.header('Content-Type', 'application/json; charset=utf8mb4')
        res.send(JSON.stringify(ret))
        console.log(ret)
      }
    })
  connection.end()
}
)

// room_idを指定して新しい関係を作り、idを得る
app.get('/post_relation', function (req, res) {
  const ret = {}
  const connection = getConnection()
  const params = req.query

  console.log('server function: api/post_relation')
  console.log('params:', params)

  connection.query(
    'INSERT INTO relations SET ?;', params,
    function (error, results) {
      if (error) {
        console.log(error)
      } else {
        console.log(results)
        ret.id = results.insertId
        res.header('Content-Type', 'application/json; charset=utf8mb4')
        res.send(JSON.stringify(ret))
        console.log(ret)
      }
    })
  connection.end()
})

// 色々指定して新しい関係の詳細を作り、idを得る
app.get('/post_relation_detail/', function (req, res) {
  const ret = {}
  const connection = getConnection()
  const params = req.query

  connection.query(
    'INSERT INTO relations_detail SET ?;', params,
    function (error, results) {
      if (error) {
        console.log(error)
      } else {
        console.log(results)
        ret.id = results.insertId
        res.header('Content-Type', 'application/json; charset=utf8mb4')
        res.send(JSON.stringify(ret))
        console.log(ret)
      }
    })
  connection.end()
})

module.exports = {
  path: '/api/',
  handler: app
}
