/**
 * Поведение формы: подпись и подсказка поля контакта меняются по каналу
 * связи, «Отправить» доступна только с согласием на обработку ПДн,
 * обязательные поля проверяются при отправке — ошибка текстом, а не только
 * цветом (`.bad` + `aria-invalid`).
 *
 * Отправка — ЗАГЛУШКА: куда уходит заявка, не решено (08_OPEN_QUESTIONS);
 * данные никуда не передаются и не пишутся в консоль.
 */
const REQUIRED = ["name", "business", "contact"] as const;
const FOCUS_DELAY_MS = 480;

export function bindLeadForm(form: HTMLFormElement): () => void {
  const contact = form.elements.namedItem("contact") as HTMLInputElement;
  const contactLabel = form.querySelector<HTMLElement>("[data-contact-label]");
  const consent = form.elements.namedItem("consent") as HTMLInputElement;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const done = form.querySelector<HTMLElement>(".done");

  const onChange = (e: Event) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;
    if (t.name === "channel") {
      if (contactLabel) contactLabel.textContent = t.dataset.label ?? "";
      contact.placeholder = t.dataset.placeholder ?? "";
      contact.inputMode = t.dataset.mode ?? "text";
    }
    if (t === consent && submit) submit.disabled = !consent.checked;
  };
  const check = (name: (typeof REQUIRED)[number]) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    const ok = input.value.trim().length > 0;
    form.querySelector(`[data-field="${name}"]`)?.classList.toggle("bad", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    return { ok, input };
  };
  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const results = REQUIRED.map(check);
    const firstBad = results.find((r) => !r.ok);
    if (firstBad || !consent.checked) {
      firstBad?.input.focus();
      return;
    }
    if (submit) submit.disabled = true;
    if (done) {
      done.hidden = false;
      // Кнопка стала неактивной — фокус переходит на подтверждение, а не теряется.
      done.focus({ preventScroll: false });
    }
  };
  form.addEventListener("change", onChange);
  form.addEventListener("submit", onSubmit);
  return () => {
    form.removeEventListener("change", onChange);
    form.removeEventListener("submit", onSubmit);
  };
}

/** Фокус на первое поле, когда шторка доехала (без прокрутки страницы). */
export function focusFirstField(form: HTMLFormElement): number {
  return window.setTimeout(() => {
    form.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  }, FOCUS_DELAY_MS);
}
