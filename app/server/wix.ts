import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { contacts } from "@wix/crm";
import { collections as dataCollections, items as dataItems } from "@wix/data";

export const wixClient = createClient({
    modules: {
        contacts,
        collections: dataCollections,
        items: dataItems
    },
    auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        siteId: process.env.WIX_SITE_ID!,
        accountId: process.env.WIX_ACCOUNT_ID!,
    })
})
