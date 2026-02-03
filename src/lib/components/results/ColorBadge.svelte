<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { cn } from "$lib/utils";

	type Props = {
		color: string;
		factor?: string;
		size?: "sm" | "md" | "lg";
	};

	let { color, factor, size = "md" }: Props = $props();

	const colorClasses: Record<string, string> = {
		Red: "bg-red-500 text-white hover:bg-red-600",
		Yellow: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
		Green: "bg-green-500 text-white hover:bg-green-600",
		Blue: "bg-blue-500 text-white hover:bg-blue-600"
	};

	const sizeClasses: Record<string, string> = {
		sm: "text-xs px-2 py-0.5",
		md: "text-sm px-3 py-1",
		lg: "text-lg px-4 py-2 font-semibold"
	};

	let colorClass = $derived(colorClasses[color] || "bg-gray-500 text-white");
	let sizeClass = $derived(sizeClasses[size]);
</script>

<Badge class={cn(colorClass, sizeClass, "rounded-full")}>
	{color}
	{#if factor}
		<span class="ml-1 opacity-80">({factor})</span>
	{/if}
</Badge>
