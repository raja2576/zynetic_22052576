# 🌟 Product Management Web App

Welcome to the **Product Management Web App** — a feature-rich, modern full-stack application designed for managing products with role-based access. Built with **Spring Boot**, **React.js**, **JWT Authentication**, and PostgreSQL.

---

## 🚀 Live Demo

🔗 **Frontend (Netlify)**: [https://projectmang.netlify.app](https://projectmang.netlify.app)  
🔗 **Backend (Render)**: [https://backend-server-1dgg.onrender.com](https://backend-server-1dgg.onrender.com)

---

## 🧠 Tech Stack

### 🔹 Frontend
- **React.js** with Hooks
- **React Router DOM** for routing
- **Bootstrap** for styling

### 🔹 Backend
- **Spring Boot 3.4.4**
- **Java 21**
- **Spring Security + JWT** for Authentication & Authorization
- **PostgreSQL** Database
- **JPA (Hibernate)** for ORM

---

## 🔐 Features

✅ User Signup & Login  
✅ JWT-Based Secure Authentication  
✅ Role-Based Access (Admin/User)  
✅ Product CRUD Operations (Admin Only)  
✅ Product Filtering, Searching & Sorting (Dashboard)  
✅ Image Upload for Products  
✅ Responsive UI with Bootstrap  

---

## 📸 Screenshots


### 🔐 Login Page
![Login](zynetic_assignment_frontend/public/1.jpg)

### 📝 Signup Page
![Signup](zynetic_assignment_frontend/public/2.jpg)

### 📦 Product Dashboard
![Dashboard](zynetic_assignment_frontend/public/userbased.jpg)

### ➕ Add/Edit Product (Admin only)
![Add Product](zynetic_assignment_frontend/public/5.jpg)

---

## 🧰 Project Setup

### 🖥️ Backend (Spring Boot)

#### 1. Clone the Repository:
```bash
git clone [https://github.com/https://github.com/raja2576/zynetic_22052576.git](https://github.com/raja2576/zynetic_22052576.git)
cd productManagementApp         --- -> Backend
cd zynetic_assignment_frontend  -----> Frontend
```

#### 2. Configure PostgreSQL
Update your `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/your_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### 3. Run the App
```bash
./mvnw spring-boot:run
```

---

### 🌐 Frontend (React.js)

#### 1. Navigate to React Project:
```bash
cd zynetic_assignment_frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Build Project
```bash
npm run build
```

#### 4. Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```
> If using Vite, your build folder is `dist` not `build`

---

## 🌍 Deployment Notes

### 🔁 Keep Render Backend Awake (Optional for free tier)
To prevent your backend from sleeping on Render:
```js
useEffect(() => {
  const ping = () => {
    fetch('https://backend-server-1dgg.onrender.com/api/auth/ping')
      .then(() => console.log("Backend pinged"));
  };
  const interval = setInterval(ping, 270000); // every 4.5 minutes
  ping();
  return () => clearInterval(interval);
}, []);
```
> Added this Code to Keep the server alive (As i m working on free tier subscrpition)


---

````markdown
# 📦 Product Management App – API Documentation


This API supports user authentication, admin functionality, product management, and image serving.

---

## 🛡️ Authentication API – `/api/auth`

### 🔐 POST `/api/auth/signup`

Register a new **User** account.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
````

#### Responses

* `200 OK` – Returns the created user.
* `409 Conflict` – If user already exists.

---

### 🔐 POST `/api/auth/admin/signup`

Register a new **Admin** account.

#### Request Body

```json
{
  "email": "admin@example.com",
  "password": "yourPassword"
}
```

#### Responses

* `200 OK` – Returns the created admin user.
* `409 Conflict` – If admin already exists.

---

### 🔐 POST `/api/auth/login`

Login as a user or admin.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

#### Responses

* `200 OK`

```json
{
  "token": "JWT_TOKEN"
}
```

* `401 Unauthorized` – Invalid credentials.

---

## 🖼️ Image API – `/api/products/image`

### 🖼️ GET `/api/products/image/{filename}`

Serves an uploaded product image.

#### Path Parameter

* `filename`: Name of the file (e.g. `watch.jpg`)

#### Responses

* `200 OK` – Returns the image file.
* `404 Not Found` – If the file does not exist.

---

## 🛍️ Product API – `/api/products`

All endpoints below require **JWT authentication**.

---

### ➕ POST `/api/products/add`

Create a new product.
**Access**: `ADMIN` only

#### Request Body

```json
{
  "name": "Smartphone",
  "price": 599.99,
  "category": "Electronics",
  "rating": 4.5,
  "description": "High-end Android smartphone"
}
```

#### Response

* `200 OK` – Returns the created product.

---

### 📄 GET `/api/products/all`

Get a list of all products.
**Access**: `USER` or `ADMIN`

#### Response

* `200 OK` – List of product items.

---

### ❌ DELETE `/api/products/remove/{id}`

Delete a product by ID.
**Access**: `ADMIN` only

#### Path Parameter

* `id`: Product ID

#### Response

* `200 OK` – If deletion is successful.

---

### ✏️ PUT `/api/products/modify`

Update an existing product.
**Access**: `ADMIN` only

#### Request Body

Same format as POST `/add`

---

### 📦 GET `/api/products/filter/category`

Filter products by category.
**Access**: `USER` or `ADMIN`

#### Query Parameter

* `category`: e.g. `Electronics`

---

### 💸 GET `/api/products/filter/price`

Filter products by price range.
**Access**: `USER` or `ADMIN`

#### Query Parameters

* `min`: Minimum price
* `max`: Maximum price

---

### ⭐ GET `/api/products/filter/rating`

Filter products by rating.
**Access**: `USER` or `ADMIN`

#### Query Parameter

* `rate`: Minimum rating (e.g. `4.0`)

---

### 🔍 GET `/api/products/search`

Search products by keyword.
**Access**: `USER` or `ADMIN`

#### Query Parameter

* `text`: Keyword (e.g. `laptop`)

---

## 🔑 Authentication Summary

| Endpoint                       | Role Required   |
| ------------------------------ | --------------  |
| `POST /api/auth/signup`        | ❌ Public       |
| `POST /api/auth/admin/signup`  | ❌ Public       |
| `POST /api/auth/login`         | ❌ Public       |
| `POST /api/products/add`       | ✅ `ADMIN`      |
| `GET /api/products/all`        | ✅ `USER/ADMIN` |
| `DELETE /api/products/remove`  | ✅ `ADMIN`      |
| `PUT /api/products/modify`     | ✅ `ADMIN`      |
| `GET /api/products/filter/...` | ✅ `USER/ADMIN` |
| `GET /api/products/search`     | ✅ `USER/ADMIN` |

---

## 🧪 Testing Notes

Use tools like **Postman**, **Insomnia**, or cURL.

For protected routes, include the JWT token in the headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📁 File Uploads

Images should be stored in the `/uploads` directory. File retrieval is handled via:

```
GET /api/products/image/{filename}
```

---

## 👨‍💻 Built With

* Spring Boot
* Spring Security (JWT)
* Maven
* Java 17+

---


## 🧑‍💻 Author

Made with ❤️ by Raja 
Connect on [LinkedIn]([https://linkedin.com/in/your-profile](http://linkedin.com/in/raja-kumar-rana-a60715252))

---


