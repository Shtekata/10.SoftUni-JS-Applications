let busStop = null;
let currentId = 'depot';

function solve() {
  const stopInfoEl = document.querySelector('span.info');
  const departEl = document.querySelector('input#depart');
  const arriveEl = document.querySelector('input#arrive');

  function depart() {
    const url = `https://judgetests.firebaseio.com/schedule/${currentId}.json`;
    fetch(url)
      .then((x) => x.json())
      .then((x) => showBusInfo(x));

    function showBusInfo(x) {
      busStop = x.name;
      currentId = x.next;
      stopInfoEl.textContent = `Next Stop ${busStop}`;
      switchBusState();
    }
  }

  function arrive() {
    stopInfoEl.textContent = `Arriving at ${busStop}`;
    switchBusState();
  }

  function switchBusState() {
    const { disabled: isDisabled } = arriveEl;
    if (isDisabled) {
      arriveEl.disabled = false;
      departEl.disabled = true;
    } else {
      arriveEl.disabled = true;
      departEl.disabled = false;
    }
  }

  return {
    depart,
    arrive,
  };
}

let result = solve();
