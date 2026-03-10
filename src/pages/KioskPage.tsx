import type Products from "../interfaces/Products";
import useFetchJson from "../utils/useFetchJson";

KioskInfoPage.route = {
  path: '/kiosk-info',
  menuLabel: 'Vårat Snacks Utbud'
};

export default function KioskInfoPage() {

  const [products] = useFetchJson<Products[] | null>('/api/products');
  const productType = [...new Set(products?.map(p => p.type))];

  console.log(products);

  return (
    <>
      <section className="flex flex-col content-center justify-center mb-20 sm:mb-40 gap-20 px-2 sm:px-1
      bg-[url('/snack-bar.webp')] bg-fixed bg-no-repeat bg-top">

        <div className="flex flex-col items-center gap-5 mt-30 sm:mt-40">
          <h1 className="font-extrabold text-5xl text-shadow-lg/50">Kioskutbud</h1>
          <p className="px-2 text-xl font-medium text-shadow-lg/50">Gör din bioupplevelse komplett med våra läckra snacks och drycker</p>
        </div>

        {productType.map((type) => (
          <div className="flex flex-col gap-5 m-auto">
            <div className="flex flex-row justify-center sm:justify-start tems-center">

              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">{type}</h2>
                <span className="border-2 border-red-800 w-20"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products?.filter((product) => product.type === type).map((product) => (
                <div key={product.id} className="relative border-2 rounded-2xl border-stone-900 hover:shadow-[0_0_10px_gray]">
                  <span className="flex flex-col justify-center content-center text-xs sm:text-lg font-bold absolute top-2 right-3 bg-red-800 w-15 h-8 sm:w-20 sm:h-10 rounded-4xl">
                    <p className="text-center">{product.price}kr</p>
                  </span>
                  <img src={product.image} alt={product.name} className="w-75 h-75 rounded-2xl" />
                  <div className="flex flex-col justify-evenly absolute px-5 py-2 max-w-75 min-h-25 md:min-w-75 bg-stone-900 border-none inset-x-0 bottom-0 rounded-b-2xl">
                    <p className="font-bold text-md">{product.name}</p>
                    <p className="font-medium text-sm">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section >
    </>
  );
}
