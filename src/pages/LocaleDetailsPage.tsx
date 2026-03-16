LocaleDetailsPage.route = {
  path: '/om-oss',
  menuLabel: 'Om Oss'
};

export default function LocaleDetailsPage() {
  return (
    <>
      <section>
      
      {/* Hero Section */}
      <div className="relative h-96 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=1920"
          alt="Cinema Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <p className="text-5xl md:text-7xl font-bold mb-6">
            Om CineSharp
          </p>
          <p  className="text-xl md:text-2xl text-gray-300 max-w-3xl">
            Din moderna biograf med den senaste teknologin och högsta komforten
          </p>
        </div>
      </div>
        
      </section>

      <section>
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Våra Salar</h2>
          <div className="h-1 w-24 border-4 rounded-lg border-red-800 "/>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
<div>
              <h3 className="text-2xl font-semibold mb-2">Sal 1 - IMAX</h3>
              <p className="text-gray-700 mb-4">
                Vår största sal med IMAX-teknologi för en fantastisk filmupplevelse
              </p>
</div>
<div>
              <h3 className="text-2xl font-semibold mb-2">Sal 1 - IMAX</h3>
              <p className="text-gray-700 mb-4">
                Vår största sal med IMAX-teknologi för en fantastisk filmupplevelse
              </p>
</div>
          </div>
        </div>
      </section>
    </>
  );
}
