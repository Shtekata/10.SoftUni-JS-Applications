window.onpopstate = function (x) {
  console.log(document.location, x.state);
};

history.pushState({ page: 1 }, '', 'page-1');
history.pushState({ page: 2 }, '', 'page-2');
history.pushState({ page: 3 }, '', 'page-3');

history.back();
history.back();
history.forward();