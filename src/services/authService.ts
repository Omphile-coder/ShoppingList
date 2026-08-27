import api from "./api";
import { encryptData }  from "../utils/encryption"


export interface RegisterData { 
    email: string;
    password: string;
    name: string;
    surname: string;
    cellnumber: string;
}

export const registerUser = async (userData: RegisterData) => {
    //  Encrypt the password before sending it to the database
    const encryptedPassword = encryptData(userData.password);

    // Format the email to lowercase so logins are case-insensitive
    const formattedEmail = userData.email.trim().toLowerCase();


    // Send a POST request to create the user in db.json
    const response = await api.post("/users", {
        ...userData, email: formattedEmail,
        password:encryptedPassword,
    });

    return response.data;
}
 
export const getUserByEmail = async (email: string) => {
    // Send a GET request to search for a user by email
    const response = await api.get("/users", {
        params: {
            email: email.trim().toLowerCase(),
        },
    });


    // JSON Server returns an array, If we find a user then we take the first one
    return response.data.length > 0 ? response.data[0] : null;
}
 
// Update user data (using PATCH to only update specific fields)
export const updateUser = async (id: string, userData: Partial<RegisterData>) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
 }