import { defineCustomElement } from 'vue'
import CodeConfirmation from './components/CodeConfirmation.vue'
import SecretSequence from './components/SecretSequence.vue'

customElements.define('arcane-code-confirmation', defineCustomElement(CodeConfirmation));
customElements.define('arcane-secret-sequence', defineCustomElement(SecretSequence));