import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'categories',
    depth: 1, //Populate subcategories
    where: {
      parent: {
        exists: false,
      }
    }
  })

  return Response.json(data)
}
