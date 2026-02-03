<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	type Props = {
		firstName: string;
		lastName: string;
		dateOfBirth: string;
		email: string;
		onSubmit: () => void;
		onfirstNameChange: (value: string) => void;
		onlastNameChange: (value: string) => void;
		ondateOfBirthChange: (value: string) => void;
	};

	let {
		firstName,
		lastName,
		dateOfBirth,
		email,
		onSubmit,
		onfirstNameChange,
		onlastNameChange,
		ondateOfBirthChange
	}: Props = $props();

	let isValid = $derived(
		firstName.trim().length > 0 && lastName.trim().length > 0 && dateOfBirth.length > 0
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (isValid) {
			onSubmit();
		}
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header>
		<Card.Title>Welcome to the DISC Assessment</Card.Title>
		<Card.Description>
			Please enter your information to begin the questionnaire
		</Card.Description>
	</Card.Header>
	<form onsubmit={handleSubmit}>
		<Card.Content class="space-y-4">
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" value={email} disabled class="bg-muted" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="firstName">First Name</Label>
					<Input
						id="firstName"
						type="text"
						value={firstName}
						oninput={(e) => onfirstNameChange(e.currentTarget.value)}
						placeholder="John"
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="lastName">Last Name</Label>
					<Input
						id="lastName"
						type="text"
						value={lastName}
						oninput={(e) => onlastNameChange(e.currentTarget.value)}
						placeholder="Doe"
						required
					/>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="dateOfBirth">Date of Birth</Label>
				<Input
					id="dateOfBirth"
					type="date"
					value={dateOfBirth}
					oninput={(e) => ondateOfBirthChange(e.currentTarget.value)}
					required
				/>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" disabled={!isValid} class="w-full">
				Start Assessment
			</Button>
		</Card.Footer>
	</form>
</Card.Root>
