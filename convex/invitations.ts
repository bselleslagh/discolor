import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const token = crypto.randomUUID();
    const now = Date.now();

    const invitationId = await ctx.db.insert("invitations", {
      email: args.email,
      token,
      status: "pending",
      createdAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { invitationId, token };
  },
});

export const getByToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (invitation.expiresAt && Date.now() > invitation.expiresAt) {
      return { ...invitation, status: "expired" as const };
    }

    return invitation;
  },
});

export const markCompleted = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invitationId, {
      status: "completed",
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("invitations").order("desc").collect();
  },
});
