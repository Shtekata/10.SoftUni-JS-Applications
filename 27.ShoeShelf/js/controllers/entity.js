import {
  getAllEntities,
  createEntity,
  checkResult,
  getEntityById,
  editEntity,
  collectEntity as apiCollect,
  deleteEntity as apiDelete,
} from '../data.js';
import { showInfo, showError } from '../notification.js';

export default async function home() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    homeLogIn: await this.load('./templates/home/homeLogIn.hbs'),
    homeLogOut: await this.load('./templates/home/homeLogOut.hbs'),
    shoe: await this.load('./templates/shoes/shoe.hbs'),
  };

  const context = Object.assign({}, this.app.userData);
  if (this.app.userData.email) {
    try {
      let entities = await getAllEntities();
      checkResult(entities);
      context.entities = entities.sort((x, y) => y.volume - x.volume);
    } catch (x) {
      showError(x.message);
    }
  }

  await this.partial('./templates/home/home.hbs', context);

  if (this.app.userData.email) {
    const shoes = document.querySelector('.shoes');
    shoes.addEventListener('click', (x) => {
      if (x.target.classList.contains('shoes')) return;
      const entityId = x.target.parentElement.lastElementChild.textContent;
      this.redirect(`#/details/${entityId}`);
    });
  }
}

export async function createGetEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  this.partial('./templates/shoes/create.hbs', this.app.userData);
}

export async function editGetEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const entity = await getEntityById(this.params.id);
  const context = Object.assign({ entity }, this.app.userData);

  await this.partial('./templates/shoes/edit.hbs', context);
}

export async function detailsEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const id = this.params.id;
  const userId = this.app.userData.userId;
  const userEmail = this.app.userData.email;
  const entity = await getEntityById(id);

  const peoplesGetThisItem = entity.peoplesGetThisItem.join(', ');
  if (peoplesGetThisItem.includes(userEmail)) {
    entity.getItem = true;
  }
  if (entity.ownerId === userId) {
    entity.isOwner = true;
  }
  const context = Object.assign({ entity }, this.app.userData);

  await this.partial('./templates/shoes/details.hbs', context);

  if (!entity.getItem && !entity.isOwner) {
    const getItemBtn = document.querySelector('#getItemBtn');
    getItemBtn.addEventListener('click', async (x) => {
      x.preventDefault();
      try {
        const result = await apiCollect(id, userEmail);
        checkResult(result);
        showInfo('Collect successfully');

        getItemBtn.textContent = `${result.volume} purchases`;
        context.entity.getItem = true;
        setTimeout(
          () => this.partial('./templates/shoes/details.hbs', context),
          2000
        );
      } catch (x) {
        showError(x.message);
      }
    });
  }
}

export async function collectEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const id = this.params.id;
  const userEmail = this.app.userData.email;
  try {
    const result = await apiCollect(id, userEmail);
    checkResult(result);
    showInfo('Collect successfully');

    const entity = await getEntityById(id);
    entity.getItem = true;
    const context = Object.assign({ entity }, this.app.userData);
    this.partial('./templates/shoes/details.hbs', context);
  } catch (x) {
    showError(x.message);
  }
}

export async function deleteEntity() {
  const id = this.params.id;
  try {
    const result = await apiDelete(id);
    checkResult(result);
    showInfo('Deleted successfully');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function createPostEntity() {
  let entity = {
    name: this.params.name,
    price: +this.params.price,
    imageUrl: this.params.imageUrl,
    description: this.params.description,
    brand: this.params.brand,
    volume: 0,
    peoplesGetThisItem: [],
  };

  try {
    if (entity.name.length < 1) {
      throw new Error('The name must be filled in!');
    }
    if (entity.price < 0) {
      throw new Error("Price can't be less than 0!");
    }
    if (entity.imageUrl.length < 1) {
      throw new Error('The image Url must be filled in!');
    }
    if (entity.description.length < 1) {
      throw new Error('The description must be filled in!');
    }
    if (entity.brand.length < 1) {
      throw new Error('The brand must be filled in!');
    }

    const result = await createEntity(entity);
    checkResult(result);

    showInfo('Created successfully!');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function editPostEntity() {
  const id = this.params.id;
  let entity = await getEntityById(id);

  entity.name = this.params.name;
  entity.price = +this.params.price;
  entity.imageUrl = this.params.imageUrl;
  entity.description = this.params.description;
  entity.brand = this.params.brand;

  try {
    if (entity.name.length < 1) {
      throw new Error('The name must be filled in!');
    }
    if (entity.price < 0) {
      throw new Error("Price can't be less than 0!");
    }
    if (entity.imageUrl.length < 1) {
      throw new Error('The image Url must be filled in!');
    }
    if (entity.description.length < 1) {
      throw new Error('The description must be filled in!');
    }
    if (entity.brand.length < 1) {
      throw new Error('The brand must be filled in!');
    }

    const result = await editEntity(id, entity);
    checkResult(result);

    showInfo('Eddited successfully');
    this.redirect(`#/details/${id}`);
  } catch (x) {
    showError(x.message);
  }
}
