import { html, render } from '../node_modules/lit-html/lit-html.js';

const sliderHTMLTemplate = (ctx) => html`
  <style>
    .slider-container {
      font-family: 'Montserrat', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100px;
    }

    .slider-percentage-value {
      font-weight: bold;
      text-align: center;
      margin: 1em 0;
    }

    .slider {
      -webkit-appearance: none;
      width: 100%;
      height: 15px;
      border-radius: 5px;
      background: #d3d3d3;
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      margin: 0 1em;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #4caf50;
      cursor: pointer;
    }

    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #4caf50;
      cursor: pointer;
    }
  </style>
  <div class="slider-container">
    <input
      class="slider"
      type="range"
      @input=${ctx.sliderInputHandler}
      value="${ctx.value}"
      step="${ctx.step}"
    />
    <div class="slider-end">
      Percentage: <span class="slider-percentage-value">${ctx.percentage}</span>
    </div>
  </div>
`;
class Slider extends HTMLElement {
  static get observedAttributes() {
    return ['step', 'value', 'is-inverted'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'is-inverted') name = 'isInverted';
    this.state[name] = newValue;
    if (name === 'value') this.state.percentage = this.percentage;

    if (
      (name === 'isInverted' && newValue === 'true') ||
      (name === 'value' && this.state.isInverted === 'true')
    ) {
      const value = 100 - Number(this.getAttribute('value') || '0');
      this.state.value = value;
    }

    this._update();
  }

  constructor() {
    super();
    const self = this;
    this.state = {
      //   step: this.step,
      step: 0.1,
      //   value: this.value,
      value: '0',
      percentage: null,
      //   get percentage() {
      //     return self.percentage;
      //   },
      isInverted: 'false',
      sliderInputHandler: this.sliderInputHandler,
    };
    this.state.percentage = this.percentage;

    const root = this.attachShadow({ mode: 'closed' });

    this._update = () =>
      render(sliderHTMLTemplate(this.state), root, { eventContext: this });

    this._update();
  }

  //   get step() {
  //     return this.getAttribute('step') || '0.1';
  //   }

  //   get value() {
  //     if (this.isInverted) {
  //       return 100 - Number(this.getAttribute('value') || '0');
  //     }

  //     return this.getAttribute('value') || '0';
  //   }

  get percentage() {
    let calcPercentage = (Number(this.state.value || '0') / 100) * 100;

    // if (this.state.isInverted === 'true') {
    //   calcPercentage = ((100 - Number(this.state.value || '0')) / 100) * 100;
    // }

    return `${calcPercentage.toFixed(2)} %`;
  }

  //   get isInverted() {
  //     return this.hasAttribute('invert');
  //   }

  sliderInputHandler(e) {
    this.state.value = e.target.value;
    let percentage = (Number(this.state.value) / 100) * 100;

    if (this.state.isInverted === 'true') {
      percentage = ((100 - Number(this.state.value)) / 100) * 100;
    }

    this.state.percentage = `${percentage.toFixed(2)} %`;

    this._update();
  }
}

customElements.define('app-slider', Slider);
