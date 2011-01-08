(function() {

var storage = window.localStorage;

var StorageDB = function(namespace, opt) {
	if (!namespace || typeof namespace !== 'string') {
		throw new Error('namespace is must be string');
	}

	opt = opt || {};
	var nsPrefix = opt.nsPrefix || 'storagedb.';
	this.namespace = nsPrefix + namespace;
	this.pk = opt.pk || 'id';
	this.datas = {};

	try {
		this.datas = JSON.parse(storage[this.namespace]) || {};
	}
	catch (e) {}
}

StorageDB.prototype = {
	_updateStorage: function() {
		var self = this;

		storage[self.namespace] = JSON.stringify(self.datas);
	},
	_each: function(callback) {
		var self = this;

		for (i in self.datas) {
			if (self.datas.hasOwnProperty(i)) {
				callback(self.datas[i], i);
			}
		}
	},
	count: function() {
		var self = this;

		var count = 0;
		self._each(function() {
			count++;
		});

		return count;
	},
	insert: function(items) {
		var self = this;

		if (!Array.isArray(items)) {
			items = [items];
		}

		items.forEach(function(item) {
			var pkValue = item[ self.pk ];
			if (!self.exist(pkValue)) {
				self.datas[pkValue] = item;
				self._updateStorage();
			}
		});
	},
	remove: function(pkValue) {
		var self = this;

		if (self.exist(pkValue)) {
			delete self.datas[ pkValue ];
			self._updateStorage();
		}
	},
	find: function(pkValue) {
		var self = this;

		return self.datas[pkValue];
	},
	exist: function(pkValue) {
		var self = this;

		return !!self.find(pkValue);
	},
	search: function(cond, sort) {
		var self = this;

		var ret = [];
		self._each(function() {
			var item = self.datas[i];
			if (cond) {
				for (key in cond) {
					var val = cond[key];
					var _val = item[key];
					if ( val === _val || (typeof val === 'function' && 'test' in val && val.test(_val)) ) {
						ret.push(item);
					}
				}
			}
			else {
				ret.push(item);
			}
		});

		if (sort) {
			for (key in sort) {
				var sortFn = sort[key] === 'desc'
					? function(a, b) { return a[key] < b[key] }
					: function(a, b) { return a[key] > b[key] };

				ret.sort(sortFn);
			}
		}

		return ret;
	},
	destroy: function() {
		var self = this;

		delete storage[self.namespace];
	}
};

window.StorageDB = StorageDB;

})();

