<script lang="ts">
	import { goto } from "$app/navigation";
	import { useConvexClient } from "convex-svelte";
	import { api } from "../../../../convex/_generated/api";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { InviteForm } from "$lib/components/admin";

	const client = useConvexClient();

	let isSubmitting = $state(false);
	let successMessage = $state("");
	let errorMessage = $state("");
	let lastToken = $state("");

	async function handleSubmit(email: string) {
		isSubmitting = true;
		errorMessage = "";
		successMessage = "";

		try {
			// Create invitation in database
			const result = await client.mutation(api.invitations.create, { email });

			lastToken = result.token;

			// Try to send email (may be skipped if Resend not configured)
			try {
				await client.action(api.emails.sendInvitation, { email, token: result.token });
				successMessage = `Invitation sent to ${email}`;
			} catch {
				// Email sending failed but invitation was created
				successMessage = `Invitation created for ${email}. Email sending may not be configured.`;
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Failed to create invitation";
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<div class="mb-8">
		<Button href="/admin" variant="ghost" class="mb-4">
			&larr; Back to Dashboard
		</Button>
		<h1 class="text-3xl font-bold">Send Invitation</h1>
		<p class="text-muted-foreground">
			Invite someone to complete the DISC personality assessment
		</p>
	</div>

	<div class="flex flex-col items-center space-y-6">
		<InviteForm onSubmit={handleSubmit} {isSubmitting} />

		{#if successMessage}
			<Card.Root class="w-full max-w-md border-green-500 bg-green-50">
				<Card.Content class="pt-6">
					<p class="text-center text-green-700">{successMessage}</p>
					{#if lastToken}
						<div class="mt-4 rounded bg-white p-3">
							<p class="mb-2 text-xs text-muted-foreground">Questionnaire link:</p>
							<code class="block break-all text-sm">
								{window.location.origin}/questionnaire/{lastToken}
							</code>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/if}

		{#if errorMessage}
			<Card.Root class="w-full max-w-md border-destructive bg-destructive/10">
				<Card.Content class="pt-6">
					<p class="text-center text-destructive">{errorMessage}</p>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
</div>
