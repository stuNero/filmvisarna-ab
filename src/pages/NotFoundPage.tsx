import { Link, useLocation } from "react-router-dom";

NotFoundPage.route = {
  path: '*'
};

export default function NotFoundPage() {

  const pStyling = "py-[25px] px-0 text-[1.2rem] font-bold";

  return <>
    <section className="flex flex-col max-w-7xl min-h-[75vh] justify-center bg-[url(/404.png)] bg-contain bg-center bg-local bg-no-repeat">
      <div className="py-0 px-[100px] content-evenly">
        <h2 className="py-[50px] px-0 text-[2rem] font-bold">Inte hittad: 404</h2><br />
        <p className={pStyling}>
          Vi ber om ursäkt det verkar inte finnas något på denna sidan som matchar din url:
        </p><br />
        <p className={pStyling}><strong>{useLocation().pathname.slice(1)}</strong></p><br />
        <Link to="/" className={pStyling + "text-fg-brand transition-all duration-200 ease-in-out font-bold hover:text-red-800 hover:[text-shadow:3px_3px_10px_hsl(0,0%,30%)]"}>Gå till start sidan istället.</Link>
      </div>
    </section>
  </>;
}