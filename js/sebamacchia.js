/**
 * Seba Macc
 * -- Simple client side rendering
 * -- And endless scroll
 */

var localAssetSource = "/assets/post-images/";
var splitString = "splitHERE"; // a way to get jason data
var imageWidthInTile = 214; // 250 - padding - borders
var page = 1;
var loading = false;

var isotopeObject;
var loader;

function init() {
  cacheDom();
  createIsotopeContainer();
  renderInitialTile();

  if (typeof postJSON === "undefined") {
    $.ajax({
      url: "/",
      type: "GET",
      success: function (data) {
        eval(data.split(splitString)[1]);
        renderPosts(postJSON);
        loader.className = "loader";
        loading = false;
        addPaginator();
      },
    });
  } else {
    renderPosts(postJSON);
    addPaginator();
  }
}

function cacheDom() {
  loader = document.querySelector(".loader");
}

function addPaginator() {
  // TODO: Wouldn't hurt to debounce this
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
    paginate();
  }
  window.onscroll = function (e) {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 50
    ) {
      paginate();
    }
  };
}

function paginate() {
  if (loading === true) {
    return;
  }

  loading = true;
  loader.className = "loader loading";
  page++;

  $.ajax({
    url: "/" + page + "/",
    type: "GET",
    success: function (data) {
      eval(data.split(splitString)[1]);
      renderPosts(postJSON);
      loader.className = "loader";
      loading = false;
    },
    error: function () {
      // Hide loader... but also, you're at the end of the page.
      renderFooterTile();
      loader.className = "loader";
    },
  });
}

function createIsotopeContainer() {
  var elem = document.querySelector(".tile-grid");
  isotopeObject = new Isotope(elem, {
    // options
    itemSelector: ".tile",
    masonry: {
      gutter: 30,
      fitWidth: true,
    },
    sortBy: "original-order",
    hiddenStyle: {
      transform: "translate(9px, 9px)",
      opacity: 0,
      "box-shadow": "0px 0px black",
    },
    visibleStyle: {
      transform: "translate(0px, 0px)",
      opacity: 1,
      "box-shadow": "9px 9px black",
    },
  });
}

function renderInitialTile() {
  var element = document.createElement("div");
  element.innerHTML = `
  
  <h1>Sebastian Macchia</h1>
 
    <h2>👋 Hi!, check out my stuff</h2>
    <ul>
      <li><a href="https://github.com/sebamacchia">💻</a></li>
      <li><a href="https://sebamacc.bandcamp.com/">🎸</a></li>
      <li><a href="https://twitter.com/sebamacch">🐦</a></li>
      <li><a href="https://medium.com/@sebamacchia">📓</a></li>
      <li><a href="https://www.instagram.com/sebatapes/">📷</a></li>

    </ul>`;

  element.className = "tile";
  isotopeObject.insert(element);
}

function renderFooterTile() {
  var element = document.createElement("footer");
  element.innerHTML = `
    <footer>
      <a href="mailto: tosebamac@gmail.com">----->✉️<-----</a>
    </footer>`;
  document.body.appendChild(element);
}

function renderPosts(postsData) {
  for (var i = 0; i < postsData.length; i++) {
    renderPost(postsData[i]);
  }
}

function renderPost(postData) {
  if (
    postData.title
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9+][^\w.-]/gi, "")
      .toLowerCase() !=
    window.location.pathname.replace(/\//g, "").toLowerCase()
  ) {
    var element = document.createElement("div");
    element.className = "tile";

    if (postData.image !== "") {
      var anchor = document.createElement("a");
      anchor.href = postData.link + "";
      // anchor.target = "_blank";
      anchor.target = "_self";

      var img = document.createElement("img");

      var src = "";
      if (postData.remoteAsset === "true") {
        src += remoteAssetSource;
      } else {
        src += localAssetSource;
      }

      var width = parseInt(postData.imgWidth);
      var height = parseInt(postData.imgHeight);

      var ratio = imageWidthInTile / width;
      var newWidth = imageWidthInTile;
      var newHeight = height * ratio;

      img.width = newWidth;
      img.height = newHeight;
      img.src = src + postData.image;
      anchor.appendChild(img);
      element.appendChild(anchor);
    }

    var anchor2 = document.createElement("a");
    anchor2.href = postData.link + "";
    // anchor2.target = "_blank";
    anchor2.target = "_self";
    anchor2.className = "title-anchor";

    var title = document.createElement("h1");
    title.innerHTML = postData.title;
    if (postData.siteDown == "true") {
      element.className = "tile site-down";
    }

    anchor2.appendChild(title);
    element.appendChild(anchor2);

    var content = document.createElement("div");
    content.innerHTML = postData.content;
    element.appendChild(content);

    isotopeObject.insert(element);
  }
}

init();
