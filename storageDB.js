(function($, undefined) {

var storage = window.localStorage;

var StorageDB = function(namespace, opt) {
	if (!namespace || $.type(namespace) !== 'string') {
		throw new Error('namespace is must be string');
	}

	opt = opt || {};
	var nsPrefix = opt.nsPrefix || 'storagedb.';
	this.namespace = nsPrefix + namespace;
	this.limit = opt.limit || 100;
	this.list = [];

	try {
		this.list = JSON.parse(storage[this.namespace]) || [];
	}
	catch (e) {}
}

StorageDB.prototype = {
	add: function(item) {
		var self = this;

		item.createdAt = (new Date).getTime();
		self.remove(item.id);
		self.list.unshift(item);
		if (self.list.length > self.limit) {
			self.list.pop();
		}
		self.updateStorage();
	},
	remove: function(id) {
		var self = this;

		self.list.forEach(function(item, i) {
			if (item.id === id) {
				self.list.splice(i, 1);
			}
		});
		self.updateStorage();
	},
	find: function(id) {
		var self = this;

		var _item;
		var exist = self.list.some(function(item) {
			if (item.id === id) {
				_item = item;
				return true;
			}
		});
		return exist ? _item : undefined;
	},
	exist: function(id) {
		var self = this;

		return !!self.find(id);
	},
	updateStorage: function() {
		var self = this;

		storage[self.namespace] = JSON.stringify(self.list);
	}
};

window.StorageDB = StorageDB;

})(jQuery);

