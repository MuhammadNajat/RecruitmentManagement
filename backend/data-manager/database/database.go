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

	insertedUser, error := userCollection.InsertOne(ctx,
		bson.M{"employeeID": input.EmployeeID, "name": input.Name, "email": input.Email, "role": input.Role, "password": input.Password, "adminAssignedPassword": input.AdminAssignedPassword, "changedAdminAssignedPassword": input.ChangedAdminAssignedPassword})

	fmt.Println(">>> >>> Inserted Data:", insertedUser)

	if error != nil {
		fmt.Println("Error in CreateUser")
		return nil
		///log.Fatal(error)
	}

	insertedUserID := insertedUser.InsertedID.(primitive.ObjectID).Hex()
	user := model.UserCreateResponse{ID: insertedUserID, EmployeeID: input.EmployeeID, Name: input.Name, Email: input.Email, Role: input.Role, Password: input.Password, AdminAssignedPassword: &input.AdminAssignedPassword, ChangedAdminAssignedPassword: &input.ChangedAdminAssignedPassword}
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

func (database database) GetUser(employeeID string) *model.User {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//defer recoverFunc()

	/*_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}*/
	filter := bson.M{"employeeID": employeeID}

	var user model.User
	err := userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		fmt.Println("Error in GetUser")
		return nil
		/////log.Fatal(err)
	}
	return &user
}

func (database database) UpdateUser(employeeID string, input model.UserUpdateInput) *model.UserUpdateResponse {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	jobDescriptionUpdateInfo := bson.M{}

	if input.EmployeeID != nil {
		jobDescriptionUpdateInfo["employeeID"] = input.EmployeeID
	}
	if input.Name != nil {
		jobDescriptionUpdateInfo["name"] = input.Name
	}
	if input.Email != nil {
		jobDescriptionUpdateInfo["email"] = input.Email
	}
	if input.Password != nil {
		jobDescriptionUpdateInfo["password"] = input.Password
		//jobDescriptionUpdateInfo["changedAdminAssignedPassword"] = true
	}
	if input.AdminAssignedPassword != nil {
		jobDescriptionUpdateInfo["adminAssignedPassword"] = input.AdminAssignedPassword
		//jobDescriptionUpdateInfo["changedAdminAssignedPassword"] = true
	}
	if input.ChangedAdminAssignedPassword != nil {
		jobDescriptionUpdateInfo["changedAdminAssignedPassword"] = input.ChangedAdminAssignedPassword
	}
	if input.Role != nil {
		jobDescriptionUpdateInfo["role"] = input.Role
	}

	//_id, _ := primitive.ObjectIDFromHex(id)
	//_id := employeeID //???
	filter := bson.M{"employeeID": employeeID}

	var user model.User
	if errInSearching := userCollection.FindOne(ctx, filter).Decode(&user); errInSearching != nil {
		fmt.Println("!!! Error in UpdateUser (No user found)")
		return nil
	}

	updateCommand := bson.M{"$set": jobDescriptionUpdateInfo}

	results := userCollection.FindOneAndUpdate(ctx, filter, updateCommand, options.FindOneAndUpdate().SetReturnDocument(1))

	var userUpdateResponse model.UserUpdateResponse

	if err := results.Decode(&userUpdateResponse); err != nil {
		fmt.Println("Error in UpdateUser")
		return nil
		///log.Fatal(err)
	}

	return &userUpdateResponse
}

func (database database) DeleteUser(employeeID string) *model.UserDeleteResponse {
	userCollection := database.client.Database("RecruitmentManagement").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	//_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"employeeID": employeeID}
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
	return &model.UserDeleteResponse{EmployeeID: employeeID}
}
