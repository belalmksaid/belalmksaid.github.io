function loadBlogs(cont) {
    let url = "articles/feed.json";
    $.get(url, function (articles) {
        articles = articles.articles;
        cont.innerHTML = "";
        for (let i = 0; i < articles.length; i++) {
            let ele = '<div class="projectPoster"><h1><a href="blog.html?id=[id]">[title]</a></h1><h3>[desc]</h3><h4></h4></div>';
            ele = ele.replace("[id]", i.toString()).replace("[title]", articles[i].title).replace("[desc]", articles[i].description);
            cont.innerHTML += ele;
        }
    });
}

function loadBlogsFromId(cont, id) {
    id = parseInt(id);
    let url = "articles/feed.json";
    $.get(url, function (articles) {
        articles = articles.articles;
        cont.innerHTML = "";
        let ele = '<iframe src="articles/[url]"></iframe>';
        ele = ele.replace("[url]", articles[id].uri);
        cont.innerHTML += ele;
    });
}