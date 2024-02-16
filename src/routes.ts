import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getAuthenticatedUser,
    refreshAuthToken,
    logoutUser
} from './controller/auth.controller';
import {addFavorites, getFavorites, removeFavorites} from './controller/books.controller';

export const routes = (router: Router) => {
    router.post('/api/register', registerUser);
    router.post('/api/login', loginUser);
    router.get('/api/user', getAuthenticatedUser);
    router.post('/api/refresh', refreshAuthToken);
    router.post('/api/logout', logoutUser);

    router.put('/api/add-favorite', addFavorites);
    router.post('/api/remove-favorite', removeFavorites);
    router.get('/api/get-favorites/:userId', getFavorites);
};
