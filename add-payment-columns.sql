-- Add transaction ID column to bookings table
ALTER TABLE bookings ADD COLUMN "transactionId" text;

-- (Optional) Add screenshot URL column if you set up storage later
ALTER TABLE bookings ADD COLUMN "paymentScreenshotUrl" text;
