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
    </>
  );
}
