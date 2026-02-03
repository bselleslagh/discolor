<script lang="ts">
	import { goto } from "$app/navigation";
	import { useQuery, useConvexClient } from "convex-svelte";
	import { api } from "../../../../convex/_generated/api";
	import type { Id } from "../../../../convex/_generated/dataModel";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { ProgressBar, QuestionCard, UserInfoForm } from "$lib/components/questionnaire";
	import { getShuffledQuestions, type Question } from "$lib/questions";
	import type { Response } from "$lib/scoring";

	type Props = {
		data: {
			token: string;
		};
	};

	let { data }: Props = $props();

	const client = useConvexClient();

	// State
	type Step = "loading" | "invalid" | "completed" | "info" | "questions";
	let step = $state<Step>("loading");
	let firstName = $state("");
	let lastName = $state("");
	let dateOfBirth = $state("");
	let currentQuestionIndex = $state(0);
	let answers = $state<Record<string, number>>({});
	let questions = $state<Question[]>([]);
	let isSubmitting = $state(false);
	let invitationId = $state<Id<"invitations"> | null>(null);
	let email = $state("");

	// Convex queries
	const invitation = useQuery(api.invitations.getByToken, () => ({ token: data.token }));
	const existingRespondent = useQuery(
		api.respondents.getByInvitation,
		() => (invitationId ? { invitationId } : "skip")
	);

	// React to invitation data
	$effect(() => {
		const inv = invitation.data;
		if (invitation.isLoading) {
			step = "loading";
			return;
		}

		if (!inv) {
			step = "invalid";
			return;
		}

		if (inv.status === "expired") {
			step = "invalid";
			return;
		}

		invitationId = inv._id;
		email = inv.email;

		if (inv.status === "completed") {
			step = "completed";
			return;
		}

		// Initialize questions if not already done
		if (questions.length === 0) {
			questions = getShuffledQuestions();
		}

		if (step === "loading") {
			step = "info";
		}
	});

	// React to existing respondent
	$effect(() => {
		if (existingRespondent.data && step !== "completed") {
			step = "completed";
		}
	});

	// Computed
	let currentQuestion = $derived(questions[currentQuestionIndex]);
	let totalQuestions = $derived(questions.length);
	let currentAnswer = $derived(currentQuestion ? answers[currentQuestion.item_id] : undefined);
	let isLastQuestion = $derived(currentQuestionIndex === totalQuestions - 1);
	let canGoBack = $derived(currentQuestionIndex > 0);

	// Handlers
	function handleInfoSubmit() {
		step = "questions";
	}

	function handleAnswer(value: number) {
		if (currentQuestion) {
			answers = { ...answers, [currentQuestion.item_id]: value };
		}
	}

	function handlePrevious() {
		if (canGoBack) {
			currentQuestionIndex--;
		}
	}

	async function handleNext() {
		if (isLastQuestion) {
			await handleSubmit();
		} else {
			currentQuestionIndex++;
		}
	}

	async function handleSubmit() {
		if (!invitationId || isSubmitting) return;

		isSubmitting = true;

		try {
			// Build responses array
			const responses: Response[] = questions.map((q) => ({
				itemId: q.item_id,
				factor: q.factor,
				value: answers[q.item_id]
			}));

			// Submit to Convex
			await client.mutation(api.respondents.submit, {
				invitationId,
				firstName,
				lastName,
				dateOfBirth,
				email,
				responses
			});

			// Navigate to results
			goto(`/questionnaire/${data.token}/results`);
		} catch (error) {
			console.error("Failed to submit:", error);
			isSubmitting = false;
		}
	}

	function handleViewResults() {
		goto(`/questionnaire/${data.token}/results`);
	}
</script>

<div class="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
	{#if step === "loading"}
		<Card.Root class="w-full max-w-md">
			<Card.Content class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
					></div>
					<p class="text-muted-foreground">Loading questionnaire...</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if step === "invalid"}
		<Card.Root class="w-full max-w-md">
			<Card.Header>
				<Card.Title class="text-destructive">Invalid or Expired Link</Card.Title>
				<Card.Description>
					This questionnaire link is no longer valid. It may have expired or already been used.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground">
					Please contact the administrator if you believe this is an error.
				</p>
			</Card.Content>
		</Card.Root>
	{:else if step === "completed"}
		<Card.Root class="w-full max-w-md">
			<Card.Header>
				<Card.Title>Assessment Already Completed</Card.Title>
				<Card.Description>
					You have already completed this DISC assessment.
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button onclick={handleViewResults} class="w-full">View Your Results</Button>
			</Card.Footer>
		</Card.Root>
	{:else if step === "info"}
		<UserInfoForm
			{firstName}
			{lastName}
			{dateOfBirth}
			{email}
			onSubmit={handleInfoSubmit}
			onfirstNameChange={(v) => (firstName = v)}
			onlastNameChange={(v) => (lastName = v)}
			ondateOfBirthChange={(v) => (dateOfBirth = v)}
		/>
	{:else if step === "questions" && currentQuestion}
		<div class="w-full max-w-2xl space-y-6">
			<ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
			<QuestionCard
				question={currentQuestion}
				questionNumber={currentQuestionIndex + 1}
				{totalQuestions}
				value={currentAnswer}
				onAnswer={handleAnswer}
				onNext={handleNext}
				onPrevious={handlePrevious}
				{canGoBack}
				isLast={isLastQuestion}
			/>
			{#if isSubmitting}
				<div class="text-center text-sm text-muted-foreground">Submitting your responses...</div>
			{/if}
		</div>
	{/if}
</div>
