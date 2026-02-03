<script lang="ts">
	import { useQuery } from "convex-svelte";
	import { api } from "../../../../../convex/_generated/api";
	import type { Id } from "../../../../../convex/_generated/dataModel";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import { ScoreChart, ProfileCard, ScoreBreakdown, ColorBadge } from "$lib/components/results";
	import {
		getColorProfile,
		getBlendedProfiles,
		getBlendedIntro,
		generalDisclaimer
	} from "$lib/results";
	import { formatDate } from "$lib/utils";
	import type { Scores } from "$lib/scoring";

	type Props = {
		data: {
			respondentId: string;
		};
	};

	let { data }: Props = $props();

	const respondent = useQuery(api.respondents.getById, () => ({
		respondentId: data.respondentId as Id<"respondents">
	}));

	// Computed data
	let scores = $derived(
		respondent.data?.scores
			? ({
					D: respondent.data.scores.dScore,
					I: respondent.data.scores.iScore,
					S: respondent.data.scores.sScore,
					C: respondent.data.scores.cScore
				} as Scores)
			: null
	);

	let primaryColor = $derived(respondent.data?.scores?.primaryColor ?? "");
	let secondaryColor = $derived(respondent.data?.scores?.secondaryColor);
	let isBlended = $derived(primaryColor.includes("/"));

	let primaryProfiles = $derived(
		isBlended
			? getBlendedProfiles(primaryColor)
			: primaryColor
				? [getColorProfile(primaryColor)!]
				: []
	);

	let secondaryProfile = $derived(
		secondaryColor && !secondaryColor.includes("/") ? getColorProfile(secondaryColor) : null
	);
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<Button href="/admin" variant="ghost" class="mb-4">
		&larr; Back to Dashboard
	</Button>

	{#if respondent.isLoading}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
					></div>
					<p class="text-muted-foreground">Loading results...</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if !respondent.data || !scores}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-destructive">Results Not Found</Card.Title>
				<Card.Description>
					We couldn't find the assessment results for this respondent.
				</Card.Description>
			</Card.Header>
		</Card.Root>
	{:else}
		<div class="space-y-8">
			<!-- Header -->
			<div>
				<h1 class="text-3xl font-bold">
					{respondent.data.firstName} {respondent.data.lastName}
				</h1>
				<div class="mt-2 space-y-1 text-muted-foreground">
					<p>Email: {respondent.data.email}</p>
					<p>Date of Birth: {formatDate(respondent.data.dateOfBirth)}</p>
				</div>
			</div>

			<!-- Primary Type Summary -->
			<Card.Root>
				<Card.Header class="text-center">
					<Card.Title>Primary Type</Card.Title>
					<div class="mt-4 flex justify-center gap-2">
						{#each primaryColor.split("/") as color}
							<ColorBadge {color} size="lg" />
						{/each}
					</div>
					{#if isBlended}
						<Card.Description class="mt-4">
							{getBlendedIntro(primaryColor)}
						</Card.Description>
					{/if}
				</Card.Header>
			</Card.Root>

			<!-- Score Visualization -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Scores</Card.Title>
					<Card.Description>
						How their responses map to each DISC dimension
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<ScoreChart {scores} />
				</Card.Content>
			</Card.Root>

			<!-- Score Breakdown Table -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Score Breakdown</Card.Title>
				</Card.Header>
				<Card.Content>
					<ScoreBreakdown {scores} />
				</Card.Content>
			</Card.Root>

			<Separator class="my-8" />

			<!-- Primary Type Details -->
			<div class="space-y-6">
				<h2 class="text-2xl font-semibold">
					{isBlended ? "Blended Profile" : "Primary Profile"}
				</h2>
				{#each primaryProfiles as profile}
					{#if profile}
						<ProfileCard {profile} isPrimary={true} />
					{/if}
				{/each}
			</div>

			<!-- Secondary Type (if applicable and not blended) -->
			{#if secondaryProfile}
				<Separator class="my-8" />
				<div class="space-y-6">
					<h2 class="text-2xl font-semibold">Secondary Profile</h2>
					<ProfileCard profile={secondaryProfile} isPrimary={false} />
				</div>
			{/if}

			<!-- Disclaimer -->
			<Card.Root class="bg-muted/50">
				<Card.Content class="py-6">
					<p class="text-center text-sm italic text-muted-foreground">
						{generalDisclaimer}
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
