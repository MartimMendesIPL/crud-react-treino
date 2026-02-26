import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';
import type { Router } from 'express';

export interface AdminJSSetup {
  admin: AdminJS;
  adminRouter: Router;
}

export const initAdminJS = async (): Promise<AdminJSSetup> => {
  AdminJS.registerAdapter({ Database, Resource });

  const adapter = new Adapter('postgresql', {
    connectionString: process.env.DATABASE_URL as string,
    database: 'crud_db',
  });

  const db = await adapter.init();

  const admin = new AdminJS({
    databases: [db],
    rootPath: '/admin',
    branding: {
      companyName: 'CrudApp Admin',
      withMadeWithLove: false,
    },
  });

  const adminRouter = AdminJSExpress.buildRouter(admin);

  return { admin, adminRouter };
};
