package models

import "time"

type Section struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type SectionCreate struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

type SectionUpdate struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}
