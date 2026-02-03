<script lang="ts">
	import { license, disclaimer } from "$lib/questions";
</script>

<footer class="mt-auto border-t border-border bg-card py-6">
	<div class="mx-auto max-w-5xl px-4">
		<div class="space-y-4 text-center text-sm text-muted-foreground">
			<p class="italic">
				{disclaimer}
			</p>
			<div class="space-y-1">
				<p>
					{license.attribution_text}
				</p>
				<p>
					Licensed under{" "}
					<a
						href={license.license_url}
						target="_blank"
						rel="noopener noreferrer"
						class="underline hover:text-foreground"
					>
						CC BY-NC-SA 4.0
					</a>
				</p>
			</div>
		</div>
	</div>
</footer>
