<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import LikertScale from "./LikertScale.svelte";
	import type { Question } from "$lib/questions";

	type Props = {
		question: Question;
		questionNumber: number;
		totalQuestions: number;
		value: number | undefined;
		onAnswer: (value: number) => void;
		onNext: () => void;
		onPrevious: () => void;
		canGoBack: boolean;
		isLast: boolean;
	};

	let {
		question,
		questionNumber,
		totalQuestions,
		value,
		onAnswer,
		onNext,
		onPrevious,
		canGoBack,
		isLast
	}: Props = $props();

	let canProceed = $derived(value !== undefined);
</script>

<Card.Root class="w-full max-w-2xl">
	<Card.Header>
		<Card.Title class="text-lg sm:text-xl">
			{question.item_text}
		</Card.Title>
		<Card.Description>
			Select how much you agree or disagree with this statement
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<LikertScale {value} onchange={onAnswer} name="question-{questionNumber}" />
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline" onclick={onPrevious} disabled={!canGoBack}>
			Previous
		</Button>
		<Button onclick={onNext} disabled={!canProceed}>
			{isLast ? "Submit" : "Next"}
		</Button>
	</Card.Footer>
</Card.Root>
