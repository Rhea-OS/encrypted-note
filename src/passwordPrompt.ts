import * as obs from "obsidian";

export default class PasswordPrompt extends obs.Modal {
	constructor(app: obs.App, file: obs.TAbstractFile, onSubmit: (password: string) => void) {
		super(app);

		this.setTitle(`Decrypt ${file.name}`);

		const form = this.contentEl.createEl('form', {  });

		form.addEventListener('submit', e => {
			e.preventDefault();

			onSubmit((e.target as HTMLFormElement).password.value);

			this.close();
		})

		new obs.Setting(form)
			.setName('Password')
			.setDesc('Please enter the password to unlock this note.')
			.addText(text => Object.assign(text.inputEl, {
				type: 'password',
				name: 'password',
				placeholder: 'abc123',
			}));

		form.createEl('button', {
			type: 'submit',
			text: 'Okay'
		});
	}

	public static async prompt(app: obs.App, file: obs.TAbstractFile): Promise<string> {
		return await new Promise(ok =>
			new PasswordPrompt(app, file, pw => ok(pw))
				.open());
	}
}