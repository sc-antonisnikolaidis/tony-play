import React from 'react';
import { useSitecoreContext, LayoutServicePageState } from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreContextValue } from 'lib/component-props';
import ProductDetails, { ProductDetailsMarkup } from '../Widgets/ProductDetails';

const ProductDetail = (): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext<SitecoreContextValue>();
  const sampleProduct = {
    image_url: '/assets/img/news/conference-image.jpg',
    name: 'Sample Product',
    price: '250.00',
    brand: 'PLAY!Summit',
    sku: 'PSPSP',
  };

  const mockProps = {
    title: '',
    dispatch: () => undefined as unknown,
    rfkId: 'ps_pd',
    loading: false,
    products: [
      {
        sku: 'PSPSBC',
        skuid: 254894830,
        name: 'Striva Bike Cover',
        breadcrumbs: 'Activities>Cycling>Equipment',
        price: '15.95',
        category_names: ['Equipment'],
        id: 63145633,
        product_url: '/shop/products/striva-bike-cover',
        image_url:
          '//playsummit.sitecoresandbox.cloud/api/public/content/06ca7ae061f242e5b78f27e1e103a4a1?v=7a9126c0',
        final_price: '15.95',
        product_group: 'PSPSBC',
        brand: 'Striva',
      },
    ],
    available: true,
    loaded: true,
  };

  const isPageEditing =
    sitecoreContext.pageState === LayoutServicePageState.Edit ||
    sitecoreContext.pageState === LayoutServicePageState.Preview;

  return (
    <section className="section">
      {console.log(sitecoreContext)}
      <div className="container">
        {isPageEditing ? (
          ProductDetailsMarkup(sampleProduct)
        ) : (
          // ProductDetails(mockProps)
          <div data-rfkid="ps_pd"></div>
        )}

        <br></br>
        <div data-rfkid="rfk_sbp"></div>
        <div data-rfkid="ps_rand"></div>
      </div>
    </section>
  );
};

export default ProductDetail;
