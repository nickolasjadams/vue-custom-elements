<script>
	export default {
		data() {
			return {
				current: "",
				lastEntryTimestamp: "",
				elements: []
			}
		},
		props: {
			sequence: {
      			type: [String, Array],
				default: 'open-please'
			},
		},
		computed: {
			timeToComplete() {
				return (typeof this.sequence == Array)
					? this.sequence.length 
					: this.sequence.split("").length;
			},
		},
		created() {
			window.addEventListener('keydown', this.keyInput);
		},
		beforeDestroy() {
			window.removeEventListener('keydown', this.keyInput);
		},
		methods: {
			timeHasExpired() {
				let now = Math.round(Date.now() / 1000);
				return now > (this.lastEntryTimestamp + this.timeToComplete);
			},
			keyInput(e) {
				if (this.timeHasExpired()) {
					this.current = "";	
				}
				this.lastEntryTimestamp = Math.round(Date.now() / 1000);
				if (typeof this.sequence == "string") {
					// type in order
					if (e.type == "keydown") {
						if (e.key.length === 1) {
							this.current += e.key;
							if (this.current === this.sequence) {
								dispatchEvent(new Event('arcane.sequence.complete'));
							}
						} else if (e.key === "Escape") {
							this.current = "";
						}
					}
				}
			},
		}
	}
</script>

<template></template>

<style lang="scss" scoped>

	.secret-sequence {

		color: var(--text-color);
		background: var(--bg-color);
		text-align: center;
		margin: 0 auto;
		padding: 20px 0;
		max-width: 600px;

		* {
			transition: .3s all ease-out;
			box-sizing: border-box;
		}

	}
</style>