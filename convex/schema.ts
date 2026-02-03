import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  invitations: defineTable({
    email: v.string(),
    token: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("expired")),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  respondents: defineTable({
    invitationId: v.id("invitations"),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    email: v.string(),
    completedAt: v.number(),
  })
    .index("by_invitation", ["invitationId"])
    .index("by_completedAt", ["completedAt"]),

  responses: defineTable({
    respondentId: v.id("respondents"),
    itemId: v.string(),
    factor: v.string(),
    value: v.number(),
  }).index("by_respondent", ["respondentId"]),

  scores: defineTable({
    respondentId: v.id("respondents"),
    dScore: v.number(),
    iScore: v.number(),
    sScore: v.number(),
    cScore: v.number(),
    primaryType: v.string(),
    primaryColor: v.string(),
    secondaryType: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
  }).index("by_respondent", ["respondentId"]),
});
