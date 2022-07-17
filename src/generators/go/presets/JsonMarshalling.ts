

enum
// UnmarshalJSON implements json.Unmarshaler interface.
func (o *${this.model.name}) UnmarshalJSON(raw []byte) error {
	var v any
	if err := json.Unmarshal(raw, &v); err != nil {
		return err
	}
	*o = ValuesTo${this.model.name}[v]
	return nil
}