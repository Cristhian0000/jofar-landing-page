import config from "./config.js";

export class FormHandler {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton?.textContent;
        this.isSubmitting = false;

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.isSubmitting) return;

            this.showLoading();

            try {
                const formData = this.getFormData();
                if (!this.validateForm(formData)) return;

                await this.sendEmails(formData);

                this.showSuccess();
                this.form.reset();
            } catch (error) {
                this.handleError(error);
            } finally {
                this.hideLoading();
            }
        });
    }

    getFormData() {
        return {
            nombre: this.form.nombre.value.trim(),
            telefono: this.form.telefono.value.trim(),
            email: this.form.email.value.trim(),
            servicio: this.form.servicio.value.trim(),
            mensaje: this.form.mensaje.value.trim(),
            reply_to: this.form.email.value.trim(),
            fecha: new Date().toLocaleString()
        };
    }

    validateForm(formData) {
        const errors = [];

        if (!formData.nombre || formData.nombre.length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }

        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Ingresa un correo electrónico válido');
        }

        if (!formData.mensaje || formData.mensaje.length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async sendEmails(formData) {
        const [responseToCompany, responseToUser] = await Promise.all([
            emailjs.send(
                config.emailjs.serviceID,
                config.emailjs.templateToCompany,
                formData
            ),
            emailjs.send(
                config.emailjs.serviceID,
                config.emailjs.templateToUser,
                formData
            )
        ]);

        if (responseToCompany.status !== 200 || responseToUser.status !== 200) {
            throw new Error('Error al enviar los correos');
        }
    }

    showLoading() {
        this.isSubmitting = true;
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    }

    hideLoading() {
        this.isSubmitting = false;
        this.submitButton.disabled = false;
        this.submitButton.textContent = this.originalButtonText;
    }

    showSuccess() {
        alert('¡Mensaje enviado con éxito! Te hemos enviado una confirmación por correo.');
    }

    handleError(error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos por teléfono.');
    }
}