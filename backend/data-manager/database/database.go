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

func (database database) CreateUser(input model.UserCreateInput) *model.UserCreateResponse {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05.000000000")

	insertedUser, error := userCollection.InsertOne(ctx,
		bson.M{"employeeID": input.EmployeeID, "name": input.Name, "email": input.Email, "role": input.Role, "password": input.Password, "adminAssignedPassword": input.AdminAssignedPassword, "changedAdminAssignedPassword": input.ChangedAdminAssignedPassword, "createdAt": formattedTime, "updatedAt": ""})

	fmt.Println(">>> >>> Inserted Data:", insertedUser)

	if error != nil {
		fmt.Println("Error in CreateUser")
		return nil
		///log.Fatal(error)
	}

	insertedUserID := insertedUser.InsertedID.(primitive.ObjectID).Hex()
	user := model.UserCreateResponse{ID: insertedUserID, EmployeeID: input.EmployeeID, Name: input.Name, Email: input.Email, Role: input.Role, Password: input.Password, AdminAssignedPassword: &input.AdminAssignedPassword, ChangedAdminAssignedPassword: &input.ChangedAdminAssignedPassword, CreatedAt: formattedTime, UpdatedAt: nil}
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

func (database database) GetUser(id string) *model.User {
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
		fmt.Println("Error in GetUser")
		return nil
		/////log.Fatal(err)
	}
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
		//userUpdateInfo["changedAdminAssignedPassword"] = true
	}
	if input.AdminAssignedPassword != nil {
		userUpdateInfo["adminAssignedPassword"] = input.AdminAssignedPassword
		//userUpdateInfo["changedAdminAssignedPassword"] = true
	}
	if input.ChangedAdminAssignedPassword != nil {
		userUpdateInfo["changedAdminAssignedPassword"] = input.ChangedAdminAssignedPassword
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

func (database database) CreateProblemCategory(input model.ProblemCategoryCreateInput) *model.ProblemCategory {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	insertedCategory, error := categories.InsertOne(ctx,
		bson.M{"name": input.Name, "subCategories": input.SubCategories})

	fmt.Println(">>> >>> Inserted Category:", insertedCategory)

	if error != nil {
		fmt.Println("Error in CreateProblemCategory")
		return nil
		///log.Fatal(error)
	}

	insertedCategoryID := insertedCategory.InsertedID.(primitive.ObjectID).Hex()
	category := model.ProblemCategory{ID: insertedCategoryID, Name: input.Name, SubCategories: input.SubCategories}
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

func (database database) GetProblemCategory(id string) *model.ProblemCategory {
	categories := database.client.Database("RecruitmentManagement").Collection("problemCategories")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}

	var fetchedCategory model.ProblemCategory
	err := categories.FindOne(ctx, filter).Decode(&fetchedCategory)
	if err != nil {
		fmt.Println("Error in GetProblemCategory")
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
	if input.SubCategories != nil {
		categoryUpdateInfo["subCategories"] = input.SubCategories
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
	var user model.User
	if errInSearching := categories.FindOne(ctx, filter).Decode(&user); errInSearching != nil {
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
