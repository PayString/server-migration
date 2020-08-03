# `@payid-org/server-migration`

A TypeScript library and CLI script to assist with PayID server migrations.

## Usage

### As a Command-Line Utility

SSH into / port-forward to a machine that has access to the PayID server Admin API.

Globally install the module :

`npm install -g @payid-org/server-migration`

Run the following command to see usage instructions :

`payid-server-migrate`

e.g. An example migration to transform X-addresses to classic addresses :

`payid-server-migrate -f payIds.txt -t xAddressToClassic`

## Transforms

Contribute your own transforms to `src/transform.ts` !

Defined payload transforms :

`xAddressToClassic` - Converts `XRPL` payloads to use classic addresses and tags, instead of X-addresses. Does nothing if the conversion does not apply.

## Legal

By using, reproducing, or distributing this code, you agree to the terms and conditions for use (including the Limitation of Liability) in the [Apache License 2.0](https://github.com/payid-org/metrics/blob/master/LICENSE). If you do not agree, you may not use, reproduce, or distribute the code.
