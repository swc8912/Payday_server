var Datastore = require('nedb');
var db = new Datastore({filename: './data/payday', autoload: true});
var querystring = require('querystring');
var url = require('url');

exports.create = function(req, res){
	var body = req.body;
	console.log("create body: " + body);
	_insertPayday(body, function(error, result){
		res.json({error: error, results: result});
	});
};

exports.read = function(req, res){
	var where = req.query;
	console.log("read req: " + where);
	_findPayday(where, function(error, results){
		res.json({error: error, results: results});
	});
};
/*
exports.readUser = function(req, res){
	var body = req.body;
	body = typeof body === 'strng' ? JSON.parse(body) : body;
	console.log("readUser body: " + JSON.stringify(body));
	//console.log("readUser query: " + req.query.toString());
	_findPayday(body, function(error, results){
		res.json({error: error, results: results});
	});
}*/

exports.update = function(req, res){
	var where = req.query;
	var body = req.body;

	_updatePayday(where, body, function(error, results){
		res.json({error: error, results: results});
	});
};

exports.remove = function(req, res, body){
	var where = req.query;

	_removePayday(where, function(error, results){
		res.json({error: error, results: results});
	});
};

function _insertPayday(body, callback){
	body = typeof body === 'strng' ? JSON.parse(body) : body;
	console.log("insertpayday body email: " + body.email);
	if (body.itemIdx != null) { // 아이템 획득
    	console.log('getItemData');
        var getItemData = {
            email: body.email,
            itemIdx: body.itemIdx,
            date: body.date
        }
        db.insert(getItemData, callback);
    }
	else if(body.email != null && body.did != null){ // 유저 데이터 추가
		console.log("insert body: " + body.did);
		console.log("insert body: " + body.email);
		console.log("insert body: " + body.money);
		console.log("insert body: " + body.rank);
		console.log("insert body: " + body.heart);
		console.log("insert body: " + body.charge);
		console.log("insert body: " + body.currentBoxId);
		var userData = {
			did: body.did,
			email: body.email,
			money: body.money,
			rank: body.rank,
			heart: body.heart,
			charge: body.charge,
			currentBoxId: body.currentBoxId,
			pickItems: body.pickItems,
			getPush: body.getPush
		}
		db.insert(userData, callback);
	}
    else if (body.logCmd != null) { // 로그 데이터 옴
    	console.log('logdata');
        var logData = {
            logCmd: body.logCmd,
            email: body.email,
            date: body.date
        }
        db.insert(logData, callback);
    }
    else if(body.boxdata != null){ // 박스 데이터 입력
    	var data = body.boxdata;
    	console.log('boxdata insert');
    	console.log('data: ' + data[0].name);
    	console.log('data len: ' + data.length);
    	var arr = new Array(data.length);
    	var boxdata = {
    		box: "true",
    		bdata: arr
    	}
    	var i = 0;
    	for(var i = 0; i < data.length; i++){
    		var indata = {
	    		name: data[i].name,
	    		boxId: data[i].boxId,
	    		cost: data[i].cost,
	    		rangeStart: data[i].rangeStart,
	    		rangeEnd: data[i].rangeEnd,
	    		itemList: data[i].itemList,
	    		nextId: data[i].nextId
    		}
    		boxdata.bdata[i] = indata;
    		console.log("boxdata i: " + boxdata.bdata[i].name);
    	}
    	//console.log("boxdata: " + JSON.stringify(boxdata));
    	db.insert(boxdata, callback);
    }
}

function _findPayday(where, callback){
	where = where || {};
	console.log("find where: " + where.email);
	// 유저 데이터 요청, 박스 데이터 요청
	// 파라미터만 다르면 됨 고칠 것 없음
	db.find(where, callback);
}

function _updatePayday(where, body, callback){
	body = typeof body === 'strng' ? JSON.parse(body) : body;
	console.log("update where: " + where.toString());
	db.update(where, {$set: body}, {multi: true}, callback);
}

function _removePayday(where, callback){
	db.remove(where, {multi: true}, callback);
}
