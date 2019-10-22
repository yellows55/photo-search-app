"use strict";


$(watchForm);
$(showNext);
$(previous);

let pageNum = 1;
let pixabayKey = "13911244-3178ff11fe54cf01ae120bf07";
let unsplashKey = "ee4451ea95ad891e1eba06c26dd7709baf1aa2105db69c6bda9cfabbed9f2c1f";

function getPictures() {
  let pictureKey = $("input[type='text']").val();
  console.log(pictureKey);
  $('.search-results.hidden').removeClass('hidden');
  fetch (`https://pixabay.com/api/?key=${pixabayKey}&q=${pictureKey}&image_type=photo&page=${pageNum}&per_page=10`)
  .then(response => response.json())
  .then(responseJson => {
  displayPixabayPics(responseJson);
});
  fetch (`https://api.unsplash.com/search/photos/?client_id=${unsplashKey}&query=${pictureKey}&page=${pageNum}`)
  .then(response => response.json())
  .then(responseJson => {
  displayUnsplashPics(responseJson);
});
if(pageNum === 1) {
    $('.unsplash-results').append(`
  <button type="button" class="next-button">Next Page</button>`);
  }
  else {
    $('.unsplash-results').append(`
    <button type="button" class="prev-button">Previous Page</button>
    <button type="button" class="next-button">Next Page</button>`);
  }
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('.pixabay-results').empty();  
    $('.unsplash-results').empty();
    getPictures();
  });
}

function nextPage() {
  pageNum++;
  $('.pixabay-results').empty();
  $('.unsplash-results').empty();
  getPictures();
}

function prevPage() {
  pageNum--;
  $('.pixabay-results').empty();
  $('.unsplash-results').empty();
  getPictures();
}

const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : null),
    nestedObj
  );
}

function displayPixabayPics(obj) {
  let picList = obj.hits;
      //console.log(picList);
  for (let i=0; i < picList.length; i++)  {
    const imageUrl = getNestedObject(obj, ['hits', i, 'previewURL']);
    const alt = getNestedObject(obj, ['hits', i, 'tags']);
    const pageUrl = getNestedObject(obj, ['hits', i, 'pageURL']);
    //console.log(url);
    $('.pixabay-results').prepend(`
    <div class="image-display">
    <img src="${imageUrl}" alt = "${alt}"/>
    <a href="${pageUrl}" target="_blank">Pixabay Link</a>
    </div>`);
  }
}

function displayUnsplashPics(obj) {
  let picList = obj.results;
      console.log(picList);

  for (let i=0; i < picList.length; i++)  {
    const rawUrl = getNestedObject(obj, ['results', i, 'urls', 'raw']);
    const alt = getNestedObject(obj, ['results', i, 'alt_description']);
    const pageUrl = getNestedObject(obj, ['results', i, 'links', 'download'])
    $('.unsplash-results').prepend(`
    <div class="image-display">
    <img src="${rawUrl}&w=150&h=150" alt = "${alt}"/>
    <a href="${pageUrl}" target="_blank">Unsplash Link</a>
    </div>`);
  }
  
  /*$('.unsplash-results').append(`
  <button type="button" class="next-button">Next</button>`);*/
}

function showNext() {
  $('.search-results').on('click', '.next-button', function(event) {
    event.preventDefault();
    nextPage();
  })
}

function previous() {
  $('.search-results').on('click', '.prev-button', function(event) {
    event.preventDefault();
    prevPage();
  })
}



