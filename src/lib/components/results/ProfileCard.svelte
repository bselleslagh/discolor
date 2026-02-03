<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import ColorBadge from "./ColorBadge.svelte";
	import type { ColorProfile } from "$lib/results";

	type Props = {
		profile: ColorProfile;
		isPrimary?: boolean;
	};

	let { profile, isPrimary = false }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title class="flex items-center gap-3">
				<ColorBadge color={profile.color_name} factor={profile.factor} size="lg" />
				{#if isPrimary}
					<Badge variant="outline">Primary Type</Badge>
				{:else}
					<Badge variant="secondary">Secondary Type</Badge>
				{/if}
			</Card.Title>
		</div>
		<Card.Description class="text-base">
			{profile.short_summary}
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<div>
			<h4 class="mb-2 font-semibold">Key Traits</h4>
			<div class="flex flex-wrap gap-2">
				{#each profile.traits as trait}
					<Badge variant="outline">{trait}</Badge>
				{/each}
			</div>
		</div>

		<Separator />

		<div>
			<h4 class="mb-2 font-semibold text-green-600">Strengths</h4>
			<ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
				{#each profile.strengths as strength}
					<li>{strength}</li>
				{/each}
			</ul>
		</div>

		<div>
			<h4 class="mb-2 font-semibold text-amber-600">Watch-outs</h4>
			<ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
				{#each profile.watch_outs as watchOut}
					<li>{watchOut}</li>
				{/each}
			</ul>
		</div>

		<Separator />

		<div>
			<h4 class="mb-2 font-semibold">Communication Tips</h4>
			<ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
				{#each profile.communication_tips as tip}
					<li>{tip}</li>
				{/each}
			</ul>
		</div>

		<div>
			<h4 class="mb-2 font-semibold">What Motivates You</h4>
			<ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
				{#each profile.typical_motivators as motivator}
					<li>{motivator}</li>
				{/each}
			</ul>
		</div>
	</Card.Content>
	<Card.Footer>
		<p class="text-xs italic text-muted-foreground">
			{profile.disclaimer_line}
		</p>
	</Card.Footer>
</Card.Root>
