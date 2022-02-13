# deno-utils

Collection of utility functions for Deno

## Developers

### Setup

To install Deno, see the
[installation guide](https://deno.land/manual/getting_started/installation).

To run commands, you will need to install Velociraptor. See the
[installation guide](https://velociraptor.run/docs/installation/).

### Testing

```shell
vr test
```

#### Coverage

To generate coverage reports you will need to install `lcov`.

```shell
apt install lcov
```

Once you have installed `lcov`, you can generate a coverage report using:

```shell
vr test:coverage
```

This will be available at `__coverage__/html/index.html`.
