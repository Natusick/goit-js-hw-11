export default function getRefs() {
    return {
        searchFormEl: document.querySelector('.search-form'),
        containerEl: document.querySelector('.gallery'),
        buttonEl: document.querySelector('[type="submit"]'),
        loadingEl: document.querySelector('#loading')
    };
}
