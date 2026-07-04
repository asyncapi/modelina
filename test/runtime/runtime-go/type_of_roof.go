
package runtimego

type TypeOfRoof uint

const (
  TypeOfRoofTile TypeOfRoof = iota
  TypeOfRoofStraw
  TypeOfRoofWood
  TypeOfRoofMetal
)

// Value returns the value of the enum.
func (op TypeOfRoof) Value() any {
	if op >= TypeOfRoof(len(TypeOfRoofValues)) {
		return nil
	}
	return TypeOfRoofValues[op]
}

var TypeOfRoofValues = []any{"tile","straw","wood","metal"}
var ValuesToTypeOfRoof = map[any]TypeOfRoof{
  TypeOfRoofValues[TypeOfRoofTile]: TypeOfRoofTile,
  TypeOfRoofValues[TypeOfRoofStraw]: TypeOfRoofStraw,
  TypeOfRoofValues[TypeOfRoofWood]: TypeOfRoofWood,
  TypeOfRoofValues[TypeOfRoofMetal]: TypeOfRoofMetal,
}
