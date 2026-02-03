<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { themeState } from "$lib/theme.svelte";
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => themeState.toggle()}
	aria-label={themeState.isDark ? "Switch to light mode" : "Switch to dark mode"}
>
	{#if themeState.isDark}
		<Sun class="h-5 w-5" />
	{:else}
		<Moon class="h-5 w-5" />
	{/if}
</Button>
