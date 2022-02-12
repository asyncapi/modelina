# The Meta Model

In order to generate data models from all kinds of inputs, we need a common structure for how we interact with one. That structure is called `MetaModel` often referred to as `Modelina Meta Model`, `Raw Meta Model`, or `MMM`.

There are two parts to the meta model, the raw **meta model** and then the **constrained meta model**.

## The basics and process

Inputs generally don't have the faintest idea about the constraints of an output and it is therefore the **meta model** does not have any constraints, and it is perfectly normal and expected to name your properties `my property`. 

Before the model reaches the generator, it gets transformed to a **constrained meta model**. Here it converts the raw **meta model** into only having valid values for the specific output. For example (and this accounts for almost all languages) you cannot render a property with the name `my property`, as they generally follow some kind of common naming format such as using camel case `myProperty` or pascal case `MyProperty`. 

This transformation happen in three stages. 

<p align="center">
  <img src="./img/RenderingProcess.png" />
</p>

1. Process the input and transform it into the meta model. See [The meta model](#the-meta-model) for more information.
2. Split the meta model into separate models that are rendered separately. See [The splitting of meta models](#The-splitting-of-data-models) for more information. 
3. Constrain the meta models to the output language. See [The constrained meta model](#the-constrained-data-model) for more information.

## The meta model
The **meta model** is what inputs (now and in the future) such as Protobuf, JSON Schema, JSON Type Definition, GraphQL types, are gonna be converted into. 

These are the meta models and their meaning:
- **ArrayModel** is an unordered collection of a specific **DataModel**.
- **TupleModel** is an ordered collection of **DataModel**s.
- **EnumModel** is group of constants.
- **UnionModel** represent that the model can be either/or other **DataModel**s.
- **ObjectModel** is a structure, that can be generated to class/interface/struct, etc, depending on the output language
- **DictionaryModel** is a map/dictionary of key/value **DataModel**s.
- **ReferencedModel** is primarily used for when models should be split up ([see the splitting of meta models](#the-splitting-of-data-models)) and referenced, or it could be an external reference to an external entity.
- **BooleanModel** represent boolean values.
- **IntegerModel** represent natural numbers.
- **FloatModel** represent floating-point numbers. 
- **StringModel** represent string values.
- **AnyModel** represent generic values that cannot otherwise be represented by one of the other models.

<p align="center">
  <img src="./img/MetaModel.png" />
</p>

## The splitting of meta models
Each generator requires a different splitting of the **meta model**s because it varies which should be rendered as is, and which need to be rendered separately.

For example with the current TS generator, we split the following models:
- **ObjectModel**
- Sometimes **EnumModel**

For the Java generator, we split the following models:
- **ObjectModel**
- **EnumModel**
- **TupleModel** (TS have these models natively supported, Java don't, so we need to generate alternatives)
- **UnionModel** (TS have these models natively supported, Java don't, so we need to generate alternatives)

## The Constrained Meta Model

Before the split **MetaModel**s reaches the generator, it needs to be `constrained` to the output. 

For example, constraining the **EnumModel** in Java means taking the raw enum key (for the **MetaModel** there are no constrains to what values may be used) such as `something% something` and convert it to a compliant (to the output) enum key that can be accessed directly, without having to call external libraries to find out of the result.

This means that if you accessed `EnumValueModel.key` you would get `something% something`, and with the Java constrained variant `ConstrainedEnumValueModel.key` you get (example) `SOMETHING_PERCENT_SOMETHING`.

How and what are constrained?

The answer to this question is not straightforward, cause each language has unique constraints that the meta models much adhere to. This is TBD.

<p align="center">
  <img src="./img/ConstrainedMetaModel.png" />
</p>