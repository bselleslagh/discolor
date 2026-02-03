<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { ColorBadge } from "$lib/components/results";
	import { formatDateTime } from "$lib/utils";

	type Respondent = {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
		completedAt: number;
		scores: {
			dScore: number;
			iScore: number;
			sScore: number;
			cScore: number;
			primaryType: string;
			primaryColor: string;
			secondaryType?: string;
			secondaryColor?: string;
		} | null;
	};

	type Props = {
		respondents: Respondent[];
		onViewResults: (id: string) => void;
	};

	let { respondents, onViewResults }: Props = $props();
</script>

{#if respondents.length === 0}
	<div class="py-8 text-center text-muted-foreground">
		No respondents yet. Send an invitation to get started.
	</div>
{:else}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Email</Table.Head>
				<Table.Head>Primary Type</Table.Head>
				<Table.Head>Completed</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each respondents as respondent}
				<Table.Row>
					<Table.Cell class="font-medium">
						{respondent.firstName} {respondent.lastName}
					</Table.Cell>
					<Table.Cell>{respondent.email}</Table.Cell>
					<Table.Cell>
						{#if respondent.scores}
							<div class="flex gap-1">
								{#each respondent.scores.primaryColor.split("/") as color}
									<ColorBadge {color} size="sm" />
								{/each}
							</div>
						{:else}
							<Badge variant="secondary">N/A</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell class="text-muted-foreground">
						{formatDateTime(respondent.completedAt)}
					</Table.Cell>
					<Table.Cell class="text-right">
						<Button variant="outline" size="sm" onclick={() => onViewResults(respondent._id)}>
							View Results
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
