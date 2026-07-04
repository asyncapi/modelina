
package runtimego

type EnumTest uint

const (
  EnumTestTest EnumTest = iota
  EnumTestTest2
)

// Value returns the value of the enum.
func (op EnumTest) Value() any {
	if op >= EnumTest(len(EnumTestValues)) {
		return nil
	}
	return EnumTestValues[op]
}

var EnumTestValues = []any{"test","test2"}
var ValuesToEnumTest = map[any]EnumTest{
  EnumTestValues[EnumTestTest]: EnumTestTest,
  EnumTestValues[EnumTestTest2]: EnumTestTest2,
}
