<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { getScoreInterpretation, FACTOR_NAMES, COLOR_MAP } from "$lib/scoring";
	import type { Scores } from "$lib/scoring";
	import ColorBadge from "./ColorBadge.svelte";

	type Props = {
		scores: Scores;
	};

	let { scores }: Props = $props();

	const factors = ["D", "I", "S", "C"] as const;
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Factor</Table.Head>
			<Table.Head>Color</Table.Head>
			<Table.Head class="text-right">Score</Table.Head>
			<Table.Head>Interpretation</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each factors as factor}
			{@const score = scores[factor]}
			<Table.Row>
				<Table.Cell class="font-medium">{FACTOR_NAMES[factor]}</Table.Cell>
				<Table.Cell>
					<ColorBadge color={COLOR_MAP[factor]} size="sm" />
				</Table.Cell>
				<Table.Cell class="text-right">{score}/20</Table.Cell>
				<Table.Cell class="text-muted-foreground">{getScoreInterpretation(score)}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
