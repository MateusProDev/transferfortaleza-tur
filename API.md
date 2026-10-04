# API Routes Documentation

All API routes are Vercel Serverless Functions (Next.js API Routes).

## Base URL
```
http://localhost:3000/api  (Development)
https://your-domain.com/api  (Production)
```

## Authentication
All admin routes should include an `authToken` in the Authorization header:
```
Authorization: Bearer {authToken}
```

---

## Banners API

### Get All Banners
```http
GET /api/banners
```

**Response:**
```json
[
  {
    "id": "banner-1",
    "title": "Welcome Banner",
    "subtitle": "Explore our tours",
    "imageUrl": "https://res.cloudinary.com/...",
    "imageAlt": "Welcome image",
    "buttonText": "Explore",
    "buttonLink": "https://example.com",
    "order": 1,
    "active": true,
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z"
  }
]
```

### Create Banner
```http
POST /api/banners
Content-Type: application/json

{
  "title": "Welcome Banner",
  "subtitle": "Explore our tours",
  "imageUrl": "https://res.cloudinary.com/...",
  "imageAlt": "Welcome image",
  "buttonText": "Explore",
  "buttonLink": "https://example.com",
  "order": 1,
  "active": true
}
```

**Response:**
```json
{
  "id": "banner-1",
  "message": "Banner created successfully"
}
```

### Update Banner
```http
PUT /api/banners/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "active": false
}
```

**Response:**
```json
{
  "message": "Banner updated successfully"
}
```

### Delete Banner
```http
DELETE /api/banners/{id}
```

**Response:**
```json
{
  "message": "Banner deleted successfully"
}
```

---

## Tours API

### Get All Tours
```http
GET /api/tours
GET /api/tours?active=true  (Only active tours)
```

**Response:**
```json
[
  {
    "id": "tour-1",
    "name": "City Tour",
    "description": "Explore the city",
    "longDescription": "...",
    "mainImageUrl": "https://res.cloudinary.com/...",
    "mainImageAlt": "City view",
    "galleryImages": [
      {
        "id": "img-1",
        "url": "https://res.cloudinary.com/...",
        "alt": "City street",
        "order": 1
      }
    ],
    "price": 150.00,
    "duration": "4 hours",
    "includesItems": ["Guide", "Transportation", "Lunch"],
    "excludesItems": ["Hotel pickup"],
    "featured": true,
    "active": true,
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z"
  }
]
```

### Create Tour
```http
POST /api/tours
Content-Type: application/json

{
  "name": "City Tour",
  "description": "Explore the city",
  "mainImageUrl": "https://res.cloudinary.com/...",
  "mainImageAlt": "City view",
  "galleryImages": [],
  "price": 150.00,
  "duration": "4 hours",
  "includesItems": ["Guide", "Transportation"],
  "excludesItems": ["Hotel pickup"],
  "featured": true,
  "active": true
}
```

### Update Tour
```http
PUT /api/tours/{id}
Content-Type: application/json

{
  "price": 200.00,
  "featured": false
}
```

### Delete Tour
```http
DELETE /api/tours/{id}
```

---

## Transfers API

### Get All Transfers
```http
GET /api/transfers
GET /api/transfers?active=true
```

**Response:**
```json
[
  {
    "id": "transfer-1",
    "name": "Airport to Hotel",
    "description": "Comfortable transfer service",
    "imageUrl": "https://res.cloudinary.com/...",
    "imageAlt": "Car image",
    "price": 75.00,
    "vehicleType": "SUV",
    "capacity": 4,
    "active": true,
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z"
  }
]
```

### Create Transfer
```http
POST /api/transfers
Content-Type: application/json

{
  "name": "Airport to Hotel",
  "description": "Comfortable transfer",
  "imageUrl": "https://res.cloudinary.com/...",
  "imageAlt": "Car image",
  "price": 75.00,
  "vehicleType": "SUV",
  "capacity": 4,
  "active": true
}
```

### Update Transfer
```http
PUT /api/transfers/{id}
```

### Delete Transfer
```http
DELETE /api/transfers/{id}
```

---

## Testimonials API

### Get All Testimonials
```http
GET /api/testimonials
```

**Response:**
```json
[
  {
    "id": "testimonial-1",
    "clientName": "John Doe",
    "clientPhoto": "https://res.cloudinary.com/...",
    "clientPhotoAlt": "Profile photo",
    "text": "Amazing experience! Highly recommended.",
    "rating": 5,
    "active": true,
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z"
  }
]
```

### Create Testimonial
```http
POST /api/testimonials
Content-Type: application/json

{
  "clientName": "John Doe",
  "clientPhoto": "https://res.cloudinary.com/...",
  "clientPhotoAlt": "Profile photo",
  "text": "Amazing experience!",
  "rating": 5,
  "active": true
}
```

### Update Testimonial
```http
PUT /api/testimonials/{id}
```

### Delete Testimonial
```http
DELETE /api/testimonials/{id}
```

---

## Blog API

### Get All Blog Posts
```http
GET /api/blog
GET /api/blog?published=true
```

**Response:**
```json
[
  {
    "id": "post-1",
    "title": "Travel Tips",
    "slug": "travel-tips",
    "summary": "Useful travel tips",
    "content": "<p>HTML content here</p>",
    "imageUrl": "https://res.cloudinary.com/...",
    "imageAlt": "Post image",
    "author": "Admin",
    "published": true,
    "publishedAt": "2026-08-17T10:00:00Z",
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z"
  }
]
```

### Create Blog Post
```http
POST /api/blog
Content-Type: application/json

{
  "title": "Travel Tips",
  "slug": "travel-tips",
  "summary": "Useful travel tips",
  "content": "<p>HTML content</p>",
  "imageUrl": "https://res.cloudinary.com/...",
  "imageAlt": "Post image",
  "author": "Admin",
  "published": true,
  "publishedAt": "2026-08-17T10:00:00Z"
}
```

### Update Blog Post
```http
PUT /api/blog/{id}
```

### Delete Blog Post
```http
DELETE /api/blog/{id}
```

---

## FAQ API

### Get All FAQ Items
```http
GET /api/faq
```

**Response:**
```json
[
  {
    "id": "faq-1",
    "question": "What time do tours start?",
    "answer": "Tours start at 9 AM",
    "order": 1,
    "active": true,
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z"
  }
]
```

### Create FAQ Item
```http
POST /api/faq
Content-Type: application/json

{
  "question": "What time do tours start?",
  "answer": "Tours start at 9 AM",
  "order": 1,
  "active": true
}
```

### Update FAQ Item
```http
PUT /api/faq/{id}
```

### Delete FAQ Item
```http
DELETE /api/faq/{id}
```

---

## Settings API

### Get Site Settings
```http
GET /api/settings
```

**Response:**
```json
{
  "id": "settings-1",
  "headerLogo": "https://res.cloudinary.com/...",
  "headerLogoAlt": "Logo",
  "menuLinks": [
    {
      "id": "link-1",
      "label": "Home",
      "url": "/",
      "order": 1,
      "active": true
    }
  ],
  "footerLogo": "https://res.cloudinary.com/...",
  "socialLinks": [
    {
      "id": "social-1",
      "platform": "instagram",
      "url": "https://instagram.com/passeiolegal",
      "icon": "instagram"
    }
  ],
  "contactInfo": {
    "email": "contact@passeiolegal.com",
    "phone": "+55 11 99999-9999",
    "whatsapp": "+55 11 99999-9999",
    "address": "Street Name, Number",
    "city": "City",
    "state": "State",
    "zipCode": "12345-678",
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "seoSettings": {
    "siteTitle": "Passeio Legal",
    "siteDescription": "Tour and transfer services",
    "keywords": ["tours", "transfers"],
    "ogImage": "https://res.cloudinary.com/...",
    "twitterHandle": "@passeiolegal"
  },
  "whatsappConfig": {
    "number": "+55 11 99999-9999",
    "defaultMessage": "Hello! I'm interested in your services."
  },
  "primaryColor": "#3b82f6",
  "secondaryColor": "#8b5cf6",
  "updatedAt": "2026-08-17T10:00:00Z"
}
```

### Update Settings
```http
PUT /api/settings
Content-Type: application/json

{
  "contactInfo": {
    "email": "new@example.com"
  }
}
```

---

## Cloudinary API

### Delete Image
```http
POST /api/cloudinary/delete
Content-Type: application/json

{
  "publicId": "passeio-legal/image-name"
}
```

**Response:**
```json
{
  "result": "ok"
}
```

---

## Authentication API

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "admin@example.com",
    "role": "admin"
  },
  "message": "Login successful"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid authentication"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Recommended: 100 requests per minute per IP
- Implement at server level or use middleware
- Consider implementing per-user limits for admin

---

## Best Practices

1. **Always validate input** on the server
2. **Include error messages** in responses
3. **Use appropriate HTTP status codes**
4. **Implement proper authentication** for admin routes
5. **Log all operations** for audit trail
6. **Cache responses** when appropriate
7. **Implement CORS** if needed
8. **Use pagination** for large datasets
9. **Validate file uploads** from Cloudinary
10. **Monitor API performance** and logs

---

**Last Updated**: 2026-08-17
**API Version**: 1.0.0
