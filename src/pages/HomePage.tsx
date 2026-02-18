HomePage.route = {
  path: '/',
  menuLabel: 'Home',
  index: 1
};

export default function HomePage() {
  return <div className="hero flex flex-col 
                        ">
    <section className="bg-[url('/bg-image.svg')]
                        bg-center
                        top-0 bottom-0 left-0
                        content-center
                        h-[75vh]
                        ">
      <div className="">
        <h1 className="text-3xl">Upplev bio som aldrig förr</h1>
        <p>
          Fördjupa dig i de senaste storfilmerna med toppmodern ljudteknik och fantastisk bild. Boka dina biljetter nu.
        </p>
      </div>
    </section>
    <section>
      <div >
        <h2>Visas Nu</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo eius officia illo in non quam omnis quas dolores tenetur cum quaerat reiciendis id, provident voluptatum natus. Blanditiis, obcaecati expedita! Molestias?</p>
      </div>
    </section>
  </div>;
}
