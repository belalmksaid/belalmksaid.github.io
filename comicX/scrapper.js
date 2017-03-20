function getFile(url) {
	$.get(url, function(data) {
		return data;
	});
}