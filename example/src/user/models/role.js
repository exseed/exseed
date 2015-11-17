export default {
  identity: 'role',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },

    users: {
      collection: 'user',
      via: 'role',
    },

    permissions: {
      collection: 'permission',
      via: 'roles',
      dominant: true,
    },

    toJSON() {
      let obj = this.toObject();
      delete obj.id;
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    },
  },
};