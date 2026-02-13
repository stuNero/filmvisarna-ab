import { Link, useLocation } from "react-router-dom";

NotFoundPage.route = {
  path: '*'
};

export default function NotFoundPage() {
  return <>
    <h2>Inte hittad: 404</h2>
    <p>
      Vi ber om ursäkt det verkar inte finnas något på denna sidan som matchar din url:
    </p>
    <p><strong>{useLocation().pathname.slice(1)}</strong></p>
    <p><Link to="/">Gå till start sidan</Link> istället.</p>
  </>;
}