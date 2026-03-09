import useFetchJson from "../utils/useFetchJson";

KioskInfoPage.route = {
  path: '/kiosk-info',
  menuLabel: 'Vårat Snacks Utbud'
};

interface Products {
  id: number;
  name: string;
  price: number;
  description: string;
  type: string;
  image: string;
}

export default function KioskInfoPage() {

  const [products] = useFetchJson<Products[] | null>('/api/products');

  console.log(products);

  return (
    <>
      <section className="flex flex-col top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20 gap-20">
        <div className="flex flex-col items-center gap-5">
          <h1 className="font-extrabold text-5xl">Kioskutbud</h1>
          <p className="text-xl font-medium">Gör din bioupplevelse komplett med våra läckra snacks och drycker</p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <h2 className="text-2xl font-bold">Kombos</h2>
        </div>
        <div className="flex flex-row gap-5">

          {products?.filter((product) => product.type === "Combo").map((product) => (
            <div key={product.id} className="relative border-2 rounded-2xl border-stone-900">
              <img src={product.image} alt={product.name} className="w-75 h-75 rounded-2xl" />
              <div className="absolute w-75 h-25 bg-stone-900 border-none inset-x-0 bottom-0 rounded-b-2xl">
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
