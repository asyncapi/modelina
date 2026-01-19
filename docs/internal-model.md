# Internal model

In order to generate data models from all kinds of inputs, we need a common structure for how we interact with one. That structure is called `MetaModel` often referred to as `Modelina Meta Model`, `Raw Meta Model`, or `MMM`. And there are two parts to it, there is the **meta model** and then the **constrained meta model**.

## The Meta Model
The **meta model** is what inputs (now and in the future) such as Protobuf, JSON Schema, JSON Type Definition, GraphQL types, are gonna be converted into. This is also an input in it'self that you can provide Modelina to create your own input processor.

These are the meta models and their meaning:
- **ArrayModel** is an unordered collection of a specific **MetaModel**.
- **TupleModel** is an ordered collection of **MetaModel**s.
- **EnumModel** is group of constants.
- **UnionModel** represent that the model can be either/or other **MetaModel**s.
- **ObjectModel** is a structure, that can be generated to class/interface/struct, etc, depending on the output language
- **DictionaryModel** is a map/dictionary of key/value **MetaModel**s.
- **ReferencedModel** is primarily used for when models should be split up and referenced, or it could be an external reference to an external entity.
- **BooleanModel** represent boolean values.
- **IntegerModel** represent natural numbers.
- **FloatModel** represent floating-point numbers. 
- **StringModel** represent string values.
- **AnyModel** represent generic values that cannot otherwise be represented by one of the other models.

```mermaid
---
title: Meta Model
---
classDiagram
    direction BT
    class MetaModel {
        <<Abstract class>> 
        String name
        Any originalInput
    }

    class TupleValueModel{
        <<class>>
        Number index
        MetaModel value
    }

    class TupleModel{
        <<class>>
        TupleValueModel[] tupleModels
    }

    class ObjectModel{
        <<class>>
        &lt;String, ObjectPropertyModel&gt; properties
    }

    class ObjectPropertyModel{
        <<class>>
        String propertyName
        Boolean required
        MetaModel property
    }

    class ArrayModel{
        <<class>>
        MetaModel valueModel
    }

    class UnionModel{
        <<class>>
        MetaModel[] unionModels
    }

    class EnumValueModel{
        <<class>>
        String key
        Any value
    }

    class EnumModel{
        <<class>>
        EnumValueModel[] values
    }

    class BooleanModel{
        <<class>>
    }

    class StringModel{
        <<class>>
    }

    class IntegerModel{
        <<class>>
    }

    class FloatModel{
        <<class>>
    }

    class AnyModel{
        <<class>>
    }

    class ReferencedModel{
        <<class>>
        MetaModel referencedModel
    }

    class DictionaryModel{
        <<class>>
        MetaModel keyModel
        MetaModel valueModel
        'unwrap' | 'normanl'  serializationType
    }
    
    



    TupleValueModel:value --> MetaModel
    ObjectPropertyModel:property --> MetaModel
    ArrayModel:valueModel --> MetaModel
    DictionaryModel:valueModel --> MetaModel
    DictionaryModel:keyModel --> MetaModel

    TupleModel "1 ... n" *-- TupleValueModel
    ObjectModel "1 ... n" *-- ObjectPropertyModel
    UnionModel "1 ... n" *-- "1 ... n" MetaModel

    EnumModel o-- EnumValueModel

    TupleModel --|> MetaModel
    ObjectModel --|> MetaModel
    ArrayModel --|> MetaModel
    UnionModel --|> MetaModel
    EnumModel --|> MetaModel
    BooleanModel --|> MetaModel
    IntegerModel --|> MetaModel
    StringModel --|> MetaModel
    FloatModel --|> MetaModel
    AnyModel --|> MetaModel
    ReferencedModel --|> MetaModel
    DictionaryModel --|> MetaModel

```

## The Constrained Meta Model

Before the **meta models**s reaches the generator, it needs to be `constrained` to the output. 

For example, constraining the **EnumModel** in Java means taking the raw enum key (for the **meta model** there are no constrains to what values may be used) such as `something% something` and convert it to a compliant Java enum key that can be accessed directly in the generator and presets.

This means that if you accessed `EnumValueModel.key` you would get `something% something`, and with the Java constrained variant `ConstrainedEnumValueModel.key` you get (example) `SOMETHING_PERCENT_SOMETHING`.

How and what are constrained?

The answer to this question is not straightforward, cause each output has unique constraints that the meta models must adhere to. You can read more about [the constraint behavior here](./constraints/README.md).

```mermaid
---
title: Constrained Meta Model
---
classDiagram
    direction RL
    class MetaModel {
        <<Abstract class>> 
        String name
        Any originalInput
    }

    class ConstrainedMetaModel {
        <<Abstract class>> 
        String type
    }

    class ConstrainedTupleValueModel{
        <<class>>
        Number index
        ConstrainedMetaModel value
    }

    class ConstrainedTupleModel{
        <<class>>
        ConstrainedTupleValueModel[] tupleModels
    }

    class ConstrainedObjectModel{
        <<class>>
        &lt;String, ObjectPropertyModel&gt; properties
    }

    class ConstrainedObjectPropertyModel{
        <<class>>
        String propertyName
        Boolean required
        ConstrainedMetaModel property
    }

    class ConstrainedArrayModel{
        <<class>>
        ConstrainedMetaModel valueModel
    }

    class ConstrainedUnionModel{
        <<class>>
        ConstrainedMetaModel[] unionModels
    }

    class ConstrainedEnumValueModel{
        <<class>>
        String key
        Any value
    }

    class ConstrainedEnumModel{
        <<class>>
        EnumValueModel[] values
    }

    class ConstrainedBooleanModel{
        <<class>>
    }

    class ConstrainedStringModel{
        <<class>>
    }

    class ConstrainedIntegerModel{
        <<class>>
    }

    class ConstrainedFloatModel{
        <<class>>
    }

    class ConstrainedAnyModel{
        <<class>>
    }

    class ConstrainedReferencedModel{
        <<class>>
        ConstrainedMetaModel referencedModel
    }

    class ConstrainedDictionaryModel{
        <<class>>
        ConstrainedMetaModel keyModel
        ConstrainedMetaModel valueModel
        'unwrap' | 'normanl'  serializationType
    }
    
    



    ConstrainedTupleValueModel:value --> ConstrainedMetaModel
    ConstrainedObjectPropertyModel:property --> ConstrainedMetaModel
    ConstrainedArrayModel:valueModel --> ConstrainedMetaModel
    ConstrainedDictionaryModel:valueModel --> ConstrainedMetaModel
    ConstrainedDictionaryModel:keyModel --> ConstrainedMetaModel

    ConstrainedTupleModel "1 ... n" *-- ConstrainedTupleValueModel
    ConstrainedObjectModel "1 ... n" *-- ConstrainedObjectPropertyModel
    ConstrainedUnionModel "1 ... n" *-- "1 ... n" ConstrainedMetaModel

    ConstrainedEnumModel o-- ConstrainedEnumValueModel

    ConstrainedTupleModel --|> ConstrainedMetaModel
    ConstrainedObjectModel --|> ConstrainedMetaModel
    ConstrainedArrayModel --|> ConstrainedMetaModel
    ConstrainedUnionModel --|> ConstrainedMetaModel
    ConstrainedEnumModel --|> ConstrainedMetaModel
    ConstrainedBooleanModel --|> ConstrainedMetaModel
    ConstrainedIntegerModel --|> ConstrainedMetaModel
    ConstrainedStringModel --|> ConstrainedMetaModel
    ConstrainedFloatModel --|> ConstrainedMetaModel
    ConstrainedAnyModel --|> ConstrainedMetaModel
    ConstrainedReferencedModel --|> ConstrainedMetaModel
    ConstrainedDictionaryModel --|> ConstrainedMetaModel
    ConstrainedMetaModel --|> MetaModel


```