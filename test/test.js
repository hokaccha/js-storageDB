var storage = new StorageDB('foo');

test('basic', function() {
	same(storage.namespace, 'storagedb.foo', 'namespaceの一致');
	same(storage.count(), 0, 'リストはまだ0件');

	storage.insert({ id: 1, foo: 'bar' });
	same(storage.count(), 1);
	same(storage.find(1).foo, 'bar');
	same(storage.exist(1), true);
	same(storage.exist(2), false);
	same(storage.search({ foo: 'bar' })[0].id, 1);

	storage.insert([
		{ id: 2, foo: 'hoge' },
		{ id: 3, foo: 'fuga' }
	]);
	same(storage.count(), 3);
	var list = storage.search(
		{ foo: /hoge|fuga/ },
		{ id: 'desc' }
	);
	same(list.length, 2);
	same(list[0].id, 3);
	
	storage.remove(1);
	same(storage.count(), 2);
	same(storage.exist(1), false);

	storage.destroy();
	same(window.localStorage['storagedb.foo'], undefined);
});
