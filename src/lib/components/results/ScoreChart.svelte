<script lang="ts">
	import { cn } from "$lib/utils";
	import { scoreToPercentage, FACTOR_NAMES, COLOR_MAP } from "$lib/scoring";
	import type { Scores } from "$lib/scoring";

	type Props = {
		scores: Scores;
	};

	let { scores }: Props = $props();

	const factors = ["D", "I", "S", "C"] as const;

	const barColors: Record<string, string> = {
		D: "bg-red-500",
		I: "bg-yellow-400",
		S: "bg-green-500",
		C: "bg-blue-500"
	};
</script>

<div class="space-y-4">
	{#each factors as factor}
		{@const score = scores[factor]}
		{@const percentage = scoreToPercentage(score)}
		<div class="space-y-1">
			<div class="flex items-center justify-between text-sm">
				<span class="font-medium">
					{COLOR_MAP[factor]} ({FACTOR_NAMES[factor]})
				</span>
				<span class="text-muted-foreground">{score}/20</span>
			</div>
			<div class="h-4 w-full overflow-hidden rounded-full bg-secondary">
				<div
					class={cn("h-full rounded-full transition-all duration-500", barColors[factor])}
					style="width: {percentage}%"
				></div>
			</div>
		</div>
	{/each}
</div>
