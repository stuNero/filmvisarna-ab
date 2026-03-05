import type Route from './interfaces/Route.ts';
import { createElement } from 'react';

// page components
import HomePage from './pages/HomePage.tsx';
import MovieDetailShowingsPage from './pages/MovieDetailShowingsPage.tsx';
import SeatSelectionPage from './pages/SeatSelectionPage.tsx';
import BookingConfirmationPage from './pages/BookingConfirmationPage.tsx';
import CancelBookingPage from './pages/CancelBookingPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import KioskInfoPage from './pages/KioskPage.tsx';
import LocaleDetailsPage from './pages/LocaleDetailsPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

export default [
  HomePage,
  MovieDetailShowingsPage,
  SeatSelectionPage,
  BookingConfirmationPage,
  CancelBookingPage,
  LoginPage,
  ProfilePage,
  KioskInfoPage,
  LocaleDetailsPage,
  NotFoundPage,
]
  // map the route property of each page component to a Route
  .map((x) => ({ element: createElement(x), ...x.route }) as Route)
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));
