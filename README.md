# deno-utils
Collection of utility functions for Deno

## Developers

### Testing

```shell
deno test
```

#### Collect Coverage

```shell
deno test --coverage=__coverage__
```

#### Display Coverage

```shell
deno coverage __coverage__
```

or

```shell
apt install lcov
deno coverage __coverage__ --lcov > coverage.lcov
genhtml -o __coverage__/html coverage.lcov
```
