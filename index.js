var pg = require('pg');
var fs = require('fs');

var db_url;
var ready = false;

module.exports = {
	init: function(settings){
		postgres://localhost:5432/learning
		if(settings){
			if (settings.password == undefined){
				settings.password = '';
			}else{
				settings.password = ':'+settings.password;
			}

			if(!settings.username){
				db_url = "postgres://"+settings.host+":"+settings.port+"/"+settings.database;
			}else{
				db_url = "postgres://"+settings.username+settings.password+"@"+settings.host+":"+settings.port+"/"+settings.database;
			}
			if(settings.debug){
				console.log('PG-API - [The db_url was set to: "'+db_url+'"]');
			}
		}

		if (db_url == undefined || db_url == null || db_url == ''){
			ready = false;
			console.error('PG-API - [The db_url was NOT set up]');
		}else{
			ready = true;
		}
	},
	getData: function(query_msg, endFunc, next){
		
		pg.connect(db_url, function(err, client){
			if(err) this.ERR(err);

			var query = client.query(query_msg);
			
			var final_data = [];

			query.on('row', function(row){
				final_data.push(row);
			});

			query.on('error', function(err){
				console.log("PG-API - ERROR - [" + err + "]");
				client.end();
			});
			
			query.on('end', function(){
				endFunc(final_data);
				client.end();
				
				if(typeof(next) == 'function'){
					next();
				}
			});
		});
	},
	runQuery: function(query_msg, next){
		pg.connect(db_url, function(err, client){
			if(err) this.ERR(err);

			var query = client.query(query_msg);
			
			var final_data = [];

			query.on('error', function(err){
				console.log("PG-API - ERROR - [" + err + "]");
				client.end();
			});
			
			query.on('end', function(){
				client.end();
				if(typeof(next) == 'function'){
					next();
				}
			});
		});
	},

	ERR: function (err){
		console.error(err);
		process.exit(1);
	}
}


