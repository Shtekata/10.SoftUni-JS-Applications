function host(endpoint) {
  return `https://judgetests.firebaseio.com/${endpoint}.json`;
}

const api = {
  locations: 'locations',
  today: 'forecast/today/',
  upcoming: 'forecast/upcoming/',
};

export async function getCode(name) {
  const data = await fetch(host(api.locations)).then((x) => x.json());

  const code = data.find((x) => x.name.toLowerCase() == name.toLowerCase())
    .code;
  return code;
}

export async function getToday(code) {
  const data = await fetch(host(api.today + code)).then((x) => x.json());
  return data;
}

export async function getUpcomming(code) {
  const data = await fetch(host(api.upcoming + code)).then((x) => x.json());
  return data;
}
