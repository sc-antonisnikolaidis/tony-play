type RandomProductsProps = {
  loading?: boolean;
  loaded?: boolean;
  title?: string;
  products?: Product[];
  dispatch?: () => unknown;
};

type Product = {
  image_url: string;
  product_url: string;
  name: string;
  price: string;
};

const RandomProducts = (props: RandomProductsProps): JSX.Element => {
  return window.RFK.ui.html`
    <section className="my-6">
      <h2 className="text-3xl font-bold mb-6">Random Products:</h2>
      <div className="grid grid-cols-4 gap-4">
        ${props.products?.map((product: Product) => {
          return window.RFK.ui.html`
          <a href="${product.product_url}" className="border border-black-light p-4">
            <img width=200 src="${product.image_url}" />
            <div>${product.name}</div>
            <div>${product.price}</div>
          </a>
          `;
        })}
      </div>
    </section>
  `;
};

export default RandomProducts;
