app.service('manageUsersService', function(dynamicValuesService, userConfigurationService, $http, $httpParamSerializer, $q, $rootScope) {

	this.data;
	this.dropDownsMapped = false;
	this.firm;
	this.messages = [];
	this.show = 'table';
	this.values = {};

	// TODO, THESE ARE USELESS, SHOULD BE ON 'THIS'
	var activeRecord;
	var show = 'table'; // table | add | change
	var user;

	this.clearMessages = function() {
		this.messages.length = 0;
	}

	this.setInfoMessage = function(message) {
		this.clearMessages();
		this.messages.push({
			message: message,
			userMessageType: 'INFO'
		})
	}

	this.getShow = function() {
		return this.show;
	}

	this.clearData = function() {
		this.data = undefined;
		this.dropDownsMapped = false;
	}

	this.setShow = function(show) {
		this.show = show;
		if(this.show === 'add') {
			this.activeRecord = {};
			this.activeRecord.dataSets = this.values.dataSets;
			this.activeRecord.firm = this.firm || this.values.firms[0];
			this.activeRecord.language = this.values.languages[0];
			this.activeRecord.role = this.values.roles[0];
			this.activeRecord.sendWelcomeEmail = true;
			// reset in case doing this after another add/change
			for(var i=0;i<this.values.dataSets.length;i++) {
				this.values.dataSets[i].isSelectedByUser = false;
			}
		}
	}
	
	this.getUser = function() {
		return this.user;
	}

	//

	this.getDataSets = function() {
		// retrieve for *current user* to get list
		if(typeof this.values.dataSets === 'undefined') {
			return $http.get('canchek/rest/userdatasetinfo?filter=ALL').then(function(reply) {
				return reply.data;
			});
		} else {
			return this.values.dataSets;
		}
	}

	this.loadFirms = function() {
		if(typeof this.values.firms === 'undefined') {
			return $http.get('canchek/rest/firm?filter=ACTIVE').then(function(reply) {
				return reply.data;
			});
		} else {
			return this.values.firms;
		}
	}

	this.getUsers = function() {
		if(typeof this.data === 'undefined') {
			var url = 'canchek/rest/users'
			if(typeof this.firm !== 'undefined') {
				url += '?firm=' + encodeURIComponent(this.firm.firm);
			}
			return $http.get(url).then(function(reply) {
				return reply.data;
			});
		} else {
			return this.data;
		}
	}

	this.getValues = function() {
		return this.values;
	}

	// TODO: GET vs FROM SERVER (rename to LOAD), vs GET to other class
	this.getFirms = function() {
		return this.values.firms;
	}

	this.setFirm = function(firm) {
		this.firm = firm;
	}
	
	this.getMessages = function() {
		return this.messages;
	}

	this.loadData = function() {
		var that = this;
		var getUserConfiguration = userConfigurationService.get();
		var getDataSets = this.getDataSets();
		var getUsers = this.getUsers();
		var loadFirms = this.loadFirms();
		var tables = ['languages', 'roles'];
		var getValues = dynamicValuesService.loadData(tables);
		var that = this;
		return $q.all([getUsers, getValues, getUserConfiguration, loadFirms, getDataSets]).then(function(replies) {
			that.data = replies[0];
			that.values = replies[1];
			that.user = replies[2]
			that.values.firms = replies[3];
			that.values.dataSets = replies[4];
			that.mapDropDowns(that.data);
			if(typeof that.firmCode === 'undefined') {
				that.firmCode = that.user.firm;
			}
			if(that.show === 'table' && that.data.length == 0) {
				that.setInfoMessage('No records found.');
			}
			return {
				activeRecord: that.activeRecord,
				data: that.data,
				messages: that.messages,
				user: that.user,
				values: that.values
			}
		});
    };

	this.mapDropDowns = function(data) {
		if(!this.dropDownsMapped) {
			for(var i=0;i<data.length;i++) {
				this.mapDropDown(data[i], 'firms', 'firm', 'firm');
				this.mapDropDown(data[i], 'languages', 'code', 'language');
				this.mapDropDown(data[i], 'roles', 'code', 'role');
			}
			this.dropDownsMapped = true;
		}
	}

	this.mapDropDown = function(record, tableName, serverField, clientField) {
		var table = this.values[tableName];
		if(this.show === 'add') {
			record[clientField] = table[0];
			return;
		}		
		for(var i=0;i<table.length;i++) {
			if(table[i][serverField] === record[clientField]) {
				record[clientField] = table[i];
				return;
			}
		}
		// this implies that a user is setup with illegal values (eg. not SUPER but sees things only SUPER should see');
		console.log('no dropdown map found for: ' + tableName + ' ' + serverField + ' ' + clientField);
	}

	//
	
	this.setActiveRecord = function(idx) {
		this.activeRecord = this.data[idx];
	}
	
	//
	
	// TODO why firm is object and not just String...	
	this.saveActiveRecord = function() {
		var data = {
			// direct assign
			dataSets: this.activeRecord.dataSets,
			email: this.activeRecord.email,
			eid: this.activeRecord.eid,
			name: this.activeRecord.name,
			resolvedItemTracking: this.activeRecord.resolvedItemTracking,
			sendWelcomeEmail: this.activeRecord.sendWelcomeEmail,
			sso: this.activeRecord.sso,
			// indirect assign
			firm: this.activeRecord.firm.firm,
			language: this.activeRecord.language.code,
			role: this.activeRecord.role.code
		}
		var method;
		if(this.show === 'add') {
			method = 'POST'
		}
		if(this.show === 'change') {
			data.userId = this.activeRecord.userId;
			method = 'PATCH'
		}
		var request = {
			data: data,
			method: method,
			url: 'canchek/rest/users'
		}
		var that = this;
		return $http(request).then(function(reply) {
			that.processUpdateReply(reply.data);
		});
	}

	this.deleteActiveRecord = function() {
		var request = {
			method: 'DELETE',
			url: 'canchek/rest/users/' + encodeURIComponent(this.activeRecord.userId)
		}
		var that = this;
		return $http(request).then(function(reply) {
			that.processUpdateReply(reply.data);
		});
	}

	this.processUpdateReply = function(messages) {
		this.clearMessages();
		var onlyInfo = true;
		for(var i=0;i<messages.length;i++) {
			this.messages.push(messages[i]);
			if(messages[i].userMessageType !== 'INFO') {
				onlyInfo = false;
			}
		}
		if(onlyInfo) {
			this.clearData();
			this.show = 'table';
			$rootScope.$broadcast('show');
		}
	}

});