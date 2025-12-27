# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "role": "admin|team_leader|deputy_leader|staff",
  "assignedArea": {
    "ward": "string",
    "zone": "string"
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "fullName": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

### Get Current User
```http
GET /auth/me
```

---

## Dashboard Endpoints

### Get Statistics
```http
GET /dashboard/stats
```

**Response:**
```json
{
  "totalHouseholds": 0,
  "totalPopulation": 0,
  "temporaryResidents": 0,
  "temporarilyAbsent": 0,
  "ageDistribution": {
    "preschool": 0,
    "student": 0,
    "working": 0,
    "retired": 0
  },
  "genderDistribution": {
    "male": 0,
    "female": 0
  },
  "expiringResidences": []
}
```

### Get Recent Activities
```http
GET /dashboard/activities?limit=10
```

---

## Household Endpoints

### Get All Households
```http
GET /households?page=1&limit=10&search=string
```

### Get Household by ID
```http
GET /households/:id
```

### Create Household
```http
POST /households
```

**Body:**
```json
{
  "householdHead": "objectId",
  "address": {
    "houseNumber": "string",
    "street": "string",
    "ward": "string",
    "district": "string",
    "city": "string"
  },
  "members": ["objectId"]
}
```

### Split Household
```http
POST /households/:id/split
```

**Body:**
```json
{
  "membersToSplit": ["objectId"],
  "newHouseholdHead": "objectId",
  "newAddress": {
    "houseNumber": "string",
    "street": "string",
    "ward": "string"
  }
}
```

### Update Household
```http
PUT /households/:id
```

### Delete Household
```http
DELETE /households/:id
```

---

## Population Endpoints

### Get All Population
```http
GET /population?page=1&limit=10&search=string&residenceStatus=string&gender=string
```

**Query Parameters:**
- `residenceStatus`: `permanent|temporary|temporarily_absent`
- `gender`: `male|female|other`

### Get Person by ID
```http
GET /population/:id
```

### Create Person
```http
POST /population
```

**Body:**
```json
{
  "fullName": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  "idNumber": "string",
  "household": "objectId",
  "relationshipToHead": "head|spouse|child|parent|sibling|other",
  "isNewborn": false,
  "occupation": "string",
  "previousAddress": "string"
}
```

### Update Person
```http
PUT /population/:id
```

### Mark as Deceased
```http
POST /population/:id/death
```

**Body:**
```json
{
  "deathDate": "date",
  "deathReason": "string"
}
```

### Mark as Moved Out
```http
POST /population/:id/moveout
```

**Body:**
```json
{
  "moveOutDate": "date",
  "moveOutDestination": "string"
}
```

---

## Temporary Residence Endpoints

### Get All Temporary Residences
```http
GET /temporary-residence?page=1&limit=10&type=string&status=string
```

**Query Parameters:**
- `type`: `temporary_residence|temporary_absence`
- `status`: `active|expired|extended|cancelled`

### Get Expiring Residences
```http
GET /temporary-residence/expiring?days=7
```

### Create Temporary Residence
```http
POST /temporary-residence
```

**Body:**
```json
{
  "person": "objectId",
  "type": "temporary_residence|temporary_absence",
  "startDate": "date",
  "endDate": "date",
  "address": "string",
  "reason": "string"
}
```

### Extend Residence
```http
POST /temporary-residence/:id/extend
```

**Body:**
```json
{
  "newEndDate": "date",
  "reason": "string"
}
```

### Cancel Residence
```http
POST /temporary-residence/:id/cancel
```

---

## Complaint Endpoints

### Get All Complaints
```http
GET /complaints?page=1&limit=10&category=string&status=string&priority=string
```

**Query Parameters:**
- `category`: `environment|security|infrastructure|social|other`
- `status`: `received|in_progress|resolved|rejected`
- `priority`: `low|medium|high|urgent`

### Get Complaint by ID
```http
GET /complaints/:id
```

### Create Complaint
```http
POST /complaints
```

**Body:**
```json
{
  "submittedBy": ["objectId"],
  "category": "environment|security|infrastructure|social|other",
  "title": "string",
  "description": "string",
  "priority": "low|medium|high|urgent"
}
```

### Update Complaint Status
```http
PUT /complaints/:id/status
```

**Body:**
```json
{
  "status": "received|in_progress|resolved|rejected",
  "note": "string",
  "resolution": "string"
}
```

### Merge Complaints
```http
POST /complaints/merge
```

**Body:**
```json
{
  "complaintIds": ["objectId"],
  "mainComplaintId": "objectId",
  "mergedTitle": "string",
  "mergedDescription": "string"
}
```

### Assign Complaint
```http
PUT /complaints/:id/assign
```

**Body:**
```json
{
  "assignedTo": "objectId"
}
```

### Get Complaint Statistics
```http
GET /complaints/stats?startDate=date&endDate=date
```

---

## Report Endpoints

### Get Population by Age Report
```http
GET /reports/population-by-age?ageCategory=string&format=json|excel
```

**Query Parameters:**
- `ageCategory`: `preschool|student|working|retired`
- `format`: `json|excel`

### Get Quarterly Complaint Report
```http
GET /reports/complaints-quarterly?year=2024&quarter=1
```

### Get Household Report
```http
GET /reports/households?format=json|excel
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "message": "Error description"
}
```

**401 Unauthorized**
```json
{
  "message": "Token is not valid"
}
```

**403 Forbidden**
```json
{
  "message": "User role is not authorized"
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "message": "Something went wrong!"
}
```
