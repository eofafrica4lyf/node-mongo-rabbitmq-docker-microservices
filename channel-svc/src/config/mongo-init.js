const db = db.getSiblingDB('hrEmailsService');

db.createUser({
  user: 'hrAdminUser',
  pwd: 'VjgPRBNDeYgt',
  roles: [
    {
      db: 'hrEmailsService',
      role: 'readWrite',
    },
    {
      db: 'hrEmailsService',
      role: 'dbAdmin',
    },
  ],
});
