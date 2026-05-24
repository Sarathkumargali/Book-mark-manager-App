const bookmarkContainer = document.getElementById("bookmarkContainer");
const sidebarContainer = document.getElementById("sidebarContainer");
const searchInput = document.getElementById("searchInput");
let bookmarks = []; // Global variable to store bookmarks data
async function fetchBookmarks() {
  try {
    // Fetch the data from the JSON file
    const response = await fetch("./data.json");
    console.log(response);
    // Check if the response is successful (status code 200-299), handling the http error if not
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    bookmarks = data.bookmarks;
    console.log(bookmarks);
    // Call the function to render bookmarks
    // renderBookmarks(bookmarks)''
    renderBookmarksFn(bookmarks);
    rendersidebarTags(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
  }
}

// Call the function to fetch bookmarks when the page loads
fetchBookmarks();

function renderBookmarks(bookmarks) {
  let cardsHtml = "";
  console.log("dynamically rendering bookmarks");
  for (let i = 0; i < bookmarks.length; i++) {
    let bookmark = bookmarks[i];
    console.log(bookmark);
    cardsHtml += `
          <div class="bookmark-card">
              <div class="card-main-cnt">
                <div class="card-header">
                  <div class="card-logo">
                    <div class="org-logo">
                      <img
                        src="${bookmark.favicon}"
                        alt="${bookmark.title}"
                      />
                    </div>
                    <div class="org-title">
                      <h3>${bookmark.title}</h3>
                      <span>${bookmark.url}</span>
                    </div>
                  </div>
                  <div class="edit-dtls">
                    <img src="./assets/images/icon-menu-bookmark.svg" alt="" />
                  </div>
                </div>
                <div class="card-content">
                  <p>
                    ${bookmark.description}
                  </p>
                </div>
                <div class="card-tags">`;
    for (let j = 0; j < bookmark.tags.length; j++) {
      cardsHtml += `<span class="tag">${bookmark.tags[j]}</span>`;
    }
    cardsHtml += `  
                 </div>
              </div>
              <div class="card-footer">
                <div class="card-details">
                  <div class="footer-item card-view-count">
                    <img src="./assets/images/icon-visit-count.svg" alt="" />
                    <span>${bookmark.visitCount}</span>
                  </div>
                  <div class="footer-item card-last-seen">
                    <img src="./assets/images/icon-last-visited.svg" alt="" />
                    <span>${formatDate(bookmark.lastVisited)}</span>
                  </div>
                  <div class="footer-item card-published">
                    <img src="./assets/images/icon-created.svg" alt="" />
                    <span>${formatDate(bookmark.createdAt)}</span>
                  </div>
                </div>
                <div class="card-status">
                   ${bookmark.pinned ? `<img src="./assets/images/icon-pin.svg" alt="">` : ""}
                </div>
              </div>
            </div>`;
  }
  bookmarkContainer.innerHTML = cardsHtml;
}
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

// fetch renderBookmarks with functional programming approach

function renderBookmarksFn(bookmarks) {
  const cardsHtml = bookmarks
    .map((bookmark) => createBookmarkCard(bookmark))
    .join("");

  bookmarkContainer.innerHTML = cardsHtml;
}

function createBookmarkCard(bookmark) {
  return `<div class="bookmark-card">
              <div class="card-main-cnt">
                <div class="card-header">
                  <div class="card-logo">
                    <div class="org-logo">
                      <img
                        src="${bookmark.favicon}"
                        alt="${bookmark.title}"
                      />
                    </div>
                    <div class="org-title">
                      <h3>${bookmark.title}</h3>
                      <span>${bookmark.url}</span>
                    </div>
                  </div>
                  <div class="edit-dtls">
                    <img src="./assets/images/icon-menu-bookmark.svg" alt="" />
                  </div>
                </div>
                <div class="card-content">
                  <p>
                    ${bookmark.description}
                  </p>
                </div>
                <div class="card-tags"> 
                 ${createTags(bookmark.tags)}
                 </div>
              </div>
              <div class="card-footer">
                <div class="card-details">
                  <div class="footer-item card-view-count">
                    <img src="./assets/images/icon-visit-count.svg" alt="" />
                    <span>${bookmark.visitCount}</span>
                  </div>
                  <div class="footer-item card-last-seen">
                    <img src="./assets/images/icon-last-visited.svg" alt="" />
                    <span>${formatDate(bookmark.lastVisited)}</span>
                  </div>
                  <div class="footer-item card-published">
                    <img src="./assets/images/icon-created.svg" alt="" />
                    <span>${formatDate(bookmark.createdAt)}</span>
                  </div>
                </div>
                <div class="card-status">
                   ${bookmark.pinned ? `<img src="./assets/images/icon-pin.svg" alt="">` : ""}
                </div>
              </div>
            </div>`;
}

function createTags(tags) {
  return tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

// dynamically render sidebar tags using the normal approach

//Brute force approach to get all unique tags and their count
function getAllTags(bookmarks) {
  const allTags = bookmarks.map((bookmark) => bookmark.tags);
  const flattenedTags = [];
  const tagsCount = [];
  allTags.forEach((tags) => {
    tags.forEach((tag) => {
      flattenedTags.push(tag);
    });
  });
  const uniqueTags = [];
  flattenedTags.forEach((tag) => {
    if (!uniqueTags.includes(tag)) {
      uniqueTags.push(tag);
    }
  });
  console.log(uniqueTags);
  console.log(flattenedTags);

  uniqueTags.forEach((tag) => {
    let tagCount = flattenedTags.filter((t) => t === tag).length;
    tagsCount.push({ tagName: tag, count: tagCount });
  });
  console.log(tagsCount);
}

// Normal approach to get  all unique tags and their count
function rendersidebarTags(bookmarks) {
  const tagCountMap = getTagsCount(bookmarks);
  let sidebarHtml = "";
  for (let tag in tagCountMap) {
    sidebarHtml += `<div class="tag-item">
            <div class="tag-item-cnt">
              <input type="checkbox" value="${tag}" />
              <span>${tag}</span>
            </div>
            <div class="tag-item-count">
              <span>${tagCountMap[tag]}</span>
            </div>
          </div>
    `;
  }
  sidebarContainer.innerHTML = sidebarHtml;
}
function getTagsCount(bookmarks) {
  const tagCountMap = {};
  bookmarks.forEach((bookmark) => {
    bookmark.tags.forEach((tag) => {
      if (tagCountMap[tag]) {
        tagCountMap[tag]++;
      } else {
        tagCountMap[tag] = 1;
      }
    });
  });
  // const tagsCount = Object.keys(tagCountMap).map((tag)=>({tagName:tag,count:tagCountMap[tag]}));
  // console.log(tagsCount);
  return tagCountMap;
}

// SEARCH FUNCTIONALITY

// Normal approach to filter bookmarks based on search input
searchInput.addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase().trim();

  if (searchTerm === "") {
    renderBookmarksFn(bookmarks);
    return;
  }

  let filterbookmarks = [];
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].title.toLowerCase().includes(searchTerm)) {
      filterbookmarks.push(bookmarks[i]);
    }
  }
  console.log(searchTerm);
  console.log(filterbookmarks);
  renderBookmarksFn(filterbookmarks);
});