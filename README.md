# Blog Server
# Projact Link:https://blog-backend-server-topaz.vercel.app/

## Overview
The goal of this assignment is to develop a backend for a blogging platform where users can write, update, and delete their blogs. The system will have two roles: Admin and User. The Admin has special permissions to manage users and their blogs, while users can perform CRUD operations on their own blogs. The backend will include secure authentication, role-based access control, and a public API for viewing blogs with search, sort, and filter functionalities.

---

## Technologies
- **TypeScript**
- **Node.js**
- **Express.js**
- **MongoDB with Mongoose**

---

## Features and Requirements

### 1. User Roles
#### Admin:
- Created manually in the database with predefined credentials.
- Can delete any blog.
- Can block any user by updating a property `isBlocked`.
- Cannot update any blog.

#### User:
- Can register and log in.
- Can create blogs (only when logged in).
- Can update and delete their own blogs.
- Cannot perform admin actions.

### 2. Authentication & Authorization
#### Authentication:
- Users must log in to perform write, update, and delete operations.

#### Authorization:
- Admin and User roles must be differentiated and secured.

### 3. Blog API
- A public API for reading blogs:
  - Includes blog title, content, author details, and other necessary information.
  - Supports search, sorting, and filtering functionalities.

---

## Models

### User Model:
| Property      | Type         | Description                                                    |
|---------------|--------------|----------------------------------------------------------------|
| name          | string       | The full name of the user.                                     |
| email         | string       | The email address of the user, used for authentication.       |
| password      | string       | The password for the user, securely stored.                   |
| role          | "admin" \| "user" | The role of the user. Default is "user".                   |
| isBlocked     | boolean      | Indicates whether the user is blocked. Default is `false`.     |
| createdAt     | Date         | The timestamp when the user was created.                      |
| updatedAt     | Date         | The timestamp of the last update to the user.                 |

### Blog Model:
| Property      | Type         | Description                                                    |
|---------------|--------------|----------------------------------------------------------------|
| title         | string       | The title of the blog post.                                   |
| content       | string       | The main body or content of the blog post.                   |
| author        | ObjectId     | Reference to the User model, indicating the blog post author. |
| isPublished   | boolean      | Indicates whether the blog post is published. Default is `true`.|
| createdAt     | Date         | The timestamp when the blog post was created.                |
| updatedAt     | Date         | The timestamp of the last update to the blog post.           |

---

## API Endpoints

### 1. Authentication

#### 1.1 Register User
**POST** `/api/auth/register`

**Description:** Registers a new user with the platform. It validates user data and saves it to the database.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
- **Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "statusCode": 201,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```
- **Failure (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "statusCode": 400,
  "error": { "details" },
  "stack": "error stack"
}
```

#### 1.2 Login User
**POST** `/api/auth/login`

**Description:** Authenticates a user with their email and password and generates a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
- **Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "statusCode": 200,
  "data": {
    "token": "string"
  }
}
```
- **Failure (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401,
  "error": { "details" },
  "stack": "error stack"
}
```

### 2. Blog Management

#### 2.1 Create Blog
**POST** `/api/blogs`

**Description:** Allows a logged-in user to create a blog by providing a title and content.

**Request Header:**
`Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "My First Blog",
  "content": "This is the content of my blog."
}
```

**Response:**
- **Success (201):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "statusCode": 201,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "author": { "details" }
  }
}
```

#### 2.2 Update Blog
**PATCH** `/api/blogs/:id`

**Description:** Allows a logged-in user to update their own blog by its ID.

**Request Header:**
`Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Blog Title",
  "content": "Updated content."
}
```

**Response:**
- **Success (200):**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "author": { "details" }
  }
}
```

#### 2.3 Delete Blog
**DELETE** `/api/blogs/:id`

**Description:** Allows a logged-in user to delete their own blog by its ID.

**Request Header:**
`Authorization: Bearer <token>`

**Response:**
- **Success (200):**
```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "statusCode": 200
}
```

#### 2.4 Get All Blogs (Public)
**GET** `/api/blogs`

**Description:** Provides a public API to fetch all blogs with options for searching, sorting, and filtering.

**Query Parameters:**
- `search`: Search blogs by title or content (e.g., `search=blogtitle`).
- `sortBy`: Sort blogs by specific fields such as `createdAt` or `title` (e.g., `sortBy=title`).
- `sortOrder`: Defines the sorting order. Accepts values `asc` (ascending) or `desc` (descending). (e.g., `sortOrder=desc`).
- `filter`: Filter blogs by author ID (e.g., `filter=authorId`).

**Example Request URL:**
```
/api/blogs?search=technology&sortBy=createdAt&sortOrder=desc&filter=60b8f42f9c2a3c9b7cbd4f18
```

**Response:**
- **Success (200):**
```json
{
  "success": true,
  "message": "Blogs fetched successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "author": { "details" }
    }
  ]
}
```

### 3. Admin Actions

#### 3.1 Block User
**PATCH** `/api/admin/users/:userId/block`

**Description:** Allows an admin to block a user by updating the `isBlocked` property to `true`.

**Request Header:**
`Authorization: Bearer <admin_token>`

**Response:**
- **Success (200):**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "statusCode": 200
}
```

#### 3.2 Delete Blog
**DELETE** `/api/admin/blogs/:id`

**Description:** Allows an admin to delete any blog by its ID.

**Request Header:**
`Authorization: Bearer <admin_token>`

**Response:**
- **Success (200):**
```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "statusCode": 200
}
```

---

