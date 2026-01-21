/**
 * Admin utility functions
 * Since the database doesn't have a role field, we use email-based admin checks
 * You can modify this to use a different method (e.g., specific UserIDs, separate admin table)
 */

// List of admin emails - you can modify this based on your requirements
const ADMIN_EMAILS = [
  "admin@example.com",
  // Add more admin emails here
]

// Admin UserIDs (optional - use if you want to check by UserID instead)
const ADMIN_USER_IDS: number[] = [
  // Add admin UserIDs here if needed
  // Example: 1, 2, 3
]

/**
 * Check if an email belongs to an admin
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.some((adminEmail) => 
    email.toLowerCase() === adminEmail.toLowerCase()
  )
}

/**
 * Check if a UserID belongs to an admin
 */
export function isAdminUserID(userId: number): boolean {
  return ADMIN_USER_IDS.includes(userId)
}

/**
 * Determine if a user is an admin based on email or UserID
 */
export function isAdmin(email?: string, userId?: number): boolean {
  if (email && isAdminEmail(email)) {
    return true
  }
  if (userId && isAdminUserID(userId)) {
    return true
  }
  return false
}
