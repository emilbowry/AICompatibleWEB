// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   engine: "classic",
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });
// 1. ADD THIS LINE AT THE VERY TOP
// 1. Add this line. This will load the .env file into the environment.
import "dotenv/config";

// 2. Keep your original, correct import. This path is understood by the Prisma CLI.
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	engine: "classic",
	datasource: {
		// 3. Now, when env() runs, it will find process.env.DATABASE_URL
		//    because the import on line 1 already loaded it.
		url: env("DATABASE_URL"),
	},
});
