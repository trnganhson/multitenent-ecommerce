import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store Name",
      admin: {
        description: "This is the name of store (e.g son's store)",
      }
    },
    {
        name: "slug",
        type: "text", 
        index: true,
        required: true,
        unique: true,   
        admin: {
            description: "This is the subdomain for the store (e.g. [slug].sonshop.com)"
        }, 
    },
    {
        name: "image",
        type: "upload",
        relationTo: "media",
    },
    {
        name: "stripeAccountId",
        type: "text",
        required: true,
        admin: {
            readOnly: true,
        },
    },
     {
        name: "stripeDetailsSubmitted",
        type: "checkbox",
        admin: {
            readOnly: true,
            description: "you can not create products until you submit your Stripe details",
        },
    },
  ],
}
