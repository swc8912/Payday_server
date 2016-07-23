var mongoose = require('mongoose');
var querystring = require('querystring');
var url = require('url');
var db = mongoose.connect('mongodb://localhost/paydaydb');
var Schema = mongoose.Schema;

var getItemData = new Schema({
    email: String,
    itemIdx: Number,
    date: String
});

var userData = new Schema({
    did: String,
    email: String,
    money: Number,
    rank: String,
    heart: Number,
    charge: Number,
    currentBoxId: String,
    pickItems: String,
    getPush: String
});

var logData = new Schema({
    logCmd: Number,
    email: String,
    date: String
});

var boxdata = new Schema({
    box: String,
    bdata: Array
});

var getItemDataModel = mongoose.model('getItemData', getItemData);
var userDataModel = mongoose.model('userData', userData);
var logDataModel = mongoose.model('logData', logData);
var boxDataModel = mongoose.model('boxdata', boxdata);

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
        var data = new getItemDataModel();
        data.email = body.email;
        data.itemIdx = body.itemIdx;
        data.date = body.date;
        data.save(callback);
    }
	else if(body.email != null && body.did != null){ // 유저 데이터 추가
		console.log("insert body: " + body.did);
		console.log("insert body: " + body.email);
		console.log("insert body: " + body.money);
		console.log("insert body: " + body.rank);
		console.log("insert body: " + body.heart);
		console.log("insert body: " + body.charge);
		console.log("insert body: " + body.currentBoxId);
		console.log("pickItems: " + body.pickItems);
		var data = new userDataModel();
        data.did = body.did;
        data.email = body.email;
        data.money = body.money;
        data.rank = body.rank;
        data.heart = body.heart;
        data.charge = body.charge;
        data.currentBoxId = body.currentBoxId;
        data.pickItems = body.pickItems;
        data.getPush = body.getPush;
		data.save(callback);
	}
    else if (body.logCmd != null) { // 로그 데이터 옴
    	console.log('logdata');
        var data = new logDataModel();
        data.logCmd = body.logCmd;
        data.email = body.email;
        data.date = body.date;
        data.save(callback);
    }
    else if(body.boxdata != null){ // 박스 데이터 입력
    	var data = body.boxdata;
    	console.log('boxdata insert');
    	console.log('data: ' + data[0].name);
    	console.log('data len: ' + data.length);
    	var boxData = new boxDataModel();
    	boxData.box = "true";
    	boxData.bdata = new Array(data.length);

    	var i = 0;
    	for(var i = 0; i < data.length; i++){
            var idata = {
                name: data[i].name,
                boxId: data[i].boxId,
                cost: data[i].cost,
                rangeStart: data[i].rangeStart,
                rangeEnd: data[i].rangeEnd,
                itemList: data[i].itemList,
                nextId: data[i].nextId
            }
    		boxData.bdata[i] = idata;
    		//console.log("arr i: " + arr[i].name);
    	}
    	//console.log("boxdata: " + JSON.stringify(boxdata));
    	boxData.save(callback);
    }
}

function _findPayday(where, callback){
	where = where || {};
	// where에 주소에 넣은 파라미터 나옴
	console.log("find where email: " + where.email);
	console.log("find where did: " + where.did);
	console.log("find where: " + where.box);
	if(where.email != null && where.did != null){
		// 유저 데이터 요청
		userDataModel.find(where, callback);
	}
	else if(where.box != null){
		// 박스 데이터 요청
		boxDataModel.find(where, callback);
	}
}

function _updatePayday(where, body, callback){
	var body = typeof body === 'strng' ? JSON.parse(body) : body;
	console.log("update where: " + where.toString());
	console.log("body: " + body.toString());
	if(where.email != null){
		userDataModel.findOne(where, function(err, userData){
			if(err){
				throw err;
			}
			else{
				if(userData != null){
					userData.money = body.money;
					userData.rank = body.rank;
					userData.heart = body.heart;
					userData.charge = body.charge;
					userData.currentBoxId = body.currentBoxId;
					console.log("update body pickItems: " + JSON.stringify(body.pickItems));
					userData.pickItems = JSON.stringify(body.pickItems);
					userData.getPush = body.getPush;
					userData.save(callback);	
				}
			}
		});
	}
}

function _removePayday(where, callback){
	if(where.email != null && where.did != null){
		userDataModel.remove(where, callback);
	}
	else if(where.box != null){
		boxDataModel.remove(where, callback);
	}
}
