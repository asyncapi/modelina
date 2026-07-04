
package runtimego

type Address struct {
  StreetName string
  HouseNumber float64
  Marriage bool
  Members *Members
  ArrayType []Union
  NestedObject *NestedObject
  EnumTest *EnumTest
  HouseType *HousingType
  RoofType *TypeOfRoof
  RequiredDate string
  NullableString *string
  NullableNumber *float64
  NullableDate *string
  NullableArray []string
  NullableUnionArray []NullableUnionArrayItem
  NullableTuple []interface{}
  NullableObject *NullableObject
  NullableDictionary map[string]string
  RequiredRefArray []RefObject
  AdditionalProperties map[string]AdditionalProperties
}