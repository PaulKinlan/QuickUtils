/*

  Triggered when there is a search on Google.com, sends a query to the webstore, parses the result.

*/

var parseQueryString = function() {
  var queryString = window.location.search;
  return parseQuery(queryString);
};

var parseQuery = function(queryString) {
  var qRe = new RegExp("\\?q=([^&]+)|&q=([^&]+)");
  var results = qRe.exec(queryString) || ["", ""];
  return results[1] || results[2];
};

var parseHashString = function() {
  var queryString = window.location.hash;
  return parseQuery(queryString);
};

var query = parseQueryString(); 

window.addEventListener("hashchange", function() {
  // The Hash has changed, the user is probably doing a search so lets do a search ourselves
  query = parseHashString();  
  searchWebstore(query, function(data) {
    var container = document.querySelector("#ires ol li");
  
    container.insertBefore(createWebstoreBox(data)); 
  });
});


var searchWebstore = function(query, callback) {
  chrome.extension.sendRequest({"q": query}, callback); 
};

var createWebstoreBox = function(data) {
  if(data.results.length == 0) return;

  var box = document.createElement("li");
  var boxContainer = document.createElement("div");
  boxContainer.id = "webstore_results__";
  
  var header = document.createElement("h3");
  var searchLink = document.createElement("a");
  searchLink.textContent = "Search Chrome Web Store for " + query;
  searchLink.target = "_blank";
  searchLink.href = "http://chrome.google.com/webstore/search?q=" + encodeURI(query);

  header.appendChild(searchLink);
  header.style.display = "block";
   
  boxContainer.appendChild(header);
 
  // Itterate over the results
  for (var result in data.results) {
    var resultBox = createResult(data.results[result]);
    boxContainer.appendChild(resultBox);
  }
  
  boxContainer.appendChild(document.createElement("br"));
  
  box.appendChild(boxContainer);
  return box;
};

var createResult = function(result) { 
  var c = document.createElement("div");

  var a = document.createElement("a");
  var img = document.createElement("img");
  var title = document.createElement("span");
  var category = document.createElement("span");
  var price = document.createElement("span");

  a.href = result.href;
  a.target = "_blank";
  a.title = result.title;
 
  img.src = result.img;
  img.alt = result.title;

  title.innerText = result.title;
  category.innerText = result.category.replace("&amp;", "&");
  price.innerText = result.price;
  a.appendChild(img);

  c.appendChild(a);
  c.appendChild(title);
  c.appendChild(category);
  c.appendChild(price);
 
  return c;
};

searchWebstore(query, function(data) {
  var container = document.querySelector("#ires ol li");
  
  container.insertBefore(createWebstoreBox(data)); 
});

