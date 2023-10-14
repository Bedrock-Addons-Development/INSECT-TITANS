import { FormResponse, ModalFormResponse } from '@minecraft/server-ui';

Object.defineProperties(FormResponse.prototype, {
    output: {
        get() {
            return (this instanceof ModalFormResponse) ? this.formValues : this.selection;
        }
    }
});
