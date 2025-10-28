import { constants } from '@app/components/constants';

export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: constants.companyName,
    url: constants.companyWebsite,
    logo: `${constants.companyWebsite}${constants.companyLogo}`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: constants.phoneNumber,
      contactType: 'customer service',
      areaServed: 'CA',
      availableLanguage: ['English', 'French'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: constants.companyAddress,
      addressLocality: constants.companyCity,
      addressRegion: constants.companyProvince,
      postalCode: constants.companyPostalCode,
      addressCountry: constants.companyCountry,
    },
    sameAs: [constants.facebook, constants.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
