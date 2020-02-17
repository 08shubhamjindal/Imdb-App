var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 0;

async function makeList(keyToSortBy) {
  console.log(keyToSortBy);
  var getjsondata = await getUserAsync();
  if(keyToSortBy!=""){
      getjsondata.sort(function(a, b){
        return a[keyToSortBy] - b[keyToSortBy];
    });
  }
      list = [];
      for (user of getjsondata){
          list.push(
            `<li>
              <h1>${user.movie_title}</h1>
              <p>${user.director_name}</p>
              <p>${user.actor_1_name}</p>
              <p>${user.budget}</p>
              <p>${user.title_year}</p>
              <a href=${user.movie_imdb_link} target="_blank">Visit Movie Link</a>
            </li>`);
        }
      numberOfPages = await getNumberOfPages();
}

async function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

async function nextPage() {
    currentPage += 1;
    await loadList();
}

async function previousPage() {
    currentPage -= 1;
    await loadList();
}

async function firstPage() {
    currentPage = 1;
    await loadList();
}

async function lastPage() {
    currentPage = numberOfPages;
    await loadList();
}

async function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;
    console.log(begin);
    console.log(end);
    pageList = list.slice(begin, end);
    await drawList();
    await check();
}

async function drawList() {
    document.getElementById("list").innerHTML = "";
    for (r = 0; r < pageList.length; r++) {
        document.getElementById("list").innerHTML += pageList[r] + "<br/>";
    }
}

async function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

async function load(keyToSortBy) {
    console.log(keyToSortBy);
    await makeList(keyToSortBy);
    await loadList();
}

const spinner = document.getElementById("spinner");
function showSpinner(flag) {
  if(flag){
      spinner.className = "show";
  }else{
      spinner.className = spinner.className.replace("show", "");
  }
}

window.onload = async function() {
  await load("");
}

async function getUserAsync(){
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =   "http://starlord.hackerearth.com/movies";
    showSpinner(true);
    const response= await fetch(proxyurl + url)
    const data = await response.json()
    showSpinner(false);
    return data;
}
