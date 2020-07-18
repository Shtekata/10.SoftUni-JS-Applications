(function () {
  const appEl = document.querySelector('#app');

  function render(template, data) {
    appEl.innerHTML = template(data);
  }

  function init() {
    Promise.all([
      fetch('./contact-card.hbs').then((x) => x.text()),
      fetch('./contacts.hbs').then((x) => x.text()),
      fetch('./contacts.json').then((x) => x.json()),
    ]).then(([contactCardTemplateString, contactsTemplateString, contacts]) => {
      Handlebars.registerPartial('contact', contactCardTemplateString);
      const template = Handlebars.compile(contactsTemplateString);

      contacts = contacts.map((x) => ({ ...x, hidden: true }));
      render(template, { contacts });
      //appEl.innerHTML = template({ contacts });

      //   const contactsEl = document.querySelector('#contacts');
      appEl.addEventListener('click', (x) => {
        const target = x.target;
        if (!target.classList.contains('detailsBtn')) return;
        const el = target.parentElement.querySelector('.details');
        el.classList.contains('hidden')
          ? el.classList.remove('hidden')
          : el.classList.add('hidden');

        const contact = contacts.find((x) => x.id === +el.id);
        if (!contact) return;
        contact.hidden = !contact.hidden;
        // render(template, { contacts });
      });
    });
  }

  init();
})();
