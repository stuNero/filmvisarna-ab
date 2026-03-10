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
      <section className="flex flex-col top-0 bottom-0 left-0 content-center justify-center mb-20 gap-20
      bg-[url('/snack-bar.webp')] bg-fixed bg-no-repeat bg-top">

        <div className="flex flex-col items-center gap-5 mt-20">
          <h1 className="font-extrabold text-5xl">Kioskutbud</h1>
          <p className="text-xl font-medium">Gör din bioupplevelse komplett med våra läckra snacks och drycker</p>
        </div>

        <div className="flex flex-col gap-5 m-auto">
          <div className="flex flex-row items-center">
            <div className="flex flex-col  gap-2">
              <h2 className="text-2xl font-bold">Kombos</h2>
              <span className="border-2 border-red-800 w-20"></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {products?.filter((product) => product.type === "Combo").map((product) => (
              <div key={product.id} className="relative border-2 rounded-2xl border-stone-900 hover:shadow-[0_0_10px_gray]">
                <span className="flex flex-col justify-center content-center text-lg font-bold absolute top-2 right-3 bg-red-800 w-20 h-10 rounded-4xl">
                  <p className="text-center">{product.price}kr</p>
                </span>
                <img src={product.image} alt={product.name} className="w-75 h-75 rounded-2xl" />
                <div className="flex flex-col justify-evenly absolute w-75 h-25 bg-stone-900 border-none inset-x-0 bottom-0 rounded-b-2xl">
                  <p className="font-bold text-md">{product.name}</p>
                  <p className="font-medium text-sm">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 m-auto">
          <div className="flex flex-row items-center">
            <div className="flex flex-col  gap-2">
              <h2 className="text-2xl font-bold">Snacks</h2>
              <span className="border-2 border-red-800 w-20"></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">

            {products?.filter((product) => product.type === "Snacks").map((product) => (
              <div key={product.id} className="relative border-2 rounded-2xl border-stone-900 hover:shadow-[0_0_10px_gray]">
                <span className="flex flex-col justify-center content-center text-lg font-bold absolute top-2 right-3 bg-red-800 w-20 h-10 rounded-4xl">
                  <p className="text-center">{product.price}kr</p>
                </span>
                <img src={product.image} alt={product.name} className="w-75 h-75 rounded-2xl" />
                <div className="flex flex-col justify-evenly absolute w-75 h-25 bg-stone-900 border-none inset-x-0 bottom-0 rounded-b-2xl">
                  <p className="font-bold text-md">{product.name}</p>
                  <p className="font-medium text-sm">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 m-auto">
          <div className="flex flex-row items-center">
            <div className="flex flex-col  gap-2">
              <h2 className="text-2xl font-bold">Drycker</h2>
              <span className="border-2 border-red-800 w-20"></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">

            {products?.filter((product) => product.type === "Drinks").map((product) => (
              <div key={product.id} className="relative border-2 rounded-2xl border-stone-900 hover:shadow-[0_0_10px_gray]">
                <span className="flex flex-col justify-center content-center text-lg font-bold absolute top-2 right-3 bg-red-800 w-20 h-10 rounded-4xl">
                  <p className="text-center">{product.price}kr</p>
                </span>
                <img src={product.image} alt={product.name} className="w-75 h-75 rounded-2xl" />
                <div className="flex flex-col justify-evenly absolute w-75 h-25 bg-stone-900 border-none inset-x-0 bottom-0 rounded-b-2xl">
                  <p className="font-bold text-md">{product.name}</p>
                  <p className="font-medium text-sm">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 m-auto">
          <div className="flex flex-row items-center">
            <div className="flex flex-col  gap-2">
              <h2 className="text-2xl font-bold">Godis</h2>
              <span className="border-2 border-red-800 w-20"></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">

            {products?.filter((product) => product.type === "Candy").map((product) => (
              <div key={product.id} className="relative border-2 rounded-2xl border-stone-900 hover:shadow-[0_0_10px_gray]">
                <span className="flex flex-col justify-center content-center text-lg font-bold absolute top-2 right-3 bg-red-800 w-20 h-10 rounded-4xl">
                  <p className="text-center">{product.price}kr</p>
                </span>
                <img src={product.image} alt={product.name} className="w-75 h-75 rounded-2xl" />
                <div className="flex flex-col justify-evenly absolute w-75 h-25 bg-stone-900 border-none inset-x-0 bottom-0 rounded-b-2xl">
                  <p className="font-bold text-md">{product.name}</p>
                  <p className="font-medium text-sm">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section >
    </>
  );
}
