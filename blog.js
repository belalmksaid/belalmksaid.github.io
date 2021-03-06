function loadBlogs(cont) {
    let url = "articles/feed.json";
    $.get(url, function (articles) {
        articles = articles.articles;
        cont.innerHTML = "";
        for (let i =  articles.length - 1; i >= 0; i--) {
            let ele = '<div class="projectPoster"><h1><a href="blog.html?id=[id]">[title]</a></h1><h3>[desc]</h3><br/><h5>[date]</h5></div>';
            ele = ele.replace("[id]", i.toString()).replace("[title]", articles[i].title).replace("[desc]", articles[i].description).replace("[date]", articles[i].date);
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