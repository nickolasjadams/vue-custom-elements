<script>
	export default {
		data() {
			return {
				combo: []
			}
		},
		props: {
			codeLength: {
				default: 4
			},
			bgColor: {
				default: "#0099CC"
			},
			textColor: {
				default: "#fff"
			},
			underlineColor: {
				default: "#fee500"
			}
		},
		computed: {
			full() {
				return (this.combo.length >= this.codeLength)
			},
			cssVars() {
				return {
					'--code-length': this.codeLength,
					'--bg-color': this.bgColor,
					'--text-color': this.textColor,
					'--underline-color': this.underlineColor,
				}
			}
		},
		created() {
			window.addEventListener('keydown', this.keyInput);
		},
		beforeDestroy() {
			window.removeEventListener('keydown', this.keyInput);
		},
		methods: {
			pasteCode() {
				navigator.clipboard
					.readText()
					.then((clipText) => {
						clipText = clipText.substring(0,4);
						if (parseInt(clipText) || parseInt(clipText) === 0) {
							clipText.split("").forEach((digit, i) => {
								this.combo[i] = digit;	
							})
						}
					});
			},
			keyInput(e) {
				
				if (e.type == "click") {
					this.addNextComboPiece(e.target.innerText);
				} else if (e.type == "keydown") {
					if (e.key === "v" && (e.metaKey || e.ctrlKey)) {
						this.pasteCode();
					} else if (!e.key.startsWith("Arrow")) {
						if (parseInt(e.key) || parseInt(e.key) === 0) {
							this.addNextComboPiece(e.key);
						} else if (e.key === "Backspace") {
							this.combo.pop();
						}
					} else {
						e.preventDefault();
					}
				}
			},
			addNextComboPiece(digit) {
				if (this.combo.length < this.codeLength) {
					this.combo[this.combo.length] = digit;
					if (this.combo.length === this.codeLength) {
						console.log("checking if code " + this.combo + " is valid.")
					}
				}
			}
		}
	}
</script>

<!--

	- need to deal with failed attempts

-->

<template>
	<div class="code-confirmation" :style="cssVars">
		<slot></slot>
		<div class="combo" :class="this.full ? 'full' : ''">
			<input v-on:paste="pasteCode" v-for="index in parseInt(this.codeLength)" :key="index" type="number" v-bind:disabled="combo.length != index-1" v-model="combo[index-1]">
		</div>
		<div class="progress" :class="full ? 'verifying' : ''">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 32C0 14.3 14.3 0 32 0H64 320h32c17.7 0 32 14.3 32 32s-14.3 32-32 32V75c0 42.4-16.9 83.1-46.9 113.1L237.3 256l67.9 67.9c30 30 46.9 70.7 46.9 113.1v11c17.7 0 32 14.3 32 32s-14.3 32-32 32H320 64 32c-17.7 0-32-14.3-32-32s14.3-32 32-32V437c0-42.4 16.9-83.1 46.9-113.1L146.7 256 78.9 188.1C48.9 158.1 32 117.4 32 75V64C14.3 64 0 49.7 0 32zM96 64V75c0 25.5 10.1 49.9 28.1 67.9L192 210.7l67.9-67.9c18-18 28.1-42.4 28.1-67.9V64H96zm0 384H288V437c0-25.5-10.1-49.9-28.1-67.9L192 301.3l-67.9 67.9c-18 18-28.1 42.4-28.1 67.9v11z"/></svg>
			<div>Verifying</div>
		</div>
		<div class="ten-key">
			<button v-bind:disabled="this.full" @click="keyInput">1</button>
			<button v-bind:disabled="this.full" @click="keyInput">2</button>
			<button v-bind:disabled="this.full" @click="keyInput">3</button>
			<button v-bind:disabled="this.full" @click="keyInput">4</button>
			<button v-bind:disabled="this.full" @click="keyInput">5</button>
			<button v-bind:disabled="this.full" @click="keyInput">6</button>
			<button v-bind:disabled="this.full" @click="keyInput">7</button>
			<button v-bind:disabled="this.full" @click="keyInput">8</button>
			<button v-bind:disabled="this.full" @click="keyInput">9</button>
			<div class="button-spacer"></div>
			<button v-bind:disabled="this.full" @click="keyInput">0</button>
		</div>
	</div>
</template>
<style lang="scss" scoped>

	$button-gutter: 3px;

	.code-confirmation {

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

		/* Chrome, Safari, Edge, Opera */
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		/* Firefox */
		input[type=number] {
			-moz-appearance: textfield;
		}

		.combo {
			width: 100%;
			max-width: 400px;
			margin: 20px auto 30px auto;

			&.full {
				transition: 0.3s margin-left ease-out, 0.3s width ease-out, filter 0.8s ease-out;
				width: 50%;
				filter: opacity(0.5) blur(1px);
				input:first-child {
					width: calc((100% / var(--code-length)) - $button-gutter);
					margin-left: $button-gutter;
				}
				input:last-child {
					width: calc((100% / var(--code-length)) - $button-gutter);
					margin-right: $button-gutter;
				}
				input {
					width: calc(100% / var(--code-length));
					margin: $button-gutter 0;
				}
				
			}

			input {
				width: calc((100% / var(--code-length)) - ($button-gutter * 2));
				line-height: 2.5em;
				font-size: 1.75em;
				text-align: center;
				margin: $button-gutter;
				border: 0;
				border-bottom: 3px solid var(--underline-color);
				background: rgba(0,0,0,.2);
				color: var(--text-color);

			&:disabled {
					border-bottom: 3px solid transparent;
				}
			}
		}

		.ten-key {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			max-width: 400px;
			margin: 0 auto;
			button, .button-spacer {
				width: calc(33.33% - ($button-gutter * 2));
				line-height: 2.5em;
				font-size: 1.75em;
				background: transparent;
				border: 0;
				color: var(--text-color);
				margin: $button-gutter;
			}

			button {
				cursor: pointer;
				// background: radial-gradient(rgba(0,0,0,.01), rgba(0,0,0,.3));
				background: rgba(0, 0, 0, 0.2);
				border-radius: 10px;
				&:hover, &:focus {
					background: rgba(0, 0, 0, 0.25);
					// background: radial-gradient(rgba(0,0,0,.05), rgba(0,0,0,.5));
				}
				&:active {
					transition: 0.00002s transform ease-out;
					transform: scale(0.95);
				}
				&:disabled {
					filter: opacity(0.5) blur(1px);
					&:hover, &:focus {
						background: rgba(0, 0, 0, 0.2);
						// background: radial-gradient(rgba(0,0,0,.01), rgba(0,0,0,.3));
					}
				}
			}

			.button-spacer {
				border: 0;
			}
		}
		.progress {
			* {
				transition: .1s all ease-out;
			}
			height: 0;
			width: 100%;
			svg {
				path {
					fill: var(--text-color);
				}
			}
			svg, div {
				height: 0;
				color: transparent;
				margin: 0 auto;
			}
			// * { height: 0; }
			&.verifying {
				height: 90px;
				div {
					color: var(--text-color);
					margin-top: 10px;
					font-weight: bold;
    				font-size: 1.25em;
				}
				svg {
					width: 20px;
					height: auto;
					display: block;
					margin: 0 auto;
				}
			}
		}

		.verifying div:after {
			width: 0;
			display: inline-block;
			text-align: left;
			color: var(--text-color);
			content: '';
			animation: dots 1s steps(5, end) infinite;
		}

		@keyframes dots {
			0%, 20%   { content: ''; }
			40% 	  { content: '.'; }
			60% 	  { content: '..'; }
			80%, 100% { content: '...'; }
		}
	}
</style>