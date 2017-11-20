function loadBlogs(cont) {
    let url = "articles/feed.json";
    $.get(url, function(data) {
        console.log(data);
        let articles = JSON.parse(data);
        articles = articles.articles;
        console.log(articles);
        cont.innerHTML = "";
        for(let i = 0; i < articles.length; i++) {
            let ele = '<div class="projectPoster"><h1><a href="[url]" target="_blank">[title]</a></h1><h3>[desc]</h3></div>';
            ele = ele.replace("[url]", articles[i].uri).replace("[title]", articles[i].title).replace("[desc]", articles[i].description);
            console.log(ele);
            cont.innerHTML += ele;
        }
    });
}