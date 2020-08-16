import {
  getAll,
  createPost as dataCreatePost,
  checkResult,
  getPostById,
  editPost as dataEditPost,
  likePost as dataLikePost,
  deletePost as dataDeletePost,
} from '../data.js';
import { showInfo, showError } from '../notification.js';

export default async function home() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    post: await this.load('./templates/post/post.hbs'),
  };

  const context = Object.assign({}, this.app.userData);
  if (this.app.userData.email) {
    try {
      const posts = await getAll();
      posts.forEach(x => {
        if (x.ownerId === this.app.userData.userId) x.isOwner = true;
        else x.isOwner = false;
      });
      checkResult(posts);
      context.posts = posts;
    } catch (x) {
      showError(x.message);
    }
  }

  this.partial('./templates/home.hbs', context);
}

export async function createGet() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
  };

  this.partial('./templates/post/create.hbs', this.app.userData);
}

export async function editGet() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
  };

  const post = await getPostById(this.params.id);
  const context = Object.assign({ post }, this.app.userData);

  await this.partial('./templates/post/edit.hbs', context);
}

export async function detailsGet() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
  };

  const id = this.params.id;
  const post = await getPostById(id);
  const context = Object.assign({ post }, this.app.userData);

  await this.partial('./templates/post/details.hbs', context);
}

export async function like() {
  const id = this.params.id;
  try {
    const post = await getPostById(id);
    post.usersLiked.push(this.app.userData.email);

    const resultEdit = await dataEditPost(id, post);
    checkResult(resultEdit);

    const resultLike = await dataLikePost(id);
    checkResult(resultLike);
    showInfo('Liked successfully');

    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function deletePost() {
  const id = this.params.id;
  try {
    const result = await dataDeletePost(id);
    checkResult(result);
    showInfo('Deleted successfully');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function createPost() {
  let post = {
    title: this.params.title,
    category: this.params.category,
    content: this.params.content,
  };

  try {
    if (post.title.length < 1) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials'
      );
    }
    if (post.category.length < 1) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials'
      );
    }
    if (post.content.length < 1) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials'
      );
    }

    const result = await dataCreatePost(post);
    checkResult(result);

    showInfo('Created successfully!');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function editPost() {
  const id = this.params.id;
  let post = await getPostById(id);

  post.title = this.params.title;
  post.category = this.params.category;
  post.content = this.params.content;

  try {
    if (post.title.length < 1) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials'
      );
    }
    if (post.category.length < 1) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials'
      );
    }
    if (post.content.length < 1) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials'
      );
    }

    const result = await dataEditPost(id, post);
    checkResult(result);

    showInfo('Eddited successfully');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}
