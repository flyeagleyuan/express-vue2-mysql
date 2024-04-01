var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var bodyParser = require('body-parser')
var pool  = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	port: '3306',
	database: 'runoob'
})
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	next()
})

// user 
// /user/findall
router.get('/api/user/findall', (req, res) => {
	var sql = 'select user.id, user.name, user.fullName, user.password, user.phone, user.mail, role.id as roleId, role.name as roleName, role.fullName as rolefullName, company.id as companyId, company.name as companyName from user join role on user.role_id=role.id join company on user.company_id=company.id'
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			var result = []
			for (var k in data) {
				result.push({
					id: data[k].id,
					name: data[k].name,
					password: data[k].password,
					fullName: data[k].fullName,
					role: {
						id: data[k].roleId,
						name: data[k].roleName,
						fullName: data[k].rolefullName
					},
					company: {
						id: data[k].companyId,
						name: data[k].companyName
					},
					phone: data[k].phone,
					mail: data[k].mail
				})
			}
			res.send(result)
			console.log(result)
			connection.release();
		})
	})
})
// /user/findone
router.get('/api/user/findone', (req, res) => {
	var sql = `select * from user where id=` + req.query.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data[0])
			}
			connection.release();
		})
	})
})
// user/add
router.post('/api/user/add', (req, res) => {
	var sql = `insert into user (id, name, fullName, password, role_id, company_id, phone, mail) values (null, ?, ?, ?, ?, ?, ?, ?)`
	pool.getConnection(function(err, connection) {
		connection.query(sql, [req.body.name, req.body.fullName, req.body.password, req.body.role.id, req.body.company.id, req.body.phone, req.body.mail], (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data)
			}
			connection.release();
		})
	})
})
// /user/put
router.put('/api/user/put', (req, res) => {
	var sql = `update user set name=?,fullName=?,password=?,role_id=?,company_id=?,phone=?,mail=? where id=` + req.body.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, [req.body.name, req.body.fullName, req.body.password, req.body.role.id, req.body.company.id, req.body.phone, req.body.mail], (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data)
			}
			connection.release();
		})
	})
})
// /user/delete
router.delete('/api/user/:id', (req, res) => {
	var sql = `delete from user where id=` + req.params.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data)
			}
			connection.release();
		})
	})
})

// company
// /company/findall
router.get('/api/company/findall', (req, res) => {
	var sql = 'select * from company'
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data)
				console.log(data)
			}
			connection.release();
		})
	})
})
// /company/findone
router.get('/api/company/findone', (req, res) => {
	var sql = 'select * from company where id=' + req.query.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data[0])
				console.log(data)
			}
			connection.release();
		})
	})
})
// /company/add
router.post('/api/company/add', (req, res) => {
	if (!req.body.name) {
		res.status(500).send({message: '公司名不能为空'})
	} else {
		var sql = 'insert into company (id, name, create_time ) values (null,?,now())'
		pool.getConnection(function(err, connection) {
			connection.query(sql, [req.body.name, now()], (err, data) => {
				if (err) {
					res.send(err)
				} else {
					res.send(data)
					console.log(data)
				}
				connection.release();
			})
		})
	}
})
// company/put
router.put('/api/company/put', (req, res) => {
	var sql = 'update company set name=? where id=' + req.body.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, [req.body.name], (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data)
				console.log(data)
			}
			connection.release();
		})
	})
})
// company/delete
router.delete('/api/company/:id', (req, res) => {
	var sql = 'delete from company where id=' + req.params.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send(data)
				console.log(data)
			}
			connection.release();
		})
	})
})




// role
// /role/findall
router.get('/api/role/findall', (req, res) => {
	var sql = 'select * from role'
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data, fields) => {
			if (err) {
				res.status(500).send(err)
			} else {
				res.send(data)
				console.log(data)
			}
			connection.release();
		})
	})
	// connection.end()
})
// role/findone
router.get('/api/role/findone', (req, res) => {
	var sql = 'select * from role where id=' + req.query.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.status(500).send(err)
			} else {
				res.send(data[0])
			}
			connection.release();
		})
	})
})
// role/add
router.post('/api/role/add', (req, res) => {
	// res.send({name: req.body.name, fullname: req.body.fullName})
	if (!req.body.name) {
		res.status(500).send({'message':'角色不能为空'})
	} else if (!req.body.fullName) {
		res.status(500).send({'message':'角色名不能为空'})
	} else {
		var sql = 'insert into role (id, name, fullName) values(null,?,?)'

		pool.getConnection(function(err, connection) {

			connection.query(sql, [req.body.name, req.body.fullName], (err, data, fields) => {

				if (err) {
					res.status(500).send(err)
				} else {
					res.send(data)
					console.log(data)
				}
				connection.release();
			})
		})
		// connection.end()		
	}
})
// role/put
router.put('/api/role/put', (req, res) => {
	if (!req.body.name) {
		res.status(500).send([{'message':'角色不能为空'}])
	} else if (!req.body.fullName) {
		res.status(500).send({'message':'角色名不能为空'})
	} else {
		var sql = 'update role set name=?,fullName=? where id=' + req.body.id
		pool.getConnection(function(err, connection) {
			connection.query(sql, [req.body.name, req.body.fullName], (err, data, fields) => {
				if (err) {
					res.status(500).send(err)
				} else {
					res.send(data)
					console.log(data)
				}
				connection.release();
			})
		})
		// connection.end()		
	}
})
// role/delete
router.delete('/api/role/:id', (req, res) => {
	var sql = 'delete from role where id=' + req.params.id
	pool.getConnection(function(err, connection) {
		connection.query(sql, (err, data) => {
			if (err) {
				res.status(500).send(err)
			} else {
				res.send(data)
				console.log(data)
			}
			connection.release();
		})
	})
})

module.exports = router



