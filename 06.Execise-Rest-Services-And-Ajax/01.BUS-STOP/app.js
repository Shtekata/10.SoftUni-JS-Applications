function getInfo() {
  const elements = {
    stopId() {
      return document.querySelector('input#stopId');
    },
    stopName() {
      return document.querySelector('div#stopName');
    },
    buses() {
      return document.querySelector('ul#buses');
    },
  };
  elements.stopName().textContent = '';
  const busesElements = elements.buses().children;
  if (busesElements.length > 0) {
    [...busesElements].forEach((x) => x.remove());
  }
  const stopId = elements.stopId().value;
  const validUrls = ['1287', '1308', '1327', '2334'];

  if (!validUrls.includes(stopId)) {
    elements.stopName().textContent = 'Error';
    return;
  }
  const url = `https://judgetests.firebaseio.com/businfo/${stopId}.json`;

  fetch(url)
    .then((x) => x.json())
    .then((x) => showInfo(x));

  function showInfo(data) {
    elements.stopName().textContent = data.name;
    const buses = data.buses;
    Object.keys(buses).forEach((x) => {
      const li = document.createElement('li');
      li.textContent = `Bus ${x} arrives ${buses[x]} minutes`;
      elements.buses().appendChild(li);
    });
  }
}
