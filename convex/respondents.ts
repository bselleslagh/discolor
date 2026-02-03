import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { calculateScores, getPrimaryType, getSecondaryType, getColorForFactor } from "./scoring";

export const submit = mutation({
  args: {
    invitationId: v.id("invitations"),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    email: v.string(),
    responses: v.array(
      v.object({
        itemId: v.string(),
        factor: v.string(),
        value: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Validate we have exactly 16 responses
    if (args.responses.length !== 16) {
      throw new Error("Must have exactly 16 responses");
    }

    // Validate all responses are 1-5
    for (const response of args.responses) {
      if (response.value < 1 || response.value > 5) {
        throw new Error(`Invalid response value: ${response.value}`);
      }
    }

    // Create respondent
    const respondentId = await ctx.db.insert("respondents", {
      invitationId: args.invitationId,
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      email: args.email,
      completedAt: Date.now(),
    });

    // Store individual responses
    for (const response of args.responses) {
      await ctx.db.insert("responses", {
        respondentId,
        itemId: response.itemId,
        factor: response.factor,
        value: response.value,
      });
    }

    // Calculate scores
    const responseMap: Record<string, number> = {};
    for (const response of args.responses) {
      responseMap[response.itemId] = response.value;
    }

    const scores = calculateScores(responseMap);
    const primaryType = getPrimaryType(scores);
    const primaryColor = getColorForFactor(primaryType.split("/")[0]);
    const secondaryType = getSecondaryType(scores, primaryType);
    const secondaryColor = secondaryType ? getColorForFactor(secondaryType.split("/")[0]) : undefined;

    // Store scores
    await ctx.db.insert("scores", {
      respondentId,
      dScore: scores.D,
      iScore: scores.I,
      sScore: scores.S,
      cScore: scores.C,
      primaryType,
      primaryColor,
      secondaryType,
      secondaryColor,
    });

    // Mark invitation as completed
    await ctx.db.patch(args.invitationId, {
      status: "completed",
    });

    return respondentId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const respondents = await ctx.db
      .query("respondents")
      .withIndex("by_completedAt")
      .order("desc")
      .collect();

    const results = await Promise.all(
      respondents.map(async (respondent) => {
        const scores = await ctx.db
          .query("scores")
          .withIndex("by_respondent", (q) => q.eq("respondentId", respondent._id))
          .unique();
        return { ...respondent, scores };
      })
    );

    return results;
  },
});

export const getById = query({
  args: {
    respondentId: v.id("respondents"),
  },
  handler: async (ctx, args) => {
    const respondent = await ctx.db.get(args.respondentId);
    if (!respondent) {
      return null;
    }

    const scores = await ctx.db
      .query("scores")
      .withIndex("by_respondent", (q) => q.eq("respondentId", args.respondentId))
      .unique();

    const responses = await ctx.db
      .query("responses")
      .withIndex("by_respondent", (q) => q.eq("respondentId", args.respondentId))
      .collect();

    return { ...respondent, scores, responses };
  },
});

export const getByInvitation = query({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const respondent = await ctx.db
      .query("respondents")
      .withIndex("by_invitation", (q) => q.eq("invitationId", args.invitationId))
      .unique();

    if (!respondent) {
      return null;
    }

    const scores = await ctx.db
      .query("scores")
      .withIndex("by_respondent", (q) => q.eq("respondentId", respondent._id))
      .unique();

    return { ...respondent, scores };
  },
});
