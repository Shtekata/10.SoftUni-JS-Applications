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
    article: await this.load('./templates/article/article.hbs'),
    noArticles: await this.load('./templates/article/noArticles.hbs'),
  };

  const context = Object.assign({}, this.app.userData);
  if (this.app.userData.email) {
    try {
      let entities = await getAllEntities();
      checkResult(entities);

      const jsArticles = entities
        .filter((x) => x.category === 'JavaScript')
        .sort((x, y) => x.title.localeCompare(y.title));
      const cSharpArticles = entities
        .filter((x) => x.category === 'C#')
        .sort((x, y) => x.title.localeCompare(y.title));
      const javaArticles = entities
        .filter((x) => x.category === 'Java')
        .sort((x, y) => x.title.localeCompare(y.title));
      const pytonArticles = entities
        .filter((x) => x.category === 'Pyton')
        .sort((x, y) => x.title.localeCompare(y.title));

      context.jsArticles = jsArticles;
      context.cSharpArticles = cSharpArticles;
      context.javaArticles = javaArticles;
      context.pytonArticles = pytonArticles;
    } catch (x) {
      showError(x.message);
    }
  }

  await this.partial('./templates/home/home.hbs', context);

  if (this.app.userData.email) {
    const content = document.querySelector('.content');
    content.addEventListener('click', (x) => {
      if (x.target.classList.contains('btn details-btn')) {
        const entityId = x.target.parentElement.lastElementChild.textContent;
        this.redirect(`#/details/${entityId}`);
      }
    });
  }
}

export async function createGetEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  this.partial('./templates/article/create.hbs', this.app.userData);
}

export async function editGetEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const entity = await getEntityById(this.params.id);
  const context = Object.assign({ entity }, this.app.userData);

  await this.partial('./templates/article/edit.hbs', context);
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

  // isGetThisItem(entity, userEmail);
  if (entity.ownerId === userId) {
    entity.isOwner = true;
  }
  const context = Object.assign({ entity }, this.app.userData);

  await this.partial('./templates/article/details.hbs', context);

  //   if (!entity.getItem && !entity.isOwner) {
  //     const getItemBtn = document.querySelector('#getItemBtn');
  //     getItemBtn.addEventListener('click', async (x) => {
  //       x.preventDefault();
  //       try {
  //         const result = await apiCollect(entity, userEmail);
  //         checkResult(result);
  //         showInfo('Collect successfully');

  //         getItemBtn.textContent = `${result.volume} purchases`;
  //         context.entity.getItem = true;
  //         setTimeout(
  //           () => this.partial('./templates/article/details.hbs', context),
  //           2000
  //         );
  //       } catch (x) {
  //         showError(x.message);
  //       }
  //     });
  //   }
}

function isGetThisItem(entity, userEmail) {
  const peoplesGetThisItem = entity.peoplesGetThisItem.join(', ');
  if (peoplesGetThisItem.includes(userEmail)) {
    entity.getItem = true;
  }
  return entity;
}

export async function collectEntity() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const id = this.params.id;
  const userEmail = this.app.userData.email;
  const entity = await getEntityById(id);
  isGetThisItem(entity, userEmail);
  if (entity.getItem) return;

  try {
    const result = await apiCollect(entity, userEmail);
    checkResult(result);
    showInfo('Collect successfully');

    entity.getItem = true;
    const context = Object.assign({ entity }, this.app.userData);
    this.partial('./templates/article/details.hbs', context);
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
    title: this.params.title,
    content: this.params.content,
    category: this.params.category,
    // peoplesGetThisItem: [],
  };

  try {
    if (entity.title.length < 1) {
      throw new Error('The name must be filled in!');
    }
    if (entity.content.length < 1) {
      throw new Error('The content must be filled in!');
    }
    if (entity.category.length < 1) {
      throw new Error('The category must be filled in!');
    }
    if (
      entity.category !== 'JavaScript' &&
      entity.category !== 'C#' &&
      entity.category !== 'Java' &&
      entity.category !== 'Pyton'
    ) {
      throw new Error('The category is not valid!');
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

  entity.title = this.params.title;
  entity.content = this.params.content;
  entity.category = this.params.category;

  try {
    if (entity.title.length < 1) {
      throw new Error('The name must be filled in!');
    }
    if (entity.content.length < 1) {
      throw new Error('The content must be filled in!');
    }
    if (entity.category.length < 1) {
      throw new Error('The category must be filled in!');
    }

    const result = await editEntity(id, entity);
    checkResult(result);

    showInfo('Eddited successfully');
    this.redirect(`/`);
  } catch (x) {
    showError(x.message);
  }
}

export async function test() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  await this.partial('./templates/test.hbs');
}
