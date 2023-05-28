# SolidQuery YAML Schema Documentation

SolidQuery YAML schema allows developers to define data structures
in a declarative manner. The following is a detailed breakdown of
how to write a SolidQuery schema:

## Defining Data Types

At the top level, you define your data types, which are equivalent
to structs in Solidity. Each data type is defined as a separate entry
in the YAML file:

```yaml
Book:
Person:
User:
```

## Defining Fields

Under each data type, you define the fields associated with it:

```yaml
Book:
  Id: uint256
  Name: string
  Author: string
Person:
  Name: string
  Birth: uint256
User:
  Address: address
  Balance: uint256
```

Each field is defined with a Solidity type.

## Field Modifiers

Modifiers can be added to fields to control their behavior in the
generated contract:

- `id`: Tags a field as the ID field for the data type. If no field
  is tagged as "id", a `uint256 id` is automatically created.
- `auto`: Only valid for `uint` ID fields. Automatically increments
  the ID by one on each insert. If this modifier isn't provided, the
  user needs to specify the ID when inserting a new record.
- `indexed`: Tags the field for indexing, which allows data to be
  fetched by this field. Multiple fields can be tagged as indexed.
- `get`: Generates a function specifically for retrieving this field
  from a record.
- `set`: Generates a function specifically for updating this field
  for a record.

For example:

```yaml
Book:
  Id: uint256 id auto
  Name: string
  Author: string indexed get set
Person:
  Name: string
  Birth: uint256 indexed
User:
  Address: address id
  Balance: uint256
```

This syntax allows for flexible and powerful contract generation,
giving you control over how your contract handles data.

## Extended Syntax

Fields can also be defined using an extended syntax that provides
the same functionality but with explicit key-value pairs:

```yaml
Book:
  Id:
    type: uint256
    id: true
    auto: true
  Name:
    type: string
  Author:
    type: string
    indexed: true
    get: true
    set: true
Person:
  Name:
    type: string
  Birth:
    type: uint256
    indexed: true
User:
  Address:
    type: address
    id: true
  Balance:
    type: uint256
```

## CRUD Operations

CRUD (Create, Read, Update, Delete) operations are automatically generated
for all data types defined in the schema. However, if you want to get or set
individual fields, you need to tag those fields with `get` or `set`
respectively.
