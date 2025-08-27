import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Articles } from './pages/articles/articles';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Cart } from './pages/cart/cart';
import { AddArticle } from './pages/add-article/add-article';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'articles',
    component: Articles,
  },
  {
    path: 'articles/:category_id',
    component: Articles,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'contact',
    component: Contact,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'add-article',
    component: AddArticle,
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '',
  },
];
