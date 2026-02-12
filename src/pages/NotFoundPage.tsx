import { Link, useLocation } from "react-router-dom";

NotFoundPage.route = {
  path: '*'
};

export default function NotFoundPage() {
  return <>
    <section id="notFoundCtn" className="flex flex-col max-w-7xl">
      <div id="notFoundTxt">
        <h2>Inte hittad: 404</h2><br />
        <p>
          Vi ber om ursäkt det verkar inte finnas något på denna sidan som matchar din url:
        </p><br />
        <p><strong>{useLocation().pathname.slice(1)}</strong></p><br />
        <p id="notFoundLinkTxt"><Link to="/">Gå till start sidan</Link> istället.</p>
      </div>
    </section>
  </>;
}