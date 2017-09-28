# Method Protocol

## Version

1

## Format

JSON

## Schemas

### Request

```
{
  requestId: String,
  data?: Any,
}
```

### Response

General:

```
{
  requestId: String,
  ok: Boolean,
}
```

Success:

```
{
  ok: true,
  data?: Any,
}
```

Failed:

```
{
  ok: false,
  error?: String, // error code, such as "invalid-args"
  message?: String, // describe what happened or error reason in human words
  details?: Object,
}
```