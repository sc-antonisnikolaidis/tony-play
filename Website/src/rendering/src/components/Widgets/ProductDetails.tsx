type ProductDetailsProps = {
  loading: boolean;
  loaded: boolean;
  title: string;
  products: [Product];
  dispatch: () => unknown;
};

type Product = {
  image_url: string;
  name: string;
  price: string;
  brand: string;
  sku: string;
};

const ProductDetails = (props: ProductDetailsProps): JSX.Element => {
  const product =
    props.loaded && props.products && props.products.length ? props.products[0] : undefined;

  return product
    ? window.RFK.ui.html`
    <div className="product-detail-hero grid grid-cols-2">
      <div className="product-image">
        <img className="product-image-main" src=${product.image_url} alt="product" />
      </div>
      <div className="product-description">
        <h2 className="text-3xl font-bold mb-6">${product.name}</h2>
        <div className="product-brand">${product.brand}</div>
        <div>SKU: ${product.sku}</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo vitae alias
          nostrum cum dolore eaque, ex accusantium officiis nam cumque.
        </div>
        <div>
          Price: <span className="product-price">$${product.price}</span>
        </div>
        <div>
          Quantity: 1
        </div>
        <div className="product-add-to-cart">
          <a href="javascript:;" className="btn--main btn--main--round inline-block mt-4">Add to cart</a>
        </div>
      </div>
    </div>
    `
    : window.RFK.ui.html`
    <section>
      <h1 className="text-3xl font-bold mb-6" >Oops! We cannot find this product right now.</h1>
      <a href="#" className="btn--main btn--main--round inline-block">
        Browse Activities
      </a>
    </section>
    `;
};

export default ProductDetails;

export const ProductDetailsMarkup = (product: Product): JSX.Element => {
  return (
    <div className="product-detail-hero grid grid-cols-2">
      <div className="product-image">
        <img className="product-image-main" src={product.image_url} alt="product" />
      </div>
      <div className="product-description">
        <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
        <div className="product-brand">{product.brand}</div>
        <div>SKU: {product.sku}</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo vitae alias nostrum cum
          dolore eaque, ex accusantium officiis nam cumque.
        </div>
        <div>
          Price: <span className="product-price">${product.price}</span>
        </div>
        <div>Quantity: 1</div>
        <div className="product-add-to-cart">
          <a href="javascript:;" className="btn--main btn--main--round inline-block mt-4">
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
};
