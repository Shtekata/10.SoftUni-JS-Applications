import { html, render } from '../node_modules/lit-html/lit-html.js';
import { repeat } from '../node_modules/lit-html/directives/repeat.js';
import { classMap } from '../node_modules/lit-html/directives/class-map.js';

const getCarouselTemplate = (x) => html` <style>
    .carousel-container {
      max-width: 60rem;
      position: relative;
      margin: 0 auto;
    }

    .carousel-controls {
      text-align: center;
    }

    .carousel-slide {
      display: none;
    }

    .carousel-slide > img {
      width: 100%;
    }

    /* Next & previous buttons */

    .prev,
    .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
      user-select: none;
    }

    /* Position the "next button" to the right */

    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    /* On hover, add a black background color with a little bit see-through */

    .prev:hover,
    .next:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    /* Caption text */

    .text {
      color: #f2f2f2;
      font-size: 15px;
      padding: 8px 12px;
      position: absolute;
      bottom: 8px;
      width: 100%;
      text-align: center;
    }

    /* Number text (1/3 etc) */

    .numbertext {
      color: #f2f2f2;
      font-size: 12px;
      padding: 8px 12px;
      position: absolute;
      top: 0;
    }

    /* The dots/bullets/indicators */
    .carousel-controls > .dot {
      cursor: pointer;
      height: 15px;
      width: 15px;
      margin: 0 2px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
    }

    .active,
    .dot:hover {
      background-color: #717171;
    }

    /* Fading animation */

    .fade {
      -webkit-animation-name: fade;
      -webkit-animation-duration: 1.5s;
      animation-name: fade;
      animation-duration: 1.5s;
    }

    @-webkit-keyframes fade {
      from {
        opacity: 0.4;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes fade {
      from {
        opacity: 0.4;
      }

      to {
        opacity: 1;
      }
    }
  </style>
  <div class="carousel-container">
    ${repeat(x.items, x.indexKeyFn, x.itemRenderFn)}
    <a class="prev" @click=${x.prevClickHandler}>&#10094;</a>
    <a class="next" @click=${x.nextClickHandler}>&#10095;</a>
  </div>
  <div class="carousel-controls" @click=${x.dotClickHandler}>
    ${repeat(x.items, (_, i) => i, x.dotRenderFn)}
  </div>`;

class Carousel extends HTMLElement {
  constructor() {
    super();

    this.activIndex = 0;
    this.updateItems();
    const root = this.attachShadow({ mode: 'closed' });

    this.itemRenderFn = (x, index) => {
      const classes = {
        active: index === this.activIndex,
        'carousel-slide': true,
      };
      return html`<article class=${classMap(classes)}>
        <p class="number-text">${index} / ${this.items.length}</p>
        <img src=${x.src} alt=${x.alt} />
        <p class="caption-text">${x.caption}</p>
      </article>`;
    };

    this.dotRenderFn = (_, index) => {
      const classes = {
        active: index === this.activIndex,
        'dot': true,
      };
      return html`<span data-index=${index} class=${classMap(classes)}></span>`;
    };

    this._update = () => {
      const templateResult = getCarouselTemplate(this);
      render(templateResult, root, { eventContext: this });
    };
    this._update();
  }

  updateItems() {
    this.items = Array.from(this.children).map((x) => {
      return {
        src: x.getAttribute('src'),
        alt: x.getAttribute('alt'),
        caption: x.getAttribute('caption'),
      };
    });
  }

  indexKeyFn(_, index) {
    return index;
  }

  prevClickHandler() {}

  nextClickHandler() {}

  dotClickHandler() {}
}

customElements.define('app-carousel', Carousel);
