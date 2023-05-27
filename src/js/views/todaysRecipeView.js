import View from './View';

import icons from 'url:../../img/icons.svg';

class TodaysView extends View {
  _parentElement = document.querySelector('.card');
  _errorMessage = 'No suggestion found for today!';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.card__content');
      if (!btn) return;

      handler();
    });
  }
  _generateMarkup() {
    return `             
    <div class="card card__content">       
     <h4 class="card__content-title">Suggestion!</h4>  
    <img class="card__content-img" src="${this._data.image}" alt="${this._data.title}"  />

      <p class="card__content-recipe">${this._data.title}</p>
      <p class="card__content-publisher">${this._data.publisher}</p>
    </div>       
    `;
  }
}

export default new TodaysView();
