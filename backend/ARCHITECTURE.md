# System Architecture & Design Document

## 1. Design Philosophy
This application is designed to solve the "Expense Sharing" problem with a focus on data integrity and algorithmic efficiency. The core challenge is not just storing expenses, but efficiently calculating "who owes whom" and simplifying those debts.

## 2. Database Schema Design (MongoDB)
We chose MongoDB (NoSQL) for its flexibility with the `Expense` document structure, which can have variable numbers of splits (users involved).

### Collections

#### `users`
Represents an entity that participates in the system.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique)",
  "created_at": "Date"
}
```

#### `groups`
Represents a context in which expenses are shared (e.g., "Goa Trip").
```json
{
  "_id": "ObjectId",
  "name": "String",
  "members": ["ObjectId (Ref: User)"],
  "created_at": "Date"
}
```

#### `expenses`
The core ledger. We use a normalized strategy where each expense document contains all necessary information to reconstruct the balance.
```json
{
  "_id": "ObjectId",
  "description": "String",
  "amount": "Number",
  "payer": "ObjectId (Ref: User)",
  "group": "ObjectId (Ref: Group)",
  "splitType": "Enum('EQUAL', 'EXACT', 'PERCENTAGE')",
  "splits": [
    {
      "user": "ObjectId (Ref: User)",
      "amount": "Number", // The amount this user OWES for this expense
      "percentage": "Number" // Optional, for audit trail
    }
  ],
  "date": "Date"
}
```
**Decision Point**: Why store `amount` in `splits`?
*   For **EQUAL** splits, it's calculated ($100 / 4 = $25).
*   For **PERCENTAGE** splits, it's calculated ($100 * 25% = $25).
*   Storing the final calculated amount allows us to query balances efficiently without re-running the split logic every time.

## 3. Debt Simplification Algorithm
The problem of minimizing transactions is a "Minimum Cash Flow" problem.

### Algorithm Strategy
1.  **Build Net Balance Map**: Iterate through all expenses in a group.
    *   If Person A paid $100 for (A, B, C, D), then:
        *   A gets +75 (is owed)
        *   B gets -25 (owes)
        *   C gets -25 (owes)
        *   D gets -25 (owes)
2.  **Greedy Approach**:
    *   Find the person who **owes** the most (Max Debtor).
    *   Find the person who **is owed** the most (Max Creditor).
    *   The Max Debtor pays the Max Creditor the minimum of the two absolute amounts.
    *   Update balances and repeat until all balances are 0.

### Time Complexity
*   **Net Balance Calculation**: O(N * M) where N is expenses and M is users.
*   **Simplification**: O(U^2) in the worst case where U is the number of users, but typically much faster in practice.

## 4. API Structure
*   `POST /api/groups`: Create a group.
*   `POST /api/expenses`: Add an expense (trigger balance update).
*   `GET /api/groups/:id/balance`: Get the simplified debt graph.
*   `POST /api/settle`: Settle a specific debt (create a payment expense).
