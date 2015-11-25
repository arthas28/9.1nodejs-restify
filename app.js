var restify = require('restify');                //创建restify服务器框架
var Db = require('mysql-activerecord');          //使用mysql-activerecord数据库

var db = new Db.Adapter({
    server: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'news',
    reconnectTimeout: 2000
  });

if(!db){
  console.log('Mysql connecting error !');
}


var server = restify.createServer();              //创建服务
server.use(restify.queryParser());                //启用数据解析查找服务

server.get('/sql',respond);                       //欢迎测试
server.get('/sql/get',query);                     //查询接口
server.get('/sql/select/:index',select);          //精确查询接口
server.get('/sql/insert',insert);                 //插入接口
server.get('/sql/update',update);                 //修改接口
server.get('/sql/delete/:index2',deleteOne);      //删除接口
server.get('/sql/login/:name/:password',login);   //登陆验证接口

server.listen(3900, function() {                  //启动3900端口监听
  console.log('%s listening at %s', server.name, server.url);
});

//欢迎测试函数
function respond(req, res, next) {

  res.charSet('utf-8');                               //避免乱码
  res.setHeader('Access-Control-Allow-Origin','*');   //跨域通信
  res.send('hello ! welcome to the world ! ');
}


//登陆用户密码验证函数
function login(req, res, next) {

  var msg;

  db.where({ 'name': req.params['name']}).get('login', function(err, results, fields) {

    res.charSet('utf-8');
    res.setHeader('Access-Control-Allow-Origin','*');

    if (req.params['password'] == results[0].password) {
        msg = '1';
      }else{
        msg = '0';
    }
    res.send(msg);
  });
}


// 查询函数
function query(req, res, next) {

  db.where(true).get('newslist', function(err, results, fields) {

    res.charSet('utf-8');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.json(results);
  });
}


// 精确查找函数
function select(req, res, next) {

  db.where({ 'id': req.params['index']}).get('newslist', function(err, results, fields) {

    res.charSet('utf-8');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.json(results);
  });
}


// 记录函数
function insert(req, res, next) {

  db.insert('newslist', { 'url': req.params['url'], 'pic': req.params['pic'],'title' :req.params['title'] ,'content' :req.params['content'] ,'time' :req.params['time'] ,'topic' :req.params['topic'] }, function(err,info) {
    if (!err) {
      console.log('INSERT success !');
    }
  });

}


// 修改函数
function update(req, res, next) {

  db.where({ 'id': req.params['id']}).update('newslist', { 'url': req.params['url'], 'pic': req.params['pic'],'title' :req.params['title'] ,'content' :req.params['content'] ,'time' :req.params['time'] ,'topic' :req.params['topic'] }, function(err,info) {
    if (!err) {
      console.log('UPDATE success !');
    }
  });

}


// 删除函数
function deleteOne(req, res, next) {

  db.where({ 'id': req.params['index2']}).delete('newslist', function(err) {
    if (!err) {
      console.log('Deleted success !');
    }
  });

}




