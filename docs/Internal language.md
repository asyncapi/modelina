# The model language

It is important to understand the domain-specific language that describes the data models. It is what the input processors converts their inputs to, and the generators use to generate the output.

It is also what developers can use to create their own models, since they can provide a **raw data model** as input. This way you can create your own custom data models that can be interpreted to any output language, with the full sweep of features the generators and presets support. See [Create your own models from the ground up, instead of a supported input](./advanced#create-your-own-models-from-the-ground-up-instead-of-a-supported-input)

## The basics and process

There are two parts to the model, one for the input processors (the **raw data model**), which they convert to, and then the one that the generators receive (the **constrained data model**).

For example (and this accounts for almost all languages) you cannot render a property with the name `my property`, generally, they follow some kind of common naming format such as using camel case `myProperty` or pascal case `MyProperty`.

This is the reason for having two data models because each output (Java, TS, Go, etc) have very specific constraints.

Therefore the **raw data model** does not have any constraints, and it is perfectly normal and expected to name your properties `my property`. Before the model reaches the generator, it gets transformed to a **constrained data model**.

<p align="center">
  <img src="./img/RenderingProcess.png" />
</p>

The transformation happens in three stages. 

1. Process the input and transform it into the raw data model. See [The raw data model](#the-raw-data-model) for more information.
2. Split the raw data model into separate models that are rendered separately. See [The splitting of data models](#The-splitting-of-data-models) for more information. 
3. Constrain the data models to the output language. See [The constrained data model](#the-constrained-data-model) for more information.

## The raw data model
The raw data model is what (now and in the future) Protobuf, JSON Schema, JSON Type Definition, Graphql types, are gonna be converted into.

These are the following raw data models that we are gonna support:
- **ArrayModel** is an unordered collection of a specific **DataModel**.
- **TupleModel** is an ordered collection of **DataModel**s.
- **EnumModel** is group of constants.
- **UnionModel** represent that the model can be either or other **DataModel**s.
- **ObjectModel** is a structure, that can be generated to class/interface/struct, etc, depending on the generator.
- **DictionaryModel** is a map/dictionary of key/value **DataModel**s.
- **ReferencedModel** is used for when a generator splits up models. See [The splitting of data models](#the-splitting-of-data-models).
- **BooleanModel** represent boolean values.
- **IntegerModel** represent natural numbers.
- **FloatModel** represent floating-point numbers. 
- **StringModel** represent string values.
- **AnyModel** represent generic values that cannot otherwise be represented by one of the other models.

<p align="center">
  <img src="./img/RawDataModel.png" />
</p>

## The splitting of data models
Each generator requires a different splitting of the models since it varies which models should be rendered as is, and which need to be rendered separately.

For with the current TS generator, we should split:
- ObjectModel
- EnumModel (conditional, depends on the provided options, as inline string enums are possible) 

For the Java generator, we should split:
- ObjectModel
- EnumModel
- TupleModel (TS have these models natively supported, Java don't)
- UnionModel (TS have these models natively supported, Java don't)

## The constrained data model

Extending the raw data models, we introduce the constrained data models. This is the model that generators and presets have access to. 

What exactly get's constrained?

- Enum values and keys
- Property names
- Data model names
- Data model type

How are they constrained?

The answer to this question is not straightforward, cause each language has unique constraints that the data models much adhere to. This is TBD.

<p align="center">
  <img src="./img/ConstrainedDataModel.png" />
</p>

