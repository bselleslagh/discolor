<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<header class="border-b border-border bg-card">
	<div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
		<a href="/" class="flex items-center gap-2">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<span class="text-lg font-bold">D</span>
			</div>
			<span class="text-xl font-semibold">DISC Assessment</span>
		</a>

		<nav class="flex items-center gap-4">
			<Button href="/admin" variant="ghost">Admin</Button>
		</nav>
	</div>
</header>
