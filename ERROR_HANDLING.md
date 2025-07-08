# Error Handling System

This document describes the comprehensive error handling system implemented in the backend.

## Overview

The error handling system provides consistent HTTP status codes and error messages across all API endpoints. It includes custom error classes, global error handling middleware, and proper validation.

## HTTP Status Codes Used

### 400 - Bad Request
- **ValidationError**: Invalid input data, missing required fields, or malformed requests
- **Examples**:
  - Missing required fields (email, password, etc.)
  - Invalid data types
  - Invalid status values
  - Password too short

### 401 - Unauthorized
- **UnauthorizedError**: Authentication required or failed
- **Examples**:
  - Missing or invalid JWT token
  - Invalid credentials (email/password)
  - Token expired
  - No authentication provided

### 403 - Forbidden
- **ForbiddenError**: Authenticated but not authorized
- **Examples**:
  - Customer trying to access admin-only endpoints
  - Admin trying to access customer-only endpoints
  - Insufficient permissions

### 404 - Not Found
- **NotFoundError**: Resource not found
- **Examples**:
  - Workshop not found
  - Booking not found
  - Invalid route/endpoint

### 409 - Conflict
- **ConflictError**: Resource conflict
- **Examples**:
  - Email already registered
  - Time slot already full
  - Customer already booked a time slot
  - Duplicate resource

### 500 - Internal Server Error
- **InternalServerError**: Unexpected server errors
- **Examples**:
  - Database connection issues
  - Unexpected exceptions
  - Configuration errors

### 503 - Service Unavailable
- **ServiceUnavailableError**: Service temporarily unavailable
- **Examples**:
  - Database maintenance
  - External service down
  - Stats service unavailable

## Error Response Format

All error responses follow this consistent format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "path": "/api/workshops",
    "method": "POST"
  }
}
```

## Custom Error Classes

### ValidationError (400)
Used for input validation failures.

```typescript
throw new ValidationError("Email and password are required");
```

### NotFoundError (404)
Used when resources are not found.

```typescript
throw new NotFoundError("Workshop not found");
```

### UnauthorizedError (401)
Used for authentication failures.

```typescript
throw new UnauthorizedError("Invalid credentials");
```

### ForbiddenError (403)
Used for authorization failures.

```typescript
throw new ForbiddenError("Admin access required");
```

### ConflictError (409)
Used for resource conflicts.

```typescript
throw new ConflictError("Email already registered");
```

### InternalServerError (500)
Used for unexpected server errors.

```typescript
throw new InternalServerError("Database connection failed");
```

### ServiceUnavailableError (503)
Used for temporary service unavailability.

```typescript
throw new ServiceUnavailableError("Service temporarily unavailable");
```

## Error Handling in Controllers

All controllers use the `asyncHandler` wrapper to automatically catch and handle errors:

```typescript
export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  // Controller logic here
  // Any thrown errors will be automatically caught and handled
});
```

## Global Error Handler

The global error handler middleware (`errorHandler`) in `app.ts` catches all unhandled errors and returns appropriate HTTP responses.

## Authentication Middleware

The authentication middleware provides proper 401/403 responses:

- `authenticateToken`: Validates JWT tokens
- `requireAdmin`: Ensures admin role
- `requireCustomer`: Ensures customer role
- `requireAuth`: Ensures any authenticated user

## Database Error Handling

Prisma errors are automatically mapped to appropriate HTTP status codes:

- `P2002` (Unique constraint violation) → 409 Conflict
- `P2025` (Record not found) → 404 Not Found
- `P2003` (Foreign key constraint violation) → 400 Bad Request

## Usage Examples

### In Controllers
```typescript
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, workshopId, timeSlotId } = req.body;
  
  if (!customerId || !workshopId || !timeSlotId) {
    throw new ValidationError("Customer ID, workshop ID, and time slot ID are required");
  }
  
  // Service call that might throw errors
  const booking = await BookingService.create(req.body);
  res.status(201).json(booking);
});
```

### In Services
```typescript
export async function verifyAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }
  return { token: generateToken({ id: admin.id, role: "admin" }) };
}
```

## Testing Error Responses

You can test error responses by:

1. **Missing required fields**: Send incomplete data
2. **Invalid credentials**: Use wrong email/password
3. **Unauthorized access**: Access protected endpoints without token
4. **Resource not found**: Use non-existent IDs
5. **Conflicts**: Try to register with existing email

## Monitoring and Logging

- All unexpected errors are logged to console
- Error responses include timestamps for debugging
- Health check endpoint available at `/health` 