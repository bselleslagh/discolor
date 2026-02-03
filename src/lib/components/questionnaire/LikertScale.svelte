<script lang="ts">
	import * as RadioGroup from "$lib/components/ui/radio-group";
	import { Label } from "$lib/components/ui/label";
	import { responseScale } from "$lib/questions";

	type Props = {
		value: number | undefined;
		onchange: (value: number) => void;
		name: string;
	};

	let { value, onchange, name }: Props = $props();

	let stringValue = $derived(value?.toString() ?? "");

	function handleChange(newValue: string) {
		onchange(parseInt(newValue, 10));
	}
</script>

<RadioGroup.Root
	value={stringValue}
	onValueChange={handleChange}
	class="flex flex-col gap-3 sm:flex-row sm:justify-between"
	{name}
>
	{#each responseScale.response_labels as label, index}
		{@const scaleValue = index + 1}
		<div class="flex items-center gap-2 sm:flex-col sm:items-center sm:gap-1">
			<RadioGroup.Item
				value={scaleValue.toString()}
				id="{name}-{scaleValue}"
				class="h-8 w-8 border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground sm:h-10 sm:w-10"
			/>
			<Label
				for="{name}-{scaleValue}"
				class="cursor-pointer text-sm text-muted-foreground sm:text-center sm:text-xs"
			>
				{label}
			</Label>
		</div>
	{/each}
</RadioGroup.Root>
