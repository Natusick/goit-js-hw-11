import ImagesApiService from './apiServece';
import imgCardsTemplates from '../templates/imageCards.hbs';
import getRefs from '../getRefs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

const imagesApiService = new ImagesApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.buttonEl.addEventListener('click', onSearch);

async function onSearch(evt) {
  evt.preventDefault();

  imagesApiService.searchQuery = refs.searchFormEl.searchQuery.value;

  const getImages = await imagesApiService.fetchImg();

  if (getImages.hits.length === 0) {
    Notify.failure(`😔 Sorry, there are no images matching your search query. Please try again.`);
  } else {
    Notify.success(`🙂 Hooray! We found ${getImages.totalHits} images`);

    clearGallery();
    imagesApiService.resetPage();

    const galleryMarkup = imgCardsTemplates(getImages.hits);
    galleryCardsMarkup(galleryMarkup);

    lightbox.refresh();
  }
}

function clearGallery() {
  refs.containerEl.innerHTML = '';
}

function galleryCardsMarkup(items) {
  refs.containerEl.insertAdjacentHTML('beforeend', items);
}

const onEntry = entries => {
  entries.forEach(async entry => {
    try {
      if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
        console.log('😉 Loading more pictures!');

        imagesApiService.incrementPage();

        const getImages = await imagesApiService.fetchImg();

        const galleryMarkup = imgCardsTemplates(getImages.hits);
        galleryCardsMarkup(galleryMarkup);

        lightbox.refresh();
        infScroll();
      }
    } catch {
      Notify.warning(`😔 We're sorry, but you've reached the end of search results.`);
    }
  });
};

const options = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.loadingEl);

function infScroll() {
  const { height: cardHeight } = document
    .querySelector('.card')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
