# Backend API Specifications for Purchase System

## Purchase Endpoint

### POST /api/purchase

Process a purchase and deduct balance from user account.

**Request Body:**

```json
{
  "userId": "string",
  "totalAmount": number,
  "items": [
    {
      "productId": "string",
      "title": "string",
      "price": number,
      "quantity": number
    }
  ]
}
```

**Response:**

```json
{
  "success": boolean,
  "message": "string",
  "newBalance": number,
  "orderId": "string"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: User not authenticated
- `402 Payment Required`: Insufficient balance
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

## Favorites Endpoints

### GET /api/favorites?userId={userId}

Get user's favorites list.

**Response:**

```json
{
  "userId": "string",
  "items": [
    {
      "_id": "string",
      "id": "string",
      "title": "string",
      "price": number,
      "description": "string",
      "category": "string",
      "image_url": "string",
      "rating": {
        "rate": number,
        "count": number
      }
    }
  ]
}
```

### POST /api/favorites

Add product to user's favorites.

**Request Body:**

```json
{
  "userId": "string",
  "item": {
    "id": "string",
    "title": "string",
    "price": number,
    "description": "string",
    "category": "string",
    "image_url": "string",
    "rating": {
      "rate": number,
      "count": number
    }
  }
}
```

**Response:**

```json
{
  "userId": "string",
  "items": [
    {
      "_id": "string",
      "id": "string",
      "title": "string",
      "price": number,
      "description": "string",
      "category": "string",
      "image_url": "string",
      "rating": {
        "rate": number,
        "count": number
      }
    }
  ]
}
```

### DELETE /api/favorites/{itemId}

Remove product from user's favorites.

**Request Body:**

```json
{
  "userId": "string"
}
```

**Response:**

```json
{
  "userId": "string",
  "items": [
    {
      "_id": "string",
      "id": "string",
      "title": "string",
      "price": number,
      "description": "string",
      "category": "string",
      "image_url": "string",
      "rating": {
        "rate": number,
        "count": number
      }
    }
  ]
}
```

### DELETE /api/favorites

Clear all user's favorites.

**Request Body:**

```json
{
  "userId": "string"
}
```

**Response:**

```json
{
  "message": "All favorites cleared successfully"
}
```

## User Balance Endpoints

### GET /api/user/balance?userId={userId}

Get user's current balance.

**Response:**

```json
{
  "balance": number,
  "message": "string"
}
```

### PUT /api/user/balance

Update user's balance.

**Request Body:**

```json
{
  "userId": "string",
  "balance": number
}
```

**Response:**

```json
{
  "balance": number,
  "message": "string"
}
```

### GET /api/user/profile?userId={userId}

Get complete user profile including balance.

**Response:**

```json
{
  "id": "string",
  "username": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "phone": number,
  "adress": "string",
  "birthDate": "Date",
  "balance": number
}
```

## Implementation Notes

1. **Balance Validation**: Before processing purchase, verify user has sufficient balance
2. **Transaction Safety**: Use database transactions to ensure balance deduction and cart clearing happen atomically
3. **Order History**: Consider storing order history for future reference
4. **Error Handling**: Provide clear error messages for insufficient balance scenarios
5. **Authentication**: Ensure all endpoints require valid JWT token authentication
6. **Favorites Management**: Favorites should be user-specific and persist across sessions
7. **Duplicate Prevention**: Prevent adding the same product to favorites multiple times

## Example Backend Implementation (Node.js/Express)

```javascript
// Purchase endpoint
app.post("/api/purchase", authenticateToken, async (req, res) => {
  try {
    const { userId, totalAmount, items } = req.body;

    // Get user's current balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has sufficient balance
    if (user.balance < totalAmount) {
      return res.status(402).json({
        message: "Insufficient balance",
        currentBalance: user.balance,
        requiredAmount: totalAmount,
      });
    }

    // Process purchase in transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Deduct balance
      user.balance -= totalAmount;
      await user.save({ session });

      // Clear user's cart
      await Cart.deleteMany({ userId }, { session });

      // Create order record (optional)
      const order = new Order({
        userId,
        items,
        totalAmount,
        orderDate: new Date(),
      });
      await order.save({ session });

      await session.commitTransaction();

      res.json({
        success: true,
        message: "Purchase successful",
        newBalance: user.balance,
        orderId: order._id,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add to favorites endpoint
app.post("/api/favorites", authenticateToken, async (req, res) => {
  try {
    const { userId, item } = req.body;

    // Check if product is already in favorites
    const existingFavorite = await Favorite.findOne({
      userId,
      "item.id": item.id,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add to favorites
    const favorite = new Favorite({
      userId,
      item,
    });
    await favorite.save();

    // Get updated favorites list
    const favorites = await Favorite.find({ userId });

    res.json({
      userId,
      items: favorites.map((fav) => fav.item),
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```
