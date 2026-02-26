import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Adapter, Database, Resource } from "@adminjs/sql";
import type { Router } from "express";

export interface AdminJSSetup {
  admin: AdminJS;
  adminRouter: Router;
}

export const initAdminJS = async (): Promise<AdminJSSetup> => {
  AdminJS.registerAdapter({ Database, Resource });

  const adapter = new Adapter("postgresql", {
    connectionString: process.env.DATABASE_URL as string,
    database: "crud_db",
  });

  const db = await adapter.init();

  const admin = new AdminJS({
    resources: [
      {
        resource: db.table("items"),
        options: {
          navigation: null,
          id: "Items",
          properties: {
            id: { position: 1 },
            name: { position: 2 },
          },
          listProperties: ["id", "name"],
          showProperties: ["id", "name"],
          editProperties: ["name"],
        },
      },
    ],
    rootPath: "/admin",
    branding: {
      companyName: "Aura",
      logo: "/public/aura-logo.svg",
      favicon: "/public/simple-logo.svg",
      withMadeWithLove: false,
    },
  });

  const adminRouter = AdminJSExpress.buildRouter(admin);

  return { admin, adminRouter };
};
