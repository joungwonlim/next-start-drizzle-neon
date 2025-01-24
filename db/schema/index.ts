// db/schema/index.ts
// This file exports all the schema definitions from different files under the `users` folder.
// It serves as a central location to import all your schema definitions.

export * from "./userActivities/userActivityLogs"; // Export all the schema definitions from the userActivityLogs.ts file.
export * from "./userActivities/userErrorLogs"; // Export all the schema definitions from the userErrorLogs.ts file.
export * from "./userActivities/userSigninLogs"; // Export all the schema definitions from the userSigninLogs.ts file.
export * from "./users/accounts"; // Export all the schema definitions from the accounts.ts file.
export * from "./users/authenticators"; // Export all the schema definitions from the authenticators.ts file.
export * from "./users/sessions"; // Export all the schema definitions from the sessions.ts file.
export * from "./users/users"; // Export all the schema definitions from the users.ts file.
export * from "./users/verificationTokens"; // Export all the schema definitions from the verificationTokens.ts file.
