type FrequentlyPurchasedTogetherProps = {
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

const FrequentlyPurchasedTogether = (props: FrequentlyPurchasedTogetherProps): JSX.Element => {
  console.log({ props });

  return window.RFK.ui.html`
    <section>
      Cart Recommendation Widget
      ${props.products?.map((product: Product) => {
        return window.RFK.ui.html`
        <a href="${product.product_url}">
          <img width=200 src="${product.image_url}" />
          <div>${product.name}</div>
          <div>${product.price}</div>
        </a>
        `;
      })}
    </section>
  `;
};

export default FrequentlyPurchasedTogether;
