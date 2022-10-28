import {
  Text,
  Field,
  LinkField,
  RichText,
  Link,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type PromoProps = ComponentProps & {
  fields: {
    cssClass: Field<string>;
    position: Field<string>;
    title: Field<string>;
    subtitle: Field<string>;
    content: Field<string>;
    callToActionLink: LinkField;
  };
};

const Promo = ({ fields }: PromoProps): JSX.Element => {
  const sectionCssClasses = `section section__promo ${fields.cssClass.value}`;
  const positionCssClasses = `section__content section__promo__content section__promo__content--${fields.position.value} container`;

  return (
    <section className={sectionCssClasses}>
      <div className={positionCssClasses}>
        <div className="section__promo__content__card">
          <Text tag="h5" field={fields.subtitle} />
          <Text tag="h2" field={fields.title} />
          <RichText field={fields.content} />
          <Link field={fields.callToActionLink} className="btn--main btn--main--round" />
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default withDatasourceCheck()<PromoProps>(Promo);
