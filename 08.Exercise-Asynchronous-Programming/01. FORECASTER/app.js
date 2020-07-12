import el from './dom.js';
import * as data from './data.js';

const symbols = {
  Sunny: '&#x2600;',
  'Partly sunny': '&#x26C5;',
  Overcast: '&#x2601;',
  Rain: '&#x2614;',
  Degrees: '&#176;',
};

const input = document.querySelector('#location');
const mainDiv = document.querySelector('#forecast');
const todayDiv = document.querySelector('#current');
const upcomingDiv = document.querySelector('#upcoming');

window.addEventListener('load', () => {
  document.querySelector('#submit').addEventListener('click', getForecast);

  async function getForecast() {
    const locationName = input.value;
    input.value = '';

    let code;
    try {
      code = await data.getCode(locationName);
    } catch (error) {
      input.value = 'Error';
      return;
    }
    //   const result = await Promise.all([
    //     data.getToday(code),
    //     data.getUpcomming(code),
    //   ]);
    const todayP = data.getToday(code);
    const upcomingP = data.getUpcomming(code);
    const [today, upcoming] = [await todayP, await upcomingP];

    const symbolSpan = el('span', '', { className: 'condition symbol' });
    symbolSpan.innerHTML = symbols[today.forecast.condition];
    const degreeSpan = el('span', '', { className: 'forecast-data' });
    degreeSpan.innerHTML = `${today.forecast.low}${symbols.Degrees}/${today.forecast.high}${symbols.Degrees}`;

    todayDiv.innerHTML = '';
    todayDiv.appendChild(
      el(
        'div',
        [
          symbolSpan,
          el(
            'span',
            [
              el('span', today.name, { className: 'forecast-data' }),
              degreeSpan,
              el('span', today.forecast.condition, {
                className: 'forecast-data',
              }),
            ],
            {
              className: 'condition',
            }
          ),
        ],
        {
          className: 'forecast',
        }
      )
    );

    const forecastInfoDiv = el(
      'div',
      //   upcoming.forecast.map((x) => renderUpcoming(x)),
      upcoming.forecast.map(renderUpcoming),
      { className: 'forecast-info' }
    );
    upcomingDiv.innerHTML = '';
    upcomingDiv.appendChild(forecastInfoDiv);

    mainDiv.style.display = '';
  }

  function renderUpcoming(forecast) {
    const symbolSpan = el('span', '', { className: 'symbol' });
    symbolSpan.innerHTML = symbols[forecast.condition];
    const degreeSpan = el('span', '', { className: 'forecast-data' });
    degreeSpan.innerHTML = `${forecast.low}${symbols.Degrees}/${forecast.high}${symbols.Degrees}`;

    const result = el(
      'span',
      [
        symbolSpan,
        degreeSpan,
        el('span', forecast.condition, { className: 'forest-data' }),
      ],
      {
        className: 'upcoming',
      }
    );

    return result;
  }
});
