HomePage.route = {
  path: '/',
  menuLabel: 'Home',
  index: 1
};

export default function HomePage() {
  return <>
    <section id="hero" className="flex flex-col">
      <div className="mt-24">
        <h1 className="">Upplev bio som aldrig förr</h1>
        <pre>
          Fördjupa dig i de senaste storfilmerna med toppmodern ljudteknik och fantastisk
          bild. Boka dina biljetter nu.
        </pre>
      </div>
    </section>
    <section>
      <div >
        <h2>Visas Nu</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo eius officia illo in non quam omnis quas dolores tenetur cum quaerat reiciendis id, provident voluptatum natus. Blanditiis, obcaecati expedita! Molestias?</p>
      </div>
    </section>
  </>;
}
