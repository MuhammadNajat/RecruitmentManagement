export function checkUserInputValidity(employeeID: string, emailAddress: string, name: string, role: string) {
    console.log("*** ~~~ checkUserValidity(): ");

    console.log("*** employeeID: ", employeeID);
    console.log("*** email: ", emailAddress);
    console.log("*** name: ", name);
    console.log("*** role: ", role);


    let inputValidity = [true, ""];
    if (employeeID.length == 0 || employeeID.length > 10) {
        console.log("Employee ID is too long");
        inputValidity = [false, "Proper employee ID is required"];
    }

    if (name.length < 3 || name.length > 50) {
        console.log("Name is too long");
        inputValidity = [false, "Name-length should be between 3 and 50 (inclusive)"];
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailAddressValid = emailRegex.test(emailAddress);

    if (!isEmailAddressValid) {
        console.log("Email address is invalid");
        inputValidity = [false, "Proper email address is required"];
    }

    return inputValidity;
}