package models

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

// NullInt64 wraps sql.NullInt64 with proper JSON marshaling (null vs number)
type NullInt64 struct {
	sql.NullInt64
}

func (n NullInt64) MarshalJSON() ([]byte, error) {
	if !n.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(n.Int64)
}

func (n *NullInt64) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		n.Valid = false
		return nil
	}
	n.Valid = true
	return json.Unmarshal(data, &n.Int64)
}

// NullString wraps sql.NullString with proper JSON marshaling (null vs string)
type NullString struct {
	sql.NullString
}

func (n NullString) MarshalJSON() ([]byte, error) {
	if !n.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(n.String)
}

func (n *NullString) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		n.Valid = false
		return nil
	}
	n.Valid = true
	return json.Unmarshal(data, &n.String)
}

// NullTime wraps sql.NullTime with proper JSON marshaling (null vs RFC3339 string)
type NullTime struct {
	sql.NullTime
}

func (n NullTime) MarshalJSON() ([]byte, error) {
	if !n.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(n.Time.Format(time.RFC3339))
}

func (n *NullTime) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		n.Valid = false
		return nil
	}
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	// Accept both full RFC3339 ("2026-03-03T00:00:00Z") and plain date ("2026-03-03")
	for _, layout := range []string{time.RFC3339, "2006-01-02"} {
		if t, err := time.Parse(layout, s); err == nil {
			n.Valid = true
			n.Time = t
			return nil
		}
	}
	return fmt.Errorf("cannot parse %q as a date/time value", s)
}
