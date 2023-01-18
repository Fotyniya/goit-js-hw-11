import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createMarkup } from './partials/markup.js';

const API_KEY = '32817596-3735423159e4b61dcdcaf4a45';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
const per_page = 40;

const fieldSearch = document.querySelector('[name = searchQuery]');
const submitBtn = document.querySelector('button');
const imgContainer = document.querySelector('.gallery');
const btnNextRequest = document.querySelector('.load-more');

fieldSearch.addEventListener('input', event => {
    if (!fieldSearch.value){
        onClearMarkup();
      
    }
});

submitBtn.addEventListener('click', evt => {
    evt.preventDefault();
    
    onRequest();
});

async function onRequest() {
    onClearMarkup();
    try {
        
        let resp = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${fieldSearch.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
        Notify.success(`Hooray! We found ${resp.data.totalHits} images.`)
        
        let imagesMarkup = createMarkup(resp.data.hits);
        imgContainer.insertAdjacentHTML('beforeEnd', imagesMarkup);
        let gallery = new SimpleLightbox('.gallery a');
        btnNextRequest.style.visibility = 'visible';
        btnNextRequest.addEventListener('click', async event => {
            if (page < Math.ceil(resp.data.totalHits/per_page)){
                page += 1;
                resp = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${fieldSearch.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
                imagesMarkup = createMarkup(resp.data.hits);
                imgContainer.insertAdjacentHTML('beforeEnd', imagesMarkup);
                gallery = new SimpleLightbox('.gallery a');
                gallery.refresh();
                smoothScroll ();
                console.log(page)
            } else {
                Notify.warning("We're sorry, but you've reached the end of search results.")
                btnNextRequest.style.visibility = 'hidden';
            } 
        });
        if (resp.data.totalHits === 0){
            throw new Error (resp.data.statusText);
        }
    } catch (error) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }   
}

function onClearMarkup() {
    imgContainer.innerHTML = "";  
    btnNextRequest.style.visibility = 'hidden';
      
}
function smoothScroll () {
    const { height: cardHeight } = imgContainer.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    }); 
}

