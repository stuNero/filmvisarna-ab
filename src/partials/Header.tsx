import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../routes';

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice().sort((a, b) => a.path.length > b.path.length ? -1 : 1)
    .find(x => pathName.indexOf(x.path.split(':')[0]) === 0);

  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  return <header>
    <Link to="/">Filmvisarna</Link>
  </header>;
}