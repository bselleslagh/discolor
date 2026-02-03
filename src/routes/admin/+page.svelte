<script lang="ts">
	import { goto } from "$app/navigation";
	import { useQuery } from "convex-svelte";
	import { api } from "../../../convex/_generated/api";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { RespondentTable } from "$lib/components/admin";

	const respondents = useQuery(api.respondents.list, {});

	function handleViewResults(id: string) {
		goto(`/admin/results/${id}`);
	}
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Admin Dashboard</h1>
			<p class="text-muted-foreground">Manage DISC assessments and view results</p>
		</div>
		<Button href="/admin/invite">Send Invitation</Button>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Respondents</Card.Title>
			<Card.Description>
				People who have completed the DISC assessment
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if respondents.isLoading}
				<div class="flex items-center justify-center py-8">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
					></div>
				</div>
			{:else if respondents.data}
				<RespondentTable respondents={respondents.data} onViewResults={handleViewResults} />
			{/if}
		</Card.Content>
	</Card.Root>
</div>
