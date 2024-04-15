// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
)

type Comment struct {
	ID        string  `bson:"_id" json:"id"`
	Body      string  `json:"body"`
	UserID    string  `json:"userID"`
	UserName  string  `json:"userName"`
	CreatedAt string  `json:"createdAt"`
	UpdatedAt *string `json:"updatedAt,omitempty"`
}

type Mutation struct {
}

type Problem struct {
	ID                  string          `bson:"_id" json:"id"`
	Statement           string          `json:"statement"`
	Image               *graphql.Upload `json:"image,omitempty"`
	Tags                []string        `json:"tags,omitempty"`
	Difficulty          Difficulty      `json:"difficulty"`
	Status              Status          `json:"status"`
	AuthorUserID        string          `json:"authorUserID"`
	ReviewerUserID      *string         `json:"reviewerUserID,omitempty"`
	ApproverAdminUserID *string         `json:"approverAdminUserID,omitempty"`
	CommentIDs          []string        `json:"commentIDs,omitempty"`
	CreatedAt           string          `json:"createdAt"`
	UpdatedAt           *string         `json:"updatedAt,omitempty"`
}

type ProblemCategory struct {
	ID            string   `bson:"_id" json:"id"`
	Name          string   `json:"name"`
	SubCategories []string `json:"subCategories,omitempty"`
}

type ProblemCategoryCreateInput struct {
	Name          string   `json:"name"`
	SubCategories []string `json:"subCategories,omitempty"`
}

type ProblemCategoryDeleteResponse struct {
	ID string `bson:"_id" json:"id"`
}

type ProblemCategoryUpdateInput struct {
	Name          *string  `json:"name,omitempty"`
	SubCategories []string `json:"subCategories,omitempty"`
}

type ProblemCategoryUpdateResponse struct {
	ID            string   `bson:"_id" json:"id"`
	Name          string   `json:"name"`
	SubCategories []string `json:"subCategories,omitempty"`
}

type ProblemCreateInput struct {
	Statement           string          `json:"statement"`
	Image               *graphql.Upload `json:"image,omitempty"`
	Tags                []string        `json:"tags,omitempty"`
	Difficulty          Difficulty      `json:"difficulty"`
	Status              Status          `json:"status"`
	AuthorUserID        string          `json:"authorUserID"`
	ReviewerUserID      *string         `json:"reviewerUserID,omitempty"`
	ApproverAdminUserID *string         `json:"approverAdminUserID,omitempty"`
	CommentIDs          []string        `json:"commentIDs,omitempty"`
}

type ProblemDeleteResponse struct {
	ID string `bson:"_id" json:"id"`
}

type ProblemUpdateInput struct {
	Statement           *string         `json:"statement,omitempty"`
	Image               *graphql.Upload `json:"image,omitempty"`
	Tags                []string        `json:"tags,omitempty"`
	Difficulty          *Difficulty     `json:"difficulty,omitempty"`
	Status              *Status         `json:"status,omitempty"`
	AuthorUserID        *string         `json:"authorUserID,omitempty"`
	ReviewerUserID      *string         `json:"reviewerUserID,omitempty"`
	ApproverAdminUserID *string         `json:"approverAdminUserID,omitempty"`
	CommentIDs          []string        `json:"commentIDs,omitempty"`
}

type ProblemUpdateResponse struct {
	ID                  string          `bson:"_id" json:"id"`
	Statement           string          `json:"statement"`
	Image               *graphql.Upload `json:"image,omitempty"`
	Tags                []string        `json:"tags,omitempty"`
	Difficulty          Difficulty      `json:"difficulty"`
	Status              Status          `json:"status"`
	AuthorUserID        string          `json:"authorUserID"`
	ReviewerUserID      *string         `json:"reviewerUserID,omitempty"`
	ApproverAdminUserID *string         `json:"approverAdminUserID,omitempty"`
	CommentIDs          []string        `json:"commentIDs,omitempty"`
	CreatedAt           string          `json:"createdAt"`
	UpdatedAt           *string         `json:"updatedAt,omitempty"`
}

type Query struct {
}

type User struct {
	ID                           string  `bson:"_id" json:"id"`
	EmployeeID                   string  `json:"employeeID"`
	Name                         string  `json:"name"`
	Email                        string  `json:"email"`
	Password                     *string `json:"password,omitempty"`
	AdminAssignedPassword        string  `json:"adminAssignedPassword"`
	ChangedAdminAssignedPassword bool    `json:"changedAdminAssignedPassword"`
	Role                         Role    `json:"role"`
	CreatedAt                    string  `json:"createdAt"`
	UpdatedAt                    *string `json:"updatedAt,omitempty"`
}

type UserCreateInput struct {
	EmployeeID                   string  `json:"employeeID"`
	Name                         string  `json:"name"`
	Email                        string  `json:"email"`
	Password                     *string `json:"password,omitempty"`
	AdminAssignedPassword        string  `json:"adminAssignedPassword"`
	ChangedAdminAssignedPassword bool    `json:"changedAdminAssignedPassword"`
	Role                         Role    `json:"role"`
}

type UserCreateResponse struct {
	ID                           string  `bson:"_id" json:"id"`
	EmployeeID                   string  `json:"employeeID"`
	Name                         string  `json:"name"`
	Email                        string  `json:"email"`
	Password                     *string `json:"password,omitempty"`
	AdminAssignedPassword        *string `json:"adminAssignedPassword,omitempty"`
	ChangedAdminAssignedPassword *bool   `json:"changedAdminAssignedPassword,omitempty"`
	Role                         Role    `json:"role"`
	CreatedAt                    string  `json:"createdAt"`
	UpdatedAt                    *string `json:"updatedAt,omitempty"`
}

type UserDeleteResponse struct {
	ID string `bson:"_id" json:"id"`
}

type UserUpdateInput struct {
	EmployeeID                   *string `json:"employeeID,omitempty"`
	Name                         *string `json:"name,omitempty"`
	Email                        *string `json:"email,omitempty"`
	Password                     *string `json:"password,omitempty"`
	AdminAssignedPassword        *string `json:"adminAssignedPassword,omitempty"`
	ChangedAdminAssignedPassword *bool   `json:"changedAdminAssignedPassword,omitempty"`
	Role                         *Role   `json:"role,omitempty"`
}

type UserUpdateResponse struct {
	ID                           string  `bson:"_id" json:"id"`
	EmployeeID                   string  `json:"employeeID"`
	Name                         string  `json:"name"`
	Email                        string  `json:"email"`
	Password                     *string `json:"password,omitempty"`
	AdminAssignedPassword        *string `json:"adminAssignedPassword,omitempty"`
	ChangedAdminAssignedPassword *bool   `json:"changedAdminAssignedPassword,omitempty"`
	Role                         Role    `json:"role"`
	CreatedAt                    string  `json:"createdAt"`
	UpdatedAt                    *string `json:"updatedAt,omitempty"`
}

type Difficulty string

const (
	DifficultyEasy   Difficulty = "EASY"
	DifficultyMedium Difficulty = "MEDIUM"
	DifficultyHard   Difficulty = "HARD"
)

var AllDifficulty = []Difficulty{
	DifficultyEasy,
	DifficultyMedium,
	DifficultyHard,
}

func (e Difficulty) IsValid() bool {
	switch e {
	case DifficultyEasy, DifficultyMedium, DifficultyHard:
		return true
	}
	return false
}

func (e Difficulty) String() string {
	return string(e)
}

func (e *Difficulty) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Difficulty(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Difficulty", str)
	}
	return nil
}

func (e Difficulty) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type Role string

const (
	RoleProblemsetter Role = "PROBLEMSETTER"
	RoleReviewer      Role = "REVIEWER"
	RoleAdmin         Role = "ADMIN"
)

var AllRole = []Role{
	RoleProblemsetter,
	RoleReviewer,
	RoleAdmin,
}

func (e Role) IsValid() bool {
	switch e {
	case RoleProblemsetter, RoleReviewer, RoleAdmin:
		return true
	}
	return false
}

func (e Role) String() string {
	return string(e)
}

func (e *Role) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Role(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

func (e Role) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type Status string

const (
	StatusWithproposer Status = "WITHPROPOSER"
	StatusWithreviewer Status = "WITHREVIEWER"
	StatusWithadmin    Status = "WITHADMIN"
	StatusSubmitted    Status = "SUBMITTED"
	StatusApproved     Status = "APPROVED"
	StatusRejected     Status = "REJECTED"
)

var AllStatus = []Status{
	StatusWithproposer,
	StatusWithreviewer,
	StatusWithadmin,
	StatusSubmitted,
	StatusApproved,
	StatusRejected,
}

func (e Status) IsValid() bool {
	switch e {
	case StatusWithproposer, StatusWithreviewer, StatusWithadmin, StatusSubmitted, StatusApproved, StatusRejected:
		return true
	}
	return false
}

func (e Status) String() string {
	return string(e)
}

func (e *Status) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Status(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Status", str)
	}
	return nil
}

func (e Status) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
