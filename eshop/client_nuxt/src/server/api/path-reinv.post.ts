export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let delPatterns: string[] | null = [],
    status: boolean = true;

  if (
    Object.hasOwn(body, "secret") &&
    body.secret === process.env.PLANT_LEVIT_SERVER_ON_DEMAND_SECRET &&
    Object.hasOwn(body, "paths")
  ) {
    try {
      if (Array.isArray(body.paths)) {
        body.paths.map(async (p: string) => {
          let url = new URL("http://none" + p);
          const pathname =
            url.pathname.endsWith("/") && url.pathname !== "/"
              ? url.pathname.slice(0, -1)
              : url.pathname;

          const pathPattern = pathname.split("/").join("");

          // resolve cacheKey pattern to delete
          const pattern = `nitro:routes:invalidable:${pathPattern}.`;

          // find keys to invalidate
          if (delPatterns) delPatterns.push(pattern);
        });
      } else if (body.paths === "REINV_ALL") delPatterns = null;

      // go through keys and delete all that are "selected" for delete
      const storage = useStorage("db");

      if (delPatterns === null) await storage.clear(); // erase whole storage
      else {
        const keys = await storage.getKeys();

        keys.map((key) => {
          if (delPatterns)
            delPatterns.map((pattern) => {
              if (key.startsWith(pattern)) storage.removeItem(key);
            });
        });
      }
    } catch (e) {
      status = false;
      console.error(e);
    }
  }

  return JSON.stringify({ status });
});
