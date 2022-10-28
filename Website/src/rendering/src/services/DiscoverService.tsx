import { ReactElement } from 'react';
import Script from 'next/script';
import FrequentlyPurchasedTogether from '../components/Widgets/FrequentlyPurchasedTogether';
import ProductDetails from '../components/Widgets/ProductDetails';
import SameBrandProducts from '../components/Widgets/SameBrandProducts';
import RandomProducts from '../components/Widgets/RandomProducts';

// ***** TYPES *****

interface RFK {
  setCredentials(
    // eslint-disable-next-line no-unused-vars
    credentials: Record<string, unknown>
  ): void;
  setWidget(
    // eslint-disable-next-line no-unused-vars
    id: string,
    // eslint-disable-next-line no-unused-vars
    options: Record<string, unknown>
  ): void;
  init(): void;
  ui: {
    html(...args: unknown[]): ReactElement<unknown, string>;
  };
}

declare global {
  interface Window {
    RFK: RFK;
  }
}

// ***** API *****

const DISCOVER_API_KEY = process.env.NEXT_PUBLIC_DISCOVER_API_KEY || '';
const DISCOVER_CUSTOMER_KEY = process.env.NEXT_PUBLIC_DISCOVER_CUSTOMER_KEY || '';
// const DISCOVER_CUSTOMER_KEY_SUFFIX = !!DISCOVER_CUSTOMER_KEY
//   ? DISCOVER_CUSTOMER_KEY.substring(DISCOVER_CUSTOMER_KEY.indexOf('-') + 1)
//   : '';
const isDiscoverConfigured = !!DISCOVER_API_KEY && !!DISCOVER_CUSTOMER_KEY;

export const DiscoverScripts: JSX.Element | undefined = isDiscoverConfigured ? (
  <>
    {/* Beacon for old integration way */}
    {/* <Script
      src={`https://${DISCOVER_CUSTOMER_KEY_SUFFIX}-prod.rfksrv.com/rfk/js/${DISCOVER_CUSTOMER_KEY}/init.js`}
      strategy="lazyOnload"
    /> */}

    {/* SDK for new integration way */}
    {/* Temporary source for the Discover SDK until it is released on NPM */}
    <Script
      src="/rfk-sdk.js"
      onLoad={() => {
        window.RFK.setCredentials({
          env: 'prod',
          customerKey: `${DISCOVER_CUSTOMER_KEY}`,
          apiKey: `${DISCOVER_API_KEY}`,
          useToken: true,
        });
        window.RFK.setWidget('rfkid_11', {
          type: 'recommendation',
          component: FrequentlyPurchasedTogether,
        });
        window.RFK.setWidget('ps_pd', {
          type: 'recommendation',
          component: ProductDetails,
          // global: true,
        });
        window.RFK.setWidget('rfk_sbp', {
          type: 'recommendation',
          component: SameBrandProducts,
        });
        window.RFK.setWidget('ps_rand', {
          type: 'recommendation',
          component: RandomProducts,
        });
        window.RFK.init();
      }}
    />
  </>
) : undefined;
