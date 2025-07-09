import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    hidden: true,
  },
  access: {
    create: () => false,
    read: () => true,
    update: () => true,
    delete: () => false,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [{ label: 'Admin', value: 'admin' }],
      defaultValue: 'admin',
      required: true,
    },
  ],
}
