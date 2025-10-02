import { wixClient } from '@app/server/wix';
export async function useGetMySitePropertiesFunction() {
  try {
    const mySiteProperties = await wixClient.siteProperties.getSiteProperties();

    console.log('Success! Site properties:', mySiteProperties);
    return mySiteProperties;
  } catch (error) {
    console.error(error);
    // Handle the error
  }
}
