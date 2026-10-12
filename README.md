# @liftbay/sdk

Typed client for the [Liftbay API](https://liftbay.dev/docs/api-reference), generated from its OpenAPI document. Paths, parameters, request bodies and responses are checked at compile time.

```sh
npm install @liftbay/sdk
```

```ts
import { createLiftbayClient, unwrap } from "@liftbay/sdk";

const lb = createLiftbayClient({ token: process.env.LIFTBAY_TOKEN });

const builds = await unwrap(
  lb.GET("/v1/orgs/{org}/projects/{project}/builds", { params: { path: { org: "acme", project: "app" } } }),
);
```

- `createLiftbayClient({ token, baseUrl })`: `token` is an organization API token (`lbt_…`); `baseUrl` defaults to `https://api.liftbay.dev`.
- `unwrap(request)` returns the response body or throws a `LiftbayApiError` with `status`, `code`, `message` and `fields`.
- The OpenAPI document itself ships as `@liftbay/sdk/openapi.json`.

Built on [openapi-fetch](https://openapi-ts.dev/openapi-fetch/). Requires Node.js 20 or newer (or any runtime with `fetch`).

## License

Apache-2.0
