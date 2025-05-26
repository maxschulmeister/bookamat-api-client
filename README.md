# Bookamat API Client

[![npm version](https://badge.fury.io/js/bookamat-api-client.svg)](https://badge.fury.io/js/bookamat-api-client)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript client for the [Bookamat API](https://www.bookamat.com/dokumentation/api/v1/), providing type-safe access to all Bookamat accounting features including bookings, assets, settings, and more.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Reference](#api-reference)
  - [Configuration](#configuration)
  - [Bookings](#bookings)
  - [Assets (Anlagen)](#assets-anlagen)
  - [Settings](#settings)
  - [Helper Methods](#helper-methods)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔒 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 🚀 **Complete API coverage** - All Bookamat API v1 endpoints supported
- 📄 **Pagination handling** - Automatic pagination for large datasets
- 🔐 **Secure authentication** - Built-in API key authentication
- 🛠 **Helper methods** - Convenient aggregation and utility functions
- 📦 **Zero dependencies** - Uses only native fetch API
- 🌍 **Multi-country support** - Support for different country configurations
- 📋 **CRUD operations** - Full Create, Read, Update, Delete support for all resources

## Installation

```bash
npm install bookamat-api-client
```

```bash
yarn add bookamat-api-client
```

```bash
pnpm add bookamat-api-client
```

```bash
bun add bookamat-api-client
```

## Quick Start

```typescript
import { BookamatClient } from "bookamat-api-client";

// Initialize the client
const client = new BookamatClient({
  year: "2024",
  username: "your-username",
  apiKey: "your-api-key",
  country: "at", // Optional, defaults to 'at'
});

// Fetch all bookings
const bookings = await client.listBookings();
console.log(`Found ${bookings.count} bookings`);

// Create a new booking
const newBooking = await client.createBooking({
  title: "Office Supplies",
  date: "2024-01-15",
  amounts: [
    {
      bankaccount: 1,
      costaccount: 4000,
      purchasetaxaccount: 3000,
      amount: "119.00",
      tax_percent: "20.00",
      deductibility_tax_percent: "100.00",
      deductibility_amount_percent: "100.00",
    },
  ],
});
```

## Authentication

The Bookamat API uses API key authentication. You can find your API key in your Bookamat account under **Mein Account**.

```typescript
const client = new BookamatClient({
  year: "2024", // Required: The accounting year
  username: "your-username", // Required: Your Bookamat username
  apiKey: "your-api-key", // Required: Your personal API key
  country: "at", // Optional: Country code (defaults to 'at')
  baseUrl: "https://www.bookamat.com/api/v1", // Optional: Custom base URL
});
```

## API Reference

### Configuration

#### Get Configuration

```typescript
const config = await client.getConfiguration();
```

#### Get User Details

```typescript
const user = await client.getUser();
```

### Bookings

Bookings represent tax-relevant income and expenses in your accounting system.

#### List Bookings

```typescript
// Basic listing
const bookings = await client.listBookings();

// With filters
const filteredBookings = await client.listBookings({
  group: "1", // '1' for income, '2' for expenses
  date_from: "2024-01-01",
  date_until: "2024-12-31",
  title_contains: "office",
  amount_min: 100,
  has_attachments: true,
  ordering: "-date", // Sort by date descending
});

// Get all bookings across all pages
const allBookings = await client.getAllBookings({
  group: "1",
  date_from: "2024-01-01",
});
```

#### Booking Details

```typescript
const booking = await client.getBookingDetails(123);
```

#### Create Booking

```typescript
const newBooking = await client.createBooking({
  title: "Office Equipment Purchase",
  date: "2024-01-15",
  date_invoice: "2024-01-14",
  description: "#INV-2024-001",
  vatin: "ATU12345678",
  country: "AT",
  amounts: [
    {
      bankaccount: 1,
      costaccount: 4000,
      purchasetaxaccount: 3000,
      amount: "1190.00",
      tax_percent: "20.00",
      deductibility_tax_percent: "100.00",
      deductibility_amount_percent: "100.00",
    },
  ],
});
```

#### Update Booking

```typescript
// Full update (PUT)
const updatedBooking = await client.updateBooking(123, {
  title: "Updated Office Equipment",
  date: "2024-01-15",
  amounts: [
    /* ... */
  ],
});

// Partial update (PATCH)
const partiallyUpdated = await client.partiallyUpdateBooking(123, {
  title: "New Title Only",
});
```

#### Delete Booking

```typescript
await client.deleteBooking(123);
```

#### Booking Attachments

```typescript
// List attachments for a booking
const attachments = await client.listBookingAttachments({
  booking: 123,
});

// Add attachment
const attachment = await client.addBookingAttachment({
  booking: 123,
  name: "invoice.pdf",
  file: "base64-encoded-file-content",
});

// Download attachment
const downloadData = await client.downloadAttachment(456);
const fileBuffer = Buffer.from(downloadData.file, "base64");

// Update attachment
await client.updateBookingAttachment(456, {
  name: "updated-invoice.pdf",
});

// Delete attachment
await client.deleteBookingAttachment(456);
```

#### Booking Tags

```typescript
// Get tags for a booking
const tags = await client.getBookingTags(123);

// Add tag to booking
const bookingTag = await client.addTagToBooking(123, {
  tag: 5, // Global tag ID
});

// Remove tag from booking
await client.removeTagFromBooking(123, 789); // booking ID, booking tag ID
```

### Assets (Anlagen)

Assets represent fixed assets and equipment in your accounting system.

#### List Assets

```typescript
const assets = await client.getAssets({
  page: 1,
  limit: 50,
});
```

#### Asset CRUD Operations

```typescript
// Create asset
const newAsset = await client.createAsset({
  name: "Company Vehicle",
  description: "BMW X3 for business use",
  acquisition_date: "2024-01-15",
  initial_value: "45000.00",
});

// Get asset details
const asset = await client.getAssetDetails(123);

// Update asset
const updatedAsset = await client.updateAsset(123, {
  name: "Updated Vehicle Name",
  current_value: "40000.00",
});

// Delete asset
await client.deleteAsset(123);
```

#### Asset Attachments

```typescript
// List asset attachments
const attachments = await client.listAssetAttachments({
  asset: 123,
});

// Add attachment to asset
const attachment = await client.addAssetAttachment({
  asset: 123,
  name: "purchase-contract.pdf",
  file: "base64-encoded-content",
});

// Download asset attachment
const downloadData = await client.downloadAssetAttachment(456);
```

### Settings

Access various account settings and configurations.

#### Bank Accounts

```typescript
// List bank accounts
const bankAccounts = await client.getBankAccounts();

// Get specific bank account
const bankAccount = await client.getBankAccountDetails(1);
```

#### Cost Accounts

```typescript
// List cost accounts
const costAccounts = await client.getCostAccounts();

// Get specific cost account
const costAccount = await client.getCostAccountDetails(4000);
```

#### Purchase Tax Accounts

```typescript
// List purchase tax accounts
const taxAccounts = await client.getPurchaseTaxAccounts();

// Get specific tax account
const taxAccount = await client.getPurchaseTaxAccountDetails(3000);
```

#### Cost Centres

```typescript
// List cost centres
const costCentres = await client.getCostCentres();

// Get specific cost centre
const costCentre = await client.getCostCentreDetails(1);
```

#### Foreign Business Bases

```typescript
// List foreign business bases
const foreignBases = await client.getForeignBusinessBases();

// Get specific foreign business base
const foreignBase = await client.getForeignBusinessBaseDetails(1);
```

#### Global Tags

```typescript
// List global tags
const globalTags = await client.getGlobalTags();

// Get specific global tag
const globalTag = await client.getGlobalTagDetails(5);
```

### Helper Methods

#### Get All Accounts

Fetch all account types in a single call:

```typescript
const allAccounts = await client.getAllAccounts();
console.log(allAccounts.costaccounts);
console.log(allAccounts.bankaccounts);
console.log(allAccounts.purchasetaxaccounts);
```

#### Get All Bookings

Automatically handle pagination to fetch all bookings:

```typescript
const allBookings = await client.getAllBookings({
  group: "1",
  date_from: "2024-01-01",
  date_until: "2024-12-31",
});
```

## Error Handling

The client throws descriptive errors for various scenarios:

```typescript
try {
  const booking = await client.getBookingDetails(999);
} catch (error) {
  if (error instanceof Error) {
    console.error("API Error:", error.message);
    // Example: "HTTP 404: Booking not found"
  }
}
```

Common error scenarios:

- **HTTP 401**: Invalid credentials or API key
- **HTTP 404**: Resource not found
- **HTTP 400**: Invalid request data
- **Network errors**: Connection issues

## TypeScript Support

The client is built with TypeScript and provides comprehensive type definitions:

```typescript
import type {
  Booking,
  BookingCreate,
  Asset,
  BankAccount,
  PaginatedResponse,
} from "bookamat-api-client";

// All API responses are properly typed
const bookings: PaginatedResponse<Booking> = await client.listBookings();
const booking: Booking = bookings.results[0];

// Create payloads are type-checked
const createData: BookingCreate = {
  title: "Test Booking",
  date: "2024-01-15",
  amounts: [
    /* properly typed amounts */
  ],
};
```

## Examples

### Complete Booking Workflow

```typescript
import { BookamatClient } from "bookamat-api-client";

const client = new BookamatClient({
  year: "2024",
  username: process.env.BOOKAMAT_USERNAME!,
  apiKey: process.env.BOOKAMAT_API_KEY!,
});

async function createBookingWithAttachment() {
  // 1. Create the booking
  const booking = await client.createBooking({
    title: "Office Supplies from Staples",
    date: "2024-01-15",
    date_invoice: "2024-01-14",
    description: "#INV-2024-001",
    amounts: [
      {
        bankaccount: 1,
        costaccount: 4000,
        purchasetaxaccount: 3000,
        amount: "119.00",
        tax_percent: "20.00",
        deductibility_tax_percent: "100.00",
        deductibility_amount_percent: "100.00",
      },
    ],
  });

  // 2. Add an attachment
  const attachment = await client.addBookingAttachment({
    booking: booking.id,
    name: "staples-invoice.pdf",
    file: "base64-encoded-pdf-content",
  });

  // 3. Add a tag
  await client.addTagToBooking(booking.id, {
    tag: 5, // Office supplies tag
  });

  console.log(`Created booking ${booking.id} with attachment ${attachment.id}`);
}
```

### Bulk Data Export

```typescript
async function exportAllData() {
  const [allBookings, allAssets, allAccounts] = await Promise.all([
    client.getAllBookings(),
    client.getAssets(),
    client.getAllAccounts(),
  ]);

  return {
    bookings: allBookings,
    assets: allAssets.results,
    accounts: allAccounts,
  };
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/bookamat-api-client.git
cd bookamat-api-client

# Install dependencies
bun install

# Run tests
bun test

# Build the project
bun run build

# Publish to npm (uses np for safe publishing)
bun run release
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Bookamat API Documentation](https://www.bookamat.com/dokumentation/api/v1/)
- 🐛 [Report Issues](https://github.com/your-org/bookamat-api-client/issues)
- 💬 [Discussions](https://github.com/your-org/bookamat-api-client/discussions)

## Disclaimer

This is an unofficial client library. While we strive for accuracy and completeness, please refer to the [official Bookamat API documentation](https://www.bookamat.com/dokumentation/api/v1/) for the most up-to-date information.

---

Made with ❤️ for the Bookamat community
