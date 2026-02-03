<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	type Props = {
		onSubmit: (email: string) => Promise<void>;
		isSubmitting: boolean;
	};

	let { onSubmit, isSubmitting }: Props = $props();

	let email = $state("");
	let isValid = $derived(email.includes("@") && email.includes("."));

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (isValid && !isSubmitting) {
			await onSubmit(email);
			email = "";
		}
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header>
		<Card.Title>Send Invitation</Card.Title>
		<Card.Description>
			Enter the email address of the person you want to invite to take the DISC assessment.
		</Card.Description>
	</Card.Header>
	<form onsubmit={handleSubmit}>
		<Card.Content>
			<div class="space-y-2">
				<Label for="email">Email Address</Label>
				<Input
					id="email"
					type="email"
					bind:value={email}
					placeholder="candidate@example.com"
					disabled={isSubmitting}
					required
				/>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" disabled={!isValid || isSubmitting} class="w-full">
				{#if isSubmitting}
					Sending...
				{:else}
					Send Invitation
				{/if}
			</Button>
		</Card.Footer>
	</form>
</Card.Root>
