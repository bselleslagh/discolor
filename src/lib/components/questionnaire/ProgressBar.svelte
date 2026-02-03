<script lang="ts">
	import * as Progress from "$lib/components/ui/progress";

	type Props = {
		current: number;
		total: number;
	};

	let { current, total }: Props = $props();

	let percentage = $derived(Math.round((current / total) * 100));
</script>

<div class="w-full space-y-2">
	<div class="flex justify-between text-sm text-muted-foreground">
		<span>Question {current} of {total}</span>
		<span>{percentage}% complete</span>
	</div>
	<Progress.Root value={percentage} max={100} class="h-2" />
</div>
