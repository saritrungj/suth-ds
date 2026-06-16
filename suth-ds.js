/**
 * SUTH Design System v2.2 - JavaScript
 * Suranaree University of Technology Hospital
 */

(function (global) {
  "use strict";

  const SUTHDS = {
    version: "2.3.0",
    name: "SUTH Design System",
  };

  /* ========================================
     TOAST NOTIFICATIONS
     ======================================== */
  const Toast = {
    container: null,

    ICONS: {
      success:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning:
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    },

    TITLES: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
    },

    DEFAULT_DURATION: {
      success: 3500,
      error: 6000,
      warning: 5000,
      info: 4000,
    },

    init() {
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.className = "suth-toast-container";
        this.container.setAttribute("role", "region");
        this.container.setAttribute("aria-label", "Notifications");
        this.container.setAttribute("aria-live", "polite");
        this.container.setAttribute("aria-atomic", "false");
        document.body.appendChild(this.container);
      }
    },

    show(message, type = "success", duration) {
      this.init();

      const ms = duration ?? this.DEFAULT_DURATION[type] ?? 4000;
      const toast = document.createElement("div");
      toast.className = `suth-toast suth-toast-${type}`;
      toast.setAttribute("role", type === "error" ? "alert" : "status");
      toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

      const title = this.TITLES[type] || type;

      toast.innerHTML = `
        <div class="suth-toast-icon" aria-hidden="true">${this.ICONS[type] || ""}</div>
        <div class="suth-toast-body">
          <div class="suth-toast-title">${title}</div>
          <div class="suth-toast-message">${message}</div>
        </div>
        <button class="suth-toast-close" aria-label="Dismiss notification" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="suth-toast-progress"></div>
      `;

      const closeBtn = toast.querySelector(".suth-toast-close");
      const progress = toast.querySelector(".suth-toast-progress");
      let removeTimer;

      const dismiss = () => {
        clearTimeout(removeTimer);
        toast.classList.add("is-removing");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
      };

      closeBtn.addEventListener("click", dismiss);

      // Animate progress bar
      if (progress) {
        progress.style.cssText = `animation: none; width: 100%; transition: width ${ms}ms linear;`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            progress.style.width = "0%";
          });
        });
      }

      removeTimer = setTimeout(dismiss, ms);

      // Pause on hover
      toast.addEventListener("mouseenter", () => {
        clearTimeout(removeTimer);
        if (progress) progress.style.transitionDuration = "0ms";
      });
      toast.addEventListener("mouseleave", () => {
        const remaining = parseFloat(progress?.style.width || "0");
        const remainingMs = (remaining / 100) * ms;
        if (progress) {
          progress.style.transitionDuration = `${remainingMs}ms`;
          progress.style.width = "0%";
        }
        removeTimer = setTimeout(dismiss, remainingMs);
      });

      this.container.appendChild(toast);
      return toast;
    },

    success(message, duration) {
      return this.show(message, "success", duration);
    },
    error(message, duration) {
      return this.show(message, "error", duration);
    },
    warning(message, duration) {
      return this.show(message, "warning", duration);
    },
    info(message, duration) {
      return this.show(message, "info", duration);
    },
  };

  /* ========================================
     MODAL
     ======================================== */
  const Modal = {
    open(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    },

    close(id) {
      const modal = typeof id === "string" ? document.getElementById(id) : id;
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    },

    init() {
      document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
          if (e.target === e.currentTarget) {
            this.close(e.target);
          }
        });
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          document.querySelectorAll(".modal-overlay.active").forEach((m) => {
            this.close(m);
          });
        }
      });
    },
  };

  /* ========================================
     TABS
     ======================================== */
  const Tabs = {
    switch(tabBtn, tabId) {
      const container = tabBtn.closest(".tabs");
      if (!container) return;

      container
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      container
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("active"));

      tabBtn.classList.add("active");
      const panel = document.getElementById(tabId);
      if (panel) panel.classList.add("active");
    },

    init() {
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tabId =
            btn.dataset.tab ||
            btn.getAttribute("onclick")?.match(/'(.*?)'/)?.[1];
          if (tabId) this.switch(btn, tabId);
        });
      });
    },
  };

  /* ========================================
     FORM VALIDATION
     ======================================== */
  const FormValidation = {
    validate(form) {
      const inputs = form.querySelectorAll(
        "input[required], select[required], textarea[required]",
      );
      let isValid = true;

      inputs.forEach((input) => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      return isValid;
    },

    validateField(field) {
      const formGroup = field.closest(".form-group");
      if (!formGroup) return true;

      const errorEl = formGroup.querySelector(".form-error");
      let isValid = true;
      let errorMsg = "";

      if (!field.value.trim()) {
        isValid = false;
        errorMsg = "This field is required";
      } else if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMsg = "Please enter a valid email address";
        }
      }

      if (!isValid) {
        field.classList.add("error");
        if (errorEl) {
          errorEl.textContent = errorMsg;
          errorEl.style.display = "block";
        }
      } else {
        field.classList.remove("error");
        if (errorEl) errorEl.style.display = "none";
      }

      return isValid;
    },

    init(formSelector = "form[data-validate]") {
      document.querySelectorAll(formSelector).forEach((form) => {
        form.addEventListener("submit", (e) => {
          if (!this.validate(form)) {
            e.preventDefault();
          }
        });

        form.querySelectorAll("input, select, textarea").forEach((input) => {
          input.addEventListener("blur", () => this.validateField(input));
          input.addEventListener("input", () => {
            if (input.classList.contains("error")) {
              this.validateField(input);
            }
          });
        });
      });
    },
  };

  /* ========================================
     DATA TABLE
     ======================================== */
  const DataTable = {
    init(tableSelector = ".data-table") {
      document.querySelectorAll(tableSelector).forEach((table) => {
        this.makeSortable(table);
      });
    },

    makeSortable(table) {
      const headers = table.querySelectorAll("th[data-sort]");
      headers.forEach((header) => {
        header.style.cursor = "pointer";
        header.addEventListener("click", () => {
          const column = header.dataset.sort;
          this.sort(table, column, header);
        });
      });
    },

    sort(table, column, header) {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const isAsc = !header.classList.contains("sort-asc");

      table.querySelectorAll("th").forEach((th) => {
        th.classList.remove("sort-asc", "sort-desc");
      });

      header.classList.add(isAsc ? "sort-asc" : "sort-desc");

      rows.sort((a, b) => {
        const aVal =
          a.querySelector(`td[data-column="${column}"]`)?.textContent.trim() ||
          "";
        const bVal =
          b.querySelector(`td[data-column="${column}"]`)?.textContent.trim() ||
          "";

        if (aVal < bVal) return isAsc ? -1 : 1;
        if (aVal > bVal) return isAsc ? 1 : -1;
        return 0;
      });

      rows.forEach((row) => tbody.appendChild(row));
    },
  };

  /* ========================================
     COPY TO CLIPBOARD
     ======================================== */
  const Copy = {
    RESET_MS: 2000,

    ICONS: {
      copy:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      check:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
      error:
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    },

    _fallback(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.cssText =
        "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!ok) throw new Error("execCommand copy failed");
    },

    async writeText(text, options = {}) {
      const {
        silent = false,
        successMessage = "Copied to clipboard!",
        errorMessage = "Failed to copy",
      } = options;

      if (text == null) {
        if (!silent) Toast.error(errorMessage);
        return false;
      }

      const payload = String(text);

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(payload);
        } else {
          this._fallback(payload);
        }
        if (!silent) Toast.success(successMessage);
        return true;
      } catch (err) {
        try {
          this._fallback(payload);
          if (!silent) Toast.success(successMessage);
          return true;
        } catch (fallbackErr) {
          if (!silent) Toast.error(errorMessage);
          return false;
        }
      }
    },

    getCodeText(preOrId) {
      const el =
        typeof preOrId === "string"
          ? document.getElementById(preOrId)
          : preOrId;
      if (!el) return "";
      const code = el.querySelector("code") || el;
      return code.textContent || "";
    },

    getRowText(row) {
      const cells = [...row.querySelectorAll("th, td")].map((cell) =>
        cell.textContent.trim(),
      );
      return cells.join("\t");
    },

    getStatsText(card) {
      const label = card.querySelector(".stats-label")?.textContent.trim() || "";
      const value = card.querySelector(".stats-value")?.textContent.trim() || "";
      const change = card.querySelector(".stats-change")?.textContent.trim() || "";
      return [label, value, change].filter(Boolean).join("\n");
    },

    createButton(options = {}) {
      const {
        label = "Copy",
        target = "",
        text = "",
        variant = "default",
        size = "sm",
        className = "",
      } = options;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = [
        "btn-copy",
        variant === "icon" ? "btn-copy-icon" : "",
        size === "xs" ? "btn-copy-xs" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ");
      btn.dataset.copyLabel = label;
      btn.setAttribute("aria-label", label);
      if (target) btn.dataset.copyTarget = target;
      if (text) btn.dataset.copyText = text;

      btn.innerHTML = `${this.ICONS.copy}<span class="copy-btn-label">${label}</span>`;
      return btn;
    },

    _replaceIcon(btn, iconHtml) {
      const icon = btn.querySelector("svg");
      if (!icon) return;
      const temp = document.createElement("div");
      temp.innerHTML = iconHtml.trim();
      const nextIcon = temp.firstElementChild;
      if (nextIcon) icon.replaceWith(nextIcon);
    },

    setButtonState(btn, state) {
      if (!btn) return;
      btn.classList.remove("copied", "is-error");
      const label = btn.querySelector(".copy-btn-label");

      if (state === "copied") {
        btn.classList.add("copied");
        if (label) label.textContent = "Copied!";
        btn.setAttribute("aria-label", "Copied to clipboard");
        this._replaceIcon(btn, this.ICONS.check);
      } else if (state === "error") {
        btn.classList.add("is-error");
        if (label) label.textContent = "Failed";
        btn.setAttribute("aria-label", "Copy failed");
        this._replaceIcon(btn, this.ICONS.error);
      }

      clearTimeout(btn._copyResetTimer);
      btn._copyResetTimer = setTimeout(
        () => this.resetButtonState(btn),
        this.RESET_MS,
      );
    },

    resetButtonState(btn) {
      if (!btn) return;
      btn.classList.remove("copied", "is-error");
      const label = btn.querySelector(".copy-btn-label");
      if (label && btn.dataset.copyLabel) {
        label.textContent = btn.dataset.copyLabel;
      }
      btn.setAttribute("aria-label", btn.dataset.copyLabel || "Copy to clipboard");
      this._replaceIcon(btn, this.ICONS.copy);
    },

    setSurfaceState(el, state) {
      if (!el) return;
      el.classList.remove("copied", "is-copy-error");
      if (state === "copied") el.classList.add("copied");
      if (state === "error") el.classList.add("is-copy-error");
      clearTimeout(el._copyResetTimer);
      el._copyResetTimer = setTimeout(() => {
        el.classList.remove("copied", "is-copy-error");
      }, this.RESET_MS);
    },

    async fromPre(preOrId, triggerEl, options = {}) {
      const text = this.getCodeText(preOrId);
      // Button state (icon + label) is the feedback — no toast needed on success
      const ok = await this.writeText(text, { silent: true, ...options });
      if (!ok) Toast.error("Failed to copy code");
      if (triggerEl) this.setButtonState(triggerEl, ok ? "copied" : "error");
      return ok;
    },

    async fromElement(el, options = {}) {
      const text = el?.dataset?.copyText || el?.textContent?.trim() || "";
      const ok = await this.writeText(text, { silent: true, ...options });
      if (!ok) Toast.error("Failed to copy");
      this.setSurfaceState(el, ok ? "copied" : "error");
      return ok;
    },

    async fromColor(el, color, options = {}) {
      // Color copy has no persistent button state, so a brief success toast is helpful
      const ok = await this.writeText(color, {
        silent: false,
        successMessage: `Copied ${color}`,
        ...options,
      });
      this.setSurfaceState(el, ok ? "copied" : "error");
      return ok;
    },

    async fromRow(row, options = {}) {
      const text = this.getRowText(row);
      const ok = await this.writeText(text, { silent: true, ...options });
      if (!ok) Toast.error("Failed to copy row");
      this.setSurfaceState(row, ok ? "copied" : "error");
      return ok;
    },

    async fromStats(card, options = {}) {
      const text = this.getStatsText(card);
      const ok = await this.writeText(text, { silent: true, ...options });
      if (!ok) Toast.error("Failed to copy stats");
      this.setSurfaceState(card, ok ? "copied" : "error");
      return ok;
    },

    mountCodeHeaderButtons() {
      document.querySelectorAll(".ds-component-code").forEach((block) => {
        const header = block.querySelector(".ds-component-code-header");
        const pre = block.querySelector("pre[id]");
        if (!header || !pre?.id) return;
        if (header.querySelector(".btn-copy, [data-copy-target]")) return;

        const btn = this.createButton({
          label: "Copy",
          target: pre.id,
          size: "xs",
        });
        header.appendChild(btn);
      });
    },

    migrateLegacyButtons() {
      document.querySelectorAll(".btn-copy[onclick]").forEach((btn) => {
        const onclick = btn.getAttribute("onclick") || "";
        const codeMatch = onclick.match(/copyCode\('([^']+)'\)/);
        const colorMatch = onclick.match(/copyColor\(this,\s*'([^']+)'\)/);

        if (codeMatch) {
          btn.dataset.copyTarget = codeMatch[1];
          btn.removeAttribute("onclick");
          btn.type = "button";
          if (!btn.dataset.copyLabel) btn.dataset.copyLabel = "Copy";
          if (!btn.querySelector(".copy-btn-label")) {
            btn.innerHTML = `${this.ICONS.copy}<span class="copy-btn-label">Copy</span>`;
          }
        } else if (colorMatch) {
          btn.dataset.copyColor = colorMatch[1];
          btn.removeAttribute("onclick");
        }
      });

      document.querySelectorAll(".color-item[onclick]").forEach((item) => {
        const onclick = item.getAttribute("onclick") || "";
        const match = onclick.match(/copyColor\(this,\s*'([^']+)'\)/);
        if (!match) return;
        item.dataset.copyColor = match[1];
        item.removeAttribute("onclick");
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute(
          "aria-label",
          `Copy color ${match[1]}`,
        );
      });
    },

    enhanceCopyableSurfaces() {
      document
        .querySelectorAll(".ds-component-preview .stats-card")
        .forEach((card) => {
          if (card.dataset.copyEnhanced) return;
          card.dataset.copyEnhanced = "true";
          card.classList.add("copyable-surface");
          card.setAttribute("role", "button");
          card.setAttribute("tabindex", "0");
          card.setAttribute(
            "aria-label",
            `Copy stats: ${card.querySelector(".stats-label")?.textContent.trim() || "metric"}`,
          );

          const copyHint = document.createElement("span");
          copyHint.className = "copy-surface-hint";
          copyHint.textContent = "Click to copy";
          card.appendChild(copyHint);
        });

      document
        .querySelectorAll(
          ".ds-component-preview .data-table:not(.datatable) tbody tr, .data-table[data-copyable] tbody tr",
        )
        .forEach((row) => {
          if (row.dataset.copyEnhanced) return;
          row.dataset.copyEnhanced = "true";
          row.classList.add("copyable-row");

          const btn = this.createButton({
            label: "Copy row",
            variant: "icon",
            size: "xs",
            className: "copy-row-btn",
          });
          btn.dataset.copyRow = "true";
          btn.setAttribute(
            "aria-label",
            `Copy row: ${row.textContent.trim().slice(0, 60)}`,
          );

          const firstCell = row.querySelector("td, th");
          if (firstCell) {
            firstCell.classList.add("copyable-cell");
            firstCell.appendChild(btn);
          }
        });
    },

    handleClick(e) {
      const targetBtn = e.target.closest(
        ".btn-copy, [data-copy-target], [data-copy-text], [data-copy-row]",
      );
      if (targetBtn) {
        e.preventDefault();
        e.stopPropagation();

        if (targetBtn.dataset.copyTarget) {
          this.fromPre(targetBtn.dataset.copyTarget, targetBtn);
          return;
        }

        if (targetBtn.dataset.copyText) {
          this.writeText(targetBtn.dataset.copyText).then((ok) => {
            this.setButtonState(targetBtn, ok ? "copied" : "error");
          });
          return;
        }

        if (targetBtn.dataset.copyRow) {
          const row = targetBtn.closest("tr");
          if (row) this.fromRow(row);
          return;
        }
      }

      const colorItem = e.target.closest("[data-copy-color]");
      if (colorItem) {
        e.preventDefault();
        this.fromColor(colorItem, colorItem.dataset.copyColor);
        return;
      }

      const statsCard = e.target.closest(".stats-card.copyable-surface");
      if (statsCard && !e.target.closest(".copy-row-btn, .btn-copy")) {
        this.fromStats(statsCard);
        return;
      }
    },

    handleKeydown(e) {
      if (e.key !== "Enter" && e.key !== " ") return;

      const colorItem = e.target.closest("[data-copy-color]");
      const statsCard = e.target.closest(".stats-card.copyable-surface");

      if (colorItem) {
        e.preventDefault();
        this.fromColor(colorItem, colorItem.dataset.copyColor);
      } else if (statsCard) {
        e.preventDefault();
        this.fromStats(statsCard);
      }
    },

    init() {
      this.migrateLegacyButtons();
      this.mountCodeHeaderButtons();
      this.enhanceCopyableSurfaces();

      document.addEventListener("click", (e) => this.handleClick(e));
      document.addEventListener("keydown", (e) => this.handleKeydown(e));
    },

    // Legacy API aliases
    async text(text, options) {
      return this.writeText(text, options);
    },

    async element(element) {
      return this.fromElement(element);
    },
  };

  /* ========================================
     SIDEBAR
     ======================================== */
  const Sidebar = {
    toggle() {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) {
        sidebar.classList.toggle("active");
      }
    },

    close() {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) {
        sidebar.classList.remove("active");
      }
    },
  };

  /* ========================================
     THEME
     ======================================== */
  const Theme = {
    get current() {
      return (
        document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    },

    _dispatch(theme) {
      window.dispatchEvent(
        new CustomEvent("suth:themechange", { detail: { theme } }),
      );
    },

    set(theme) {
      if (theme === "light" || theme === "dark") {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("suth-ds-theme", theme);
        this._dispatch(theme);
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("suth-ds-theme");
        const resolved = this.current;
        this._dispatch(resolved);
      }
    },

    apply(el, theme) {
      if (!el) return;
      if (theme === "light" || theme === "dark") {
        el.setAttribute("data-theme", theme);
      } else {
        el.removeAttribute("data-theme");
      }
    },

    toggle() {
      const next = this.current === "dark" ? "light" : "dark";
      this.set(next);
      return next;
    },

    init() {
      const saved = localStorage.getItem("suth-ds-theme");
      if (saved) {
        this.set(saved);
      }
    },
  };

  /* ========================================
     ANIMATIONS
     ======================================== */
  const Animations = {
    fadeIn(element, duration = 300) {
      element.style.opacity = "0";
      element.style.display = "block";
      element.style.transition = `opacity ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.opacity = "1";
      });
    },

    fadeOut(element, duration = 300) {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = "0";

      setTimeout(() => {
        element.style.display = "none";
      }, duration);
    },
  };

  /* ========================================
     INITIALIZE
     ======================================== */
  SUTHDS.init = function () {
    Theme.init();
    Modal.init();
    Tabs.init();
    FormValidation.init();
    DataTable.init();
    Copy.init();

    console.log(
      `%c${this.name} v${this.version}`,
      "color: #2563EB; font-weight: bold; font-size: 14px;",
    );
    console.log("%cReady to use! 🚀", "color: #059669;");
  };

  /* ========================================
     PUBLIC API
     ======================================== */
  SUTHDS.toast = Toast;
  SUTHDS.modal = Modal;
  SUTHDS.tabs = Tabs;
  SUTHDS.form = FormValidation;
  SUTHDS.table = DataTable;
  SUTHDS.copy = Copy;
  SUTHDS.sidebar = Sidebar;
  SUTHDS.animate = Animations;
  SUTHDS.theme = Theme;

  // Expose to global scope
  global.SUTHDS = SUTHDS;
  global.SuthDS = SUTHDS; // Alias

  // Auto-initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SUTHDS.init());
  } else {
    SUTHDS.init();
  }
})(window);
