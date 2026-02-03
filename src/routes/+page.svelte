<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { ColorBadge } from "$lib/components/results";
</script>

<div class="container mx-auto max-w-4xl px-4 py-12">
	<div class="space-y-12">
		<!-- Hero Section -->
		<div class="text-center">
			<h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
				Discover Your DISC Profile
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Understand your behavioral style and how you interact with others using the DISC personality
				assessment framework.
			</p>
			<div class="mt-8">
				<Button href="/admin" size="lg">Get Started</Button>
			</div>
		</div>

		<!-- DISC Colors Overview -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-center text-2xl">The Four DISC Types</Card.Title>
				<Card.Description class="text-center">
					Each person has a unique blend of these behavioral styles
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-3 rounded-lg border p-4">
						<div class="flex items-center gap-2">
							<ColorBadge color="Red" factor="D" />
							<span class="font-semibold">Dominance</span>
						</div>
						<p class="text-sm text-muted-foreground">
							Direct, results-oriented, competitive. Driven to achieve and take charge.
						</p>
					</div>

					<div class="space-y-3 rounded-lg border p-4">
						<div class="flex items-center gap-2">
							<ColorBadge color="Yellow" factor="I" />
							<span class="font-semibold">Influence</span>
						</div>
						<p class="text-sm text-muted-foreground">
							Enthusiastic, social, optimistic. Thrives on interaction and persuasion.
						</p>
					</div>

					<div class="space-y-3 rounded-lg border p-4">
						<div class="flex items-center gap-2">
							<ColorBadge color="Green" factor="S" />
							<span class="font-semibold">Steadiness</span>
						</div>
						<p class="text-sm text-muted-foreground">
							Supportive, patient, reliable. Values stability and creates harmony.
						</p>
					</div>

					<div class="space-y-3 rounded-lg border p-4">
						<div class="flex items-center gap-2">
							<ColorBadge color="Blue" factor="C" />
							<span class="font-semibold">Conscientiousness</span>
						</div>
						<p class="text-sm text-muted-foreground">
							Analytical, precise, systematic. Prioritizes accuracy and quality.
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- How It Works -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-center text-2xl">How It Works</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6 sm:grid-cols-3">
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
						>
							1
						</div>
						<h3 class="mb-2 font-semibold">Receive Invitation</h3>
						<p class="text-sm text-muted-foreground">
							An administrator sends you a personalized invitation link via email.
						</p>
					</div>

					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
						>
							2
						</div>
						<h3 class="mb-2 font-semibold">Answer Questions</h3>
						<p class="text-sm text-muted-foreground">
							Complete 16 questions about your behavioral preferences. It takes about 5-10 minutes.
						</p>
					</div>

					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
						>
							3
						</div>
						<h3 class="mb-2 font-semibold">Get Your Results</h3>
						<p class="text-sm text-muted-foreground">
							Instantly see your DISC profile with detailed insights and descriptions.
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Attribution -->
		<div class="text-center">
			<Badge variant="outline" class="text-sm">
				Based on the OSPP DISC Assessment Test
			</Badge>
		</div>
	</div>
</div>
