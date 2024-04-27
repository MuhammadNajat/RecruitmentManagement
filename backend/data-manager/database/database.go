package database

import (
	"context"
	"data-manager/graph/model"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	//"go.mongodb.org/mongo-driver/bson/primitive"
	//"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// var connectionString string = "mongodb+srv://userFromDSi:Bze7UojNtnQ76fZs@cluster0.5010nc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
var connectionString string = "mongodb://localhost:27017"

type database struct {
	client *mongo.Client
}

func Connect() *database {
	client, err := mongo.NewClient(options.Client().ApplyURI(connectionString))
	if err != nil {
		fmt.Println("!!! Couldn't create MongoDb client")
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		fmt.Println("!!! Couldn't connect client")
		log.Fatal(err)
	}
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		fmt.Println("!!! Couldn't ping Client")
		log.Fatal(err)
	}

	return &database{
		client: client,
	}
}

/***
USER CRUD Starts
***/

func (database database) CreateUser(input model.UserCreateInput) *model.UserCreateResponse {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05.000000000")

	insertedUser, error := userCollection.InsertOne(ctx,
		bson.M{"employeeID": input.EmployeeID, "name": input.Name, "email": input.Email, "role": input.Role, "password": input.Password, "createdAt": formattedTime, "updatedAt": ""})

	fmt.Println(">>> >>> Inserted Data:", insertedUser)

	if error != nil {
		fmt.Println("Error in CreateUser")
		return nil
		///log.Fatal(error)
	}

	insertedUserID := insertedUser.InsertedID.(primitive.ObjectID).Hex()
	user := model.UserCreateResponse{ID: insertedUserID, EmployeeID: input.EmployeeID, Name: input.Name, Email: input.Email, Role: input.Role, CreatedAt: formattedTime, UpdatedAt: nil}
	return &user
}

func (database database) GetUsers() []*model.User {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var users []*model.User
	cursor, error := userCollection.Find(ctx, bson.D{})
	if error != nil {
		fmt.Println("Error in GetUsers")
		return nil
		///log.Fatal(error)
	}

	if error = cursor.All(context.TODO(), &users); error != nil {
		panic(error)
	}

	return users
}

func (database database) GetUserByID(id string) *model.User {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	_id, _ := primitive.ObjectIDFromHex(id)
	//filter := bson.M{"_id": _id}
	filter := bson.M{"_id": _id}

	var user model.User
	err := userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		fmt.Println("Error in GetUserByID")
		return nil
		/////log.Fatal(err)
	}

	return &user

	/*var response = model.UserQueryResponse{
		ID:         user.ID,
		EmployeeID: user.EmployeeID,
		Name:       user.Name,
		Email:      user.Email,
		Role:       user.Role,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
	}

	return &response*/
}

func (database database) GetUserByEmployeeID(employeeID string) *model.User {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	//_id, _ := primitive.ObjectIDFromHex(id)
	//filter := bson.M{"_id": _id}
	filter := bson.M{"employeeID": employeeID}

	var user model.User
	err := userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		fmt.Println("Error in GetUserByEmployeeID")
		return nil
		/////log.Fatal(err)
	}

	/*var response = model.UserQueryResponse{
		ID:         user.ID,
		EmployeeID: user.EmployeeID,
		Name:       user.Name,
		Email:      user.Email,
		Role:       user.Role,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
	}

	return &response*/
	return &user
}

func (database database) GetUserByEmail(email string) *model.User {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	//_id, _ := primitive.ObjectIDFromHex(id)
	//filter := bson.M{"_id": _id}
	filter := bson.M{"email": email}

	var user model.User
	err := userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		fmt.Println("Error in GetUserByEmail")
		return nil
		/////log.Fatal(err)
	}

	/*var response = model.UserQueryResponse{
		ID:         user.ID,
		EmployeeID: user.EmployeeID,
		Name:       user.Name,
		Email:      user.Email,
		Role:       user.Role,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
	}

	return &response*/
	return &user
}

func (database database) UpdateUser(id string, input model.UserUpdateInput) *model.UserUpdateResponse {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	userUpdateInfo := bson.M{}

	if input.EmployeeID != nil {
		userUpdateInfo["employeeID"] = input.EmployeeID
	}
	if input.Name != nil {
		userUpdateInfo["name"] = input.Name
	}
	if input.Email != nil {
		userUpdateInfo["email"] = input.Email
	}
	if input.Password != nil {
		userUpdateInfo["password"] = input.Password
	}
	if input.Role != nil {
		userUpdateInfo["role"] = input.Role
	}

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05.000000000")

	userUpdateInfo["updatedAt"] = formattedTime

	_id, _ := primitive.ObjectIDFromHex(id)
	//_id := employeeID //???
	filter := bson.M{"_id": _id}

	var user model.User
	if errInSearching := userCollection.FindOne(ctx, filter).Decode(&user); errInSearching != nil {
		fmt.Println("!!! Error in UpdateUser (No user found)")
		return nil
	}

	updateCommand := bson.M{"$set": userUpdateInfo}

	results := userCollection.FindOneAndUpdate(ctx, filter, updateCommand, options.FindOneAndUpdate().SetReturnDocument(1))

	var userUpdateResponse model.UserUpdateResponse

	if err := results.Decode(&userUpdateResponse); err != nil {
		fmt.Println("Error in UpdateUser")
		return nil
		///log.Fatal(err)
	}

	return &userUpdateResponse
}

func (database database) DeleteUser(id string) *model.UserDeleteResponse {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var user model.User
	if errInSearching := userCollection.FindOne(ctx, filter).Decode(&user); errInSearching != nil {
		fmt.Println("!!! Error in DeleteUser (No user found)")
		return nil
	}

	_, errInDeleting := userCollection.DeleteOne(ctx, filter)
	if errInDeleting != nil {
		fmt.Println("!!! Error in DeleteUser")
		return nil
		///log.Fatal(err)
	}
	return &model.UserDeleteResponse{ID: id}
}

/***
USER CRUD Ends
***/

/***
PROBLEM-CATEGORY CRUD Starts
***/

func (database database) CreateProblemCategory(input model.ProblemCategoryCreateInput) *model.ProblemCategory {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	insertedCategory, error := categories.InsertOne(ctx,
		bson.M{"name": input.Name})

	fmt.Println(">>> >>> Inserted Category:", insertedCategory)

	if error != nil {
		fmt.Println("Error in CreateProblemCategory")
		return nil
		///log.Fatal(error)
	}

	insertedCategoryID := insertedCategory.InsertedID.(primitive.ObjectID).Hex()
	category := model.ProblemCategory{ID: insertedCategoryID, Name: input.Name}
	return &category
}

func (database database) GetProblemCategories() []*model.ProblemCategory {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var fetchedCategories []*model.ProblemCategory
	cursor, error := categories.Find(ctx, bson.D{})
	if error != nil {
		fmt.Println("Error in GetProblemCategories - 1")
		return nil
		///log.Fatal(error)
	}

	if error = cursor.All(context.TODO(), &fetchedCategories); error != nil {
		fmt.Println("Error in GetProblemCategories - 2")
		return nil
	}

	return fetchedCategories
}

func (database database) GetProblemCategoryByID(id string) *model.ProblemCategory {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}

	var fetchedCategory model.ProblemCategory
	err := categories.FindOne(ctx, filter).Decode(&fetchedCategory)
	if err != nil {
		fmt.Println("Error in GetProblemCategoryByID")
		return nil
		/////log.Fatal(err)
	}
	return &fetchedCategory
}

func (database database) GetProblemCategoryByName(name string) *model.ProblemCategory {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"name": name}

	var fetchedCategory model.ProblemCategory
	err := categories.FindOne(ctx, filter).Decode(&fetchedCategory)
	if err != nil {
		fmt.Println("Error in GetProblemCategoryByName")
		return nil
		/////log.Fatal(err)
	}
	return &fetchedCategory
}

func (database database) UpdateProblemCategory(id string, input model.ProblemCategoryUpdateInput) *model.ProblemCategoryUpdateResponse {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	categoryUpdateInfo := bson.M{}

	if input.Name != nil {
		categoryUpdateInfo["name"] = input.Name
	}

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}

	var fetchedCategory model.ProblemCategory
	if errInSearching := categories.FindOne(ctx, filter).Decode(&fetchedCategory); errInSearching != nil {
		fmt.Println("!!! Error in UpdateProblemCategory (No Problem Category found)")
		return nil
	}

	updateCommand := bson.M{"$set": categoryUpdateInfo}

	results := categories.FindOneAndUpdate(ctx, filter, updateCommand, options.FindOneAndUpdate().SetReturnDocument(1))

	var problemCategoryUpdateResponse model.ProblemCategoryUpdateResponse

	if err := results.Decode(&problemCategoryUpdateResponse); err != nil {
		fmt.Println("Error in UpdateProblemCategory (in results.Decode)")
		return nil
		///log.Fatal(err)
	}

	return &problemCategoryUpdateResponse
}

func (database database) DeleteProblemCategory(id string) *model.ProblemCategoryDeleteResponse {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var problemCategory model.ProblemCategory
	if errInSearching := categories.FindOne(ctx, filter).Decode(&problemCategory); errInSearching != nil {
		fmt.Println("!!! Error in DeleteProblemCategory (No category found)")
		return nil
	}

	_, errInDeleting := categories.DeleteOne(ctx, filter)
	if errInDeleting != nil {
		fmt.Println("!!! Error in DeleteProblemCategory")
		return nil
		///log.Fatal(err)
	}
	return &model.ProblemCategoryDeleteResponse{ID: id}
}

/***
PROBLEM-CATEGORY CRUD Ends
***/


/***
TAG CRUD Starts
***/

func (database database) CreateTag(input model.TagCreateInput) *model.TagCreateResponse {
	tags := database.client.Database("RecruitmentManagement").Collection("tags")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	insertedTag, error := tags.InsertOne(ctx,
		bson.M{"name": input.Name})

	fmt.Println(">>> >>> Inserted Tag:", insertedTag)

	if error != nil {
		fmt.Println("Error in CreateTag")
		return nil
		///log.Fatal(error)
	}

	insertedTagID := insertedTag.InsertedID.(primitive.ObjectID).Hex()
	tag := model.TagCreateResponse{ID: insertedTagID, Name: input.Name}
	return &tag
}

func (database database) GetTags() []*model.Tag {
	tagCollection := database.client.Database("RecruitmentManagement").Collection("tags")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var tags []*model.Tag
	cursor, error := tagCollection.Find(ctx, bson.D{})
	if error != nil {
		fmt.Println("Error in GetTags")
		return nil
		///log.Fatal(error)
	}

	if error = cursor.All(context.TODO(), &tags); error != nil {
		panic(error)
	}

	return tags
}

func (database database) GetTagByID(id string) *model.Tag {
	tagCollection := database.client.Database("RecruitmentManagement").Collection("tags")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	_id, _ := primitive.ObjectIDFromHex(id)
	//filter := bson.M{"_id": _id}
	filter := bson.M{"_id": _id}

	var tag model.Tag
	err := tagCollection.FindOne(ctx, filter).Decode(&tag)
	if err != nil {
		fmt.Println("Error in GetTagByID")
		return nil
		/////log.Fatal(err)
	}
	return &tag
}

func (database database) GetTagByName(name string) *model.Tag {
	tagCollection := database.client.Database("RecruitmentManagement").Collection("tags")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	//_id, _ := primitive.ObjectIDFromHex(id)
	//filter := bson.M{"_id": _id}
	filter := bson.M{"name": name}

	var tag model.Tag
	err := tagCollection.FindOne(ctx, filter).Decode(&tag)
	if err != nil {
		fmt.Println("Error in GetTagByName")
		return nil
		/////log.Fatal(err)
	}
	return &tag
}

func (database database) UpdateTag(id string, input model.TagUpdateInput) *model.TagUpdateResponse {
	tagCollection := database.client.Database("RecruitmentManagement").Collection("tags")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	tagUpdateInfo := bson.M{}

	if input.Name != nil {
		tagUpdateInfo["name"] = input.Name
	}

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}

	var tag model.Tag
	if errInSearching := tagCollection.FindOne(ctx, filter).Decode(&tag); errInSearching != nil {
		fmt.Println("!!! Error in UpdateTag (No tag found)")
		return nil
	}

	updateCommand := bson.M{"$set": tagUpdateInfo}

	results := tagCollection.FindOneAndUpdate(ctx, filter, updateCommand, options.FindOneAndUpdate().SetReturnDocument(1))

	var tagUpdateResponse model.TagUpdateResponse

	if err := results.Decode(&tagUpdateResponse); err != nil {
		fmt.Println("Error in UpdateTag")
		return nil
		///log.Fatal(err)
	}

	return &tagUpdateResponse
}

func (database database) DeleteTag(id string) *model.TagDeleteResponse {
	tagCollection := database.client.Database("RecruitmentManagement").Collection("tags")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var tag model.Tag
	if errInSearching := tagCollection.FindOne(ctx, filter).Decode(&tag); errInSearching != nil {
		fmt.Println("!!! Error in DeleteTag (No tag found)")
		return nil
	}

	_, errInDeleting := tagCollection.DeleteOne(ctx, filter)
	if errInDeleting != nil {
		fmt.Println("!!! Error in DeleteTag")
		return nil
		///log.Fatal(err)
	}
	return &model.TagDeleteResponse{ID: id}
}

/***
TAG CRUD Ends
***/


/***
PROBLEM CRUD Starts
***/

func (database database) CreateProblem(input model.ProblemCreateInput) *model.Problem {
	problemCollection := database.client.Database("RecruitmentManagement").Collection("problems")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05.000000000")

	insertedProblem, error := problemCollection.InsertOne(ctx,
		bson.M{
			"statement":           input.Statement,
			"image":               input.Image,
			"categoryIDs":		   input.CategoryIDs,
			"tagIDs":              input.TagIDs,
			"difficulty":          input.Difficulty,
			"status":              input.Status,
			"authorUserID":        input.AuthorUserID,
			"reviewerUserID":      input.ReviewerUserID,
			"approverAdminUserID": input.ApproverAdminUserID,
			"commentIDs":          input.CommentIDs,
			"createdAt":           formattedTime,
			"updatedAt":           ""})

	fmt.Println(">>> >>> Inserted Problem:", insertedProblem)

	if error != nil {
		fmt.Println("Error in CreateProblem")
		return nil
		///log.Fatal(error)
	}

	insertedProblemID := insertedProblem.InsertedID.(primitive.ObjectID).Hex()
	problem := model.Problem{
		ID:                  insertedProblemID,
		Statement:           input.Statement,
		Image:               input.Image,
		CategoryIDs:		 input.CategoryIDs,
		TagIDs:              input.TagIDs,
		Difficulty:          input.Difficulty,
		Status:              input.Status,
		AuthorUserID:        input.AuthorUserID,
		ReviewerUserID:      input.ReviewerUserID,
		ApproverAdminUserID: input.ApproverAdminUserID,
		CommentIDs:          input.CommentIDs,
		CreatedAt:           formattedTime,
		UpdatedAt:           nil}
	return &problem
}

func (database database) GetProblems() []*model.Problem {
	problemCollection := database.client.Database("RecruitmentManagement").Collection("problems")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var problems []*model.Problem
	cursor, error := problemCollection.Find(ctx, bson.D{})
	if error != nil {
		fmt.Println("Error in GetProblems")
		return nil
		///log.Fatal(error)
	}

	if error = cursor.All(context.TODO(), &problems); error != nil {
		panic(error)
	}

	return problems
}

func (database database) GetProblemByID(id string) *model.Problem {
	problemCollection := database.client.Database("RecruitmentManagement").Collection("problems")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	_id, _ := primitive.ObjectIDFromHex(id)
	//filter := bson.M{"_id": _id}
	filter := bson.M{"_id": _id}

	var problem model.Problem
	err := problemCollection.FindOne(ctx, filter).Decode(&problem)
	if err != nil {
		fmt.Println("Error in GetProblemByID")
		return nil
		/////log.Fatal(err)
	}

	return &problem
}

func (database database) UpdateProblem(id string, input model.ProblemUpdateInput) *model.ProblemUpdateResponse {
	problemCollection := database.client.Database("RecruitmentManagement").Collection("problems")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	problemUpdateInfo := bson.M{}

	if input.Statement != nil {
		problemUpdateInfo["statement"] = input.Statement
	}
	if input.Image != nil {
		problemUpdateInfo["image"] = input.Image
	}
	if input.CategoryIDs != nil {
		problemUpdateInfo["categoryIDs"] = input.CategoryIDs
	}
	if input.TagIDs != nil {
		problemUpdateInfo["tagIDs"] = input.TagIDs
	}
	if input.Difficulty != nil {
		problemUpdateInfo["difficulty"] = input.Difficulty
	}
	if input.Status != nil {
		problemUpdateInfo["status"] = input.Status
	}
	if input.AuthorUserID != nil {
		problemUpdateInfo["authorUserID"] = input.AuthorUserID
	}
	if input.ReviewerUserID != nil {
		problemUpdateInfo["reviewerUserID"] = input.ReviewerUserID
	}
	if input.ApproverAdminUserID != nil {
		problemUpdateInfo["approverAdminUserID"] = input.ApproverAdminUserID
	}
	if input.CommentIDs != nil {
		problemUpdateInfo["commentIDs"] = input.CommentIDs
	}

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05.000000000")

	problemUpdateInfo["updatedAt"] = formattedTime

	_id, _ := primitive.ObjectIDFromHex(id)
	//_id := employeeID //???
	filter := bson.M{"_id": _id}

	var problem model.Problem
	if errInSearching := problemCollection.FindOne(ctx, filter).Decode(&problem); errInSearching != nil {
		fmt.Println("!!! Error in UpdateProblem (No problem found)")
		return nil
	}

	updateCommand := bson.M{"$set": problemUpdateInfo}

	results := problemCollection.FindOneAndUpdate(ctx, filter, updateCommand, options.FindOneAndUpdate().SetReturnDocument(1))

	var problemUpdateResponse model.ProblemUpdateResponse

	if err := results.Decode(&problemUpdateResponse); err != nil {
		fmt.Println("Error in UpdateProblem")
		return nil
		///log.Fatal(err)
	}

	return &problemUpdateResponse
}

func (database database) DeleteProblem(id string) *model.ProblemDeleteResponse {
	problemCollection := database.client.Database("RecruitmentManagement").Collection("problems")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var problem model.Problem
	if errInSearching := problemCollection.FindOne(ctx, filter).Decode(&problem); errInSearching != nil {
		fmt.Println("!!! Error in DeleteProblem (No problem found)")
		return nil
	}

	_, errInDeleting := problemCollection.DeleteOne(ctx, filter)
	if errInDeleting != nil {
		fmt.Println("!!! Error in DeleteProblem")
		return nil
		///log.Fatal(err)
	}
	return &model.ProblemDeleteResponse{ID: id}
}

/***
PROBLEM CRUD Ends
***/