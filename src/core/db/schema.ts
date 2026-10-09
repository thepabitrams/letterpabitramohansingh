/* src/core/db/schema.ts */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const letters = sqliteTable('letters', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  senderUsername: text('sender_username').notNull(),
  recipientSlug: text('recipient_slug').notNull(),
  recipientName: text('recipient_name').notNull(),
  preset: text('preset').default('love').notNull(),
  message: text('message').notNull(),
  options: text('options'),
  status: text('status').default('pending').notNull(),
  reply: text('reply'),
  replyNote: text('reply_note'),
  expiryDays: integer('expiry_days').notNull(),
  createdAt: integer('created_at').notNull(),
  openedAt: integer('opened_at'),
  repliedAt: integer('replied_at'),
  expiresAt: integer('expires_at').notNull(),
})