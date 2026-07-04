
package runtimego

type HousingType uint

const (
  HousingTypeDetached HousingType = iota
  HousingTypeTerraced
  HousingTypeBungalow
  HousingTypeFlat
)

// Value returns the value of the enum.
func (op HousingType) Value() any {
	if op >= HousingType(len(HousingTypeValues)) {
		return nil
	}
	return HousingTypeValues[op]
}

var HousingTypeValues = []any{"detached","terraced","bungalow","flat"}
var ValuesToHousingType = map[any]HousingType{
  HousingTypeValues[HousingTypeDetached]: HousingTypeDetached,
  HousingTypeValues[HousingTypeTerraced]: HousingTypeTerraced,
  HousingTypeValues[HousingTypeBungalow]: HousingTypeBungalow,
  HousingTypeValues[HousingTypeFlat]: HousingTypeFlat,
}
