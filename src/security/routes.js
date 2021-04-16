import Home from "views/Home.jsx"
import Spectate from "views/Spectate.jsx"

const dashboardRoutes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    layout: 'topBar',
  },
  {
    path: '/spectate',
    name: 'Spectate',
    component: Spectate,
    layout: 'topBar',
  },
];

export default dashboardRoutes;
