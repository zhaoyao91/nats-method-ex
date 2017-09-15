# Method Protocol

## Version

1

### Definition

#### Format

JSON

#### Request

```ecmascript 6
{
  "requestId": String,
  "data": Any,
}
```

#### Response

General:

```ecmascript 6
{
  "requestId": String,
  "ok": Boolean,
}
```

Success:

```ecmascript 6
{
  "ok": true,
  "data": Any,
}
```

Failed:

```ecmascript 6
{
  "ok": false,
  "error": String, // error code, such as "invalid-args"
  "message": String, // describe what happened or error reason in human words
  "details": Object,
}
```