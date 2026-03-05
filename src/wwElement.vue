<template>
  <div class="gdm-bill" :style="cssVars">

    <!-- ── Header ── -->
    <div class="gdm-bill__header">
      <div class="gdm-bill__header-left">
        <span v-if="isAdmin" class="gdm-bill__admin-badge">Admin</span>
        <div class="gdm-bill__summary">
          <span class="gdm-bill__summary-item gdm-bill__summary-item--upcoming">
            <span class="gdm-bill__summary-dot"></span>
            {{ summary.upcoming.count }} Upcoming
            <span class="gdm-bill__summary-val">{{ formatAmount(summary.upcoming.total) }}</span>
          </span>
          <span class="gdm-bill__summary-sep">·</span>
          <span class="gdm-bill__summary-item gdm-bill__summary-item--issued">
            <span class="gdm-bill__summary-dot"></span>
            {{ summary.issued.count }} Issued
            <span class="gdm-bill__summary-val">{{ formatAmount(summary.issued.total) }}</span>
          </span>
          <span class="gdm-bill__summary-sep">·</span>
          <span class="gdm-bill__summary-item gdm-bill__summary-item--completed">
            <span class="gdm-bill__summary-dot"></span>
            {{ summary.completed.count }} Completed
            <span class="gdm-bill__summary-val">{{ formatAmount(summary.completed.total) }}</span>
          </span>
        </div>
      </div>
      <button
        v-if="isAdmin && !formVisible"
        type="button"
        class="gdm-btn gdm-btn--primary"
        @click="openAdd"
      >
        <svg viewBox="0 0 16 16" fill="none" class="gdm-icon"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        New Invoice
      </button>
    </div>

    <!-- ── Add / Edit form ── -->
    <div v-if="formVisible && isAdmin" class="gdm-bill__form-wrap">
      <div class="gdm-bill__form-card">
        <div class="gdm-bill__form-head">
          <h3 class="gdm-bill__form-title">{{ editingId ? 'Edit Invoice' : 'New Invoice' }}</h3>
          <span v-if="editingId" class="gdm-bill__editing-badge">editing</span>
        </div>
        <form class="gdm-bill__form" @submit.prevent="handleSubmit">
          <div class="gdm-bill__form-grid">
            <!-- Status -->
            <div class="gdm-bill__field">
              <label class="gdm-bill__label">Status <span class="gdm-bill__req">*</span></label>
              <select v-model="form.status" class="gdm-bill__select">
                <option value="Upcoming">Upcoming</option>
                <option value="Issued">Issued</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <!-- Type -->
            <div class="gdm-bill__field">
              <label class="gdm-bill__label">Type</label>
              <input v-model="form.type" type="text" class="gdm-bill__input" placeholder="Invoice, Retainer…" />
            </div>
            <!-- Title -->
            <div class="gdm-bill__field gdm-bill__field--full">
              <label class="gdm-bill__label">Title <span class="gdm-bill__req">*</span></label>
              <input v-model="form.title" type="text" class="gdm-bill__input" placeholder="Invoice title" />
            </div>
            <!-- Invoice number -->
            <div class="gdm-bill__field">
              <label class="gdm-bill__label">Invoice number</label>
              <input v-model="form.invoice_number" type="text" class="gdm-bill__input" placeholder="INV-0001" />
            </div>
            <!-- Reference -->
            <div class="gdm-bill__field">
              <label class="gdm-bill__label">Reference</label>
              <input v-model="form.invoice_reference" type="text" class="gdm-bill__input" placeholder="e.g. PA-16-02-2026" />
            </div>
            <!-- Value -->
            <div class="gdm-bill__field">
              <label class="gdm-bill__label">Invoice value</label>
              <input v-model="form.invoice_value" type="number" min="0" step="0.01" class="gdm-bill__input" placeholder="0.00" />
            </div>
            <!-- E-invoice UUID -->
            <div class="gdm-bill__field">
              <label class="gdm-bill__label">e-Invoice UUID</label>
              <input v-model="form.einvoice_uuid" type="text" class="gdm-bill__input" placeholder="TBS" />
            </div>
            <!-- Description -->
            <div class="gdm-bill__field gdm-bill__field--full">
              <label class="gdm-bill__label">Description</label>
              <textarea v-model="form.description" class="gdm-bill__textarea" rows="2" placeholder="Invoice description…" />
            </div>
            <!-- Folder link -->
            <div class="gdm-bill__field gdm-bill__field--full">
              <label class="gdm-bill__label">Folder link</label>
              <input v-model="form.folder_link" type="url" class="gdm-bill__input" placeholder="https://drive.google.com/…" />
            </div>
          </div>
          <div class="gdm-bill__form-actions">
            <button type="submit" class="gdm-btn gdm-btn--primary" :disabled="!form.title || !form.status">
              <svg viewBox="0 0 16 16" fill="none" class="gdm-icon"><path d="M2 9l4 4 8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ editingId ? 'Update' : 'Save' }}
            </button>
            <button type="button" class="gdm-btn gdm-btn--ghost" @click="cancelForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── Invoice list ── -->
    <div class="gdm-bill__list">
      <div v-if="sortedList.length === 0" class="gdm-bill__empty">
        <div class="gdm-bill__empty-icon">🧾</div>
        <p class="gdm-bill__empty-text">No invoices yet</p>
        <p v-if="isAdmin" class="gdm-bill__empty-sub">Click <strong>New Invoice</strong> to add the first entry</p>
      </div>

      <div
        v-for="inv in sortedList"
        :key="inv.id"
        class="gdm-bill__row"
        :class="{ 'gdm-bill__row--preview': inv._p, 'gdm-bill__row--editing': editingId === inv.id }"
        @click="handleClick(inv)"
      >
        <!-- Top: status · title · amount -->
        <div class="gdm-bill__row-head">
          <span class="gdm-bill__status-badge" :class="'gdm-bill__status-badge--' + normStatus(inv.status)">{{ inv.status || 'Unknown' }}</span>
          <span class="gdm-bill__row-title">{{ inv.title || 'Untitled Invoice' }}</span>
          <span class="gdm-bill__amount">{{ formatAmount(inv.invoice_value) }}</span>
        </div>

        <!-- Bottom: meta · actions -->
        <div class="gdm-bill__row-foot">
          <div class="gdm-bill__row-meta">
            <span v-if="inv.type" class="gdm-bill__type-pill">{{ inv.type }}</span>
            <span v-if="inv.invoice_number" class="gdm-bill__inv-num">{{ inv.invoice_number }}</span>
            <span v-if="inv.invoice_reference" class="gdm-bill__ref">{{ inv.invoice_reference }}</span>
            <span v-if="inv.created_at" class="gdm-bill__date">{{ formatDate(inv.created_at) }}</span>
          </div>
          <div class="gdm-bill__row-actions" @click.stop>
            <a
              v-if="inv.folder_link"
              :href="inv.folder_link"
              class="gdm-bill__action-btn gdm-bill__action-btn--link"
              target="_blank"
              rel="noopener noreferrer"
              title="Open folder"
            >
              <svg viewBox="0 0 16 16" fill="none" class="gdm-icon"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M9 1h6v6M15 1L7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <template v-if="isAdmin && !inv._p">
              <button type="button" class="gdm-bill__action-btn gdm-bill__action-btn--edit" @click.stop="startEdit(inv)" title="Edit">
                <svg viewBox="0 0 16 16" fill="none" class="gdm-icon"><path d="M11.013 2.513a1.75 1.75 0 012.475 2.474L5.5 13H2v-3.5l8.013-7.987z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button type="button" class="gdm-bill__action-btn gdm-bill__action-btn--delete" @click.stop="handleDelete(inv)" title="Delete">
                <svg viewBox="0 0 16 16" fill="none" class="gdm-icon"><path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5l.5-9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </template>
          </div>
        </div>

        <!-- Description (optional) -->
        <p v-if="inv.description" class="gdm-bill__desc">{{ inv.description }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue';

const NOW = Date.now();
const PREVIEW = [
  { id: 'p1', _p: true, title: 'Project Agreement Invoice', type: 'Invoice', description: 'Invoice for the Project Agreement PA-16-02-2026 effective date 16 February 2026', invoice_number: 'INV-0008', invoice_reference: 'PA-16-02-2026', einvoice_uuid: 'TBS', invoice_value: 7150, status: 'Upcoming', folder_link: '#', created_at: new Date(NOW).toISOString() },
  { id: 'p2', _p: true, title: 'Monthly Retainer – March', type: 'Retainer', description: 'Monthly service retainer for March 2026', invoice_number: 'INV-0007', invoice_reference: 'RET-03-2026', einvoice_uuid: 'TBS', invoice_value: 4500, status: 'Issued', folder_link: '#', created_at: new Date(NOW - 86400000 * 5).toISOString() },
  { id: 'p3', _p: true, title: 'Design Phase Milestone', type: 'Invoice', description: 'Completion of design phase deliverables', invoice_number: 'INV-0006', invoice_reference: 'MILE-01', einvoice_uuid: 'UUID-1234', invoice_value: 3200, status: 'Completed', folder_link: '#', created_at: new Date(NOW - 86400000 * 20).toISOString() },
];

export default {
  name: 'GdmBillingFrontend',
  props: {
    content: { type: Object, required: true },
    uid:     { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {

    /* ─── Data ─── */
    const rawList = computed(() => {
      const data = props.content?.billingData;
      if (!data) return [];
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : data;
      return Array.isArray(arr) ? arr : [];
    });

    const displayList = computed(() => {
      const items = rawList.value;
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing && items.length === 0) return PREVIEW;
      /* wwEditor:end */
      return items;
    });

    /* Sort newest first */
    const sortedList = computed(() =>
      [...displayList.value].sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
    );

    /* ─── Summary totals ─── */
    const summary = computed(() => {
      const calc = (statuses) => {
        const rows = displayList.value.filter(inv => statuses.includes(normStatus(inv.status)));
        return {
          count: rows.length,
          total: rows.reduce((s, inv) => s + (Number(inv.invoice_value) || 0), 0),
        };
      };
      return {
        upcoming:  calc(['upcoming']),
        issued:    calc(['issued', 'pending']),
        completed: calc(['completed']),
      };
    });

    /* ─── View mode ─── */
    const isAdmin = computed(() => props.content?.viewMode !== 'client');

    /* ─── Edition-mode guard ─── */
    const isEditionMode = () => {
      /* wwEditor:start */
      return props.wwEditorState?.editMode === wwLib?.wwEditorHelper?.EDIT_MODES?.EDITION;
      /* wwEditor:end */
      return false; // eslint-disable-line no-unreachable
    };

    /* ─── Form state ─── */
    const formVisible = ref(false);
    const editingId   = ref(null);
    const blankForm   = () => ({
      title: '', type: '', description: '',
      invoice_number: '', invoice_reference: '',
      einvoice_uuid: '', invoice_value: '',
      status: 'Upcoming', folder_link: '',
    });
    const form = ref(blankForm());

    const openAdd = () => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      form.value   = blankForm();
      editingId.value = null;
      formVisible.value = true;
    };

    const startEdit = (inv) => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      form.value = {
        title:              inv.title              || '',
        type:               inv.type               || '',
        description:        inv.description        || '',
        invoice_number:     inv.invoice_number     || '',
        invoice_reference:  inv.invoice_reference  || '',
        einvoice_uuid:      inv.einvoice_uuid      || '',
        invoice_value:      inv.invoice_value      ?? '',
        status:             inv.status             || 'Upcoming',
        folder_link:        inv.folder_link        || '',
      };
      editingId.value   = inv.id;
      formVisible.value = true;
    };

    const cancelForm = () => {
      formVisible.value = false;
      editingId.value   = null;
      form.value        = blankForm();
    };

    const handleSubmit = () => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      const payload = {
        title:             form.value.title             || null,
        type:              form.value.type              || null,
        description:       form.value.description       || null,
        client_id:         props.content?.clientId      || null,
        project_id:        props.content?.projectId     || null,
        invoice_number:    form.value.invoice_number    || null,
        invoice_reference: form.value.invoice_reference || null,
        einvoice_uuid:     form.value.einvoice_uuid     || null,
        invoice_value:     form.value.invoice_value !== '' ? Number(form.value.invoice_value) : null,
        status:            form.value.status,
        folder_link:       form.value.folder_link       || null,
      };
      if (editingId.value) {
        emit('trigger-event', { name: 'onUpdateInvoice', event: { value: { id: editingId.value, ...payload } } });
      } else {
        emit('trigger-event', { name: 'onAddInvoice', event: { value: payload } });
      }
      cancelForm();
    };

    const handleDelete = (inv) => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      if (inv._p) return;
      emit('trigger-event', { name: 'onDeleteInvoice', event: { value: { id: inv.id, title: inv.title } } });
    };

    const handleClick = (inv) => {
      /* wwEditor:start */
      if (isEditionMode()) return;
      /* wwEditor:end */
      if (inv._p) return;
      emit('trigger-event', { name: 'onInvoiceClick', event: { value: { invoice: inv } } });
    };

    /* ─── Helpers ─── */
    const normStatus = (s) => String(s || '').toLowerCase().trim();

    const formatDate = (d) => {
      if (!d) return '';
      try {
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch { return String(d); }
    };

    const formatAmount = (v) => {
      const n = Number(v);
      if (v == null || v === '' || isNaN(n)) return '—';
      const symbol = props.content?.currencySymbol || '';
      const formatted = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
      return symbol ? `${symbol} ${formatted}` : formatted;
    };

    /* ─── Styles ─── */
    const cssVars = computed(() => ({
      fontFamily: props.content?.fontFamily || 'DM Sans, system-ui, sans-serif',
      fontSize:   props.content?.fontSize   || '15px',
      '--gdm-accent':    props.content?.accentColor    || '#0d9488',
      '--gdm-upcoming':  props.content?.upcomingColor  || '#f59e0b',
      '--gdm-issued':    props.content?.issuedColor    || '#3b82f6',
      '--gdm-completed': props.content?.completedColor || '#10b981',
      '--gdm-text':      props.content?.textColor      || '#1e293b',
      minHeight: '120px',
    }));

    const cardStyles = computed(() => ({
      backgroundColor: props.content?.cardBackgroundColor || '#ffffff',
      borderRadius:    props.content?.cardBorderRadius    || '12px',
      padding:         props.content?.cardPadding         || '1.5rem',
    }));

    return {
      isAdmin,
      sortedList,
      summary,
      formVisible, editingId, form,
      openAdd, startEdit, cancelForm, handleSubmit,
      handleDelete, handleClick,
      normStatus, formatDate, formatAmount,
      cssVars, cardStyles,
    };
  },
};
</script>

<style lang="scss" scoped>
.gdm-bill {
  width: 100%;
  box-sizing: border-box;
  color: var(--gdm-text);
}

.gdm-icon { width: 14px; height: 14px; flex-shrink: 0; }

/* ─── Header ─── */
.gdm-bill__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.gdm-bill__header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gdm-bill__admin-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gdm-accent);
  background: color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
}

/* ─── Summary bar ─── */
.gdm-bill__summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
}

.gdm-bill__summary-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: #64748b;
}

.gdm-bill__summary-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  .gdm-bill__summary-item--upcoming & { background: var(--gdm-upcoming); }
  .gdm-bill__summary-item--issued &   { background: var(--gdm-issued); }
  .gdm-bill__summary-item--completed & { background: var(--gdm-completed); }
}

.gdm-bill__summary-val {
  font-weight: 700;
  color: #334155;
}

.gdm-bill__summary-sep { color: #cbd5e1; font-size: 0.875rem; }

/* ─── Shared buttons ─── */
.gdm-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  pointer-events: all;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;

  &:hover:not(:disabled) { opacity: 0.88; }
  &:active:not(:disabled) { transform: scale(0.97); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &--primary { background: var(--gdm-accent); color: #fff; }
  &--ghost   { background: #f1f5f9; color: #475569; border: 1.5px solid #e2e8f0; }
}

/* ─── Add/Edit form ─── */
.gdm-bill__form-wrap { margin-bottom: 1.25rem; }

.gdm-bill__form-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.gdm-bill__form-head {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.gdm-bill__form-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--gdm-text);
}

.gdm-bill__editing-badge {
  font-size: 0.6875rem;
  color: #f59e0b;
  background: #fef3c7;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.gdm-bill__form { display: flex; flex-direction: column; gap: 0.875rem; }

.gdm-bill__form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
}

.gdm-bill__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  &--full { grid-column: 1 / -1; }
}

.gdm-bill__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
}

.gdm-bill__req { color: #ef4444; }

.gdm-bill__input,
.gdm-bill__select,
.gdm-bill__textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.45rem 0.625rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  font-size: 0.875rem;
  font-family: inherit;
  background: #f8fafc;
  color: var(--gdm-text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: var(--gdm-accent);
    background: #fff;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--gdm-accent) 15%, transparent);
  }
  &::placeholder { color: #94a3b8; }
}

.gdm-bill__textarea { resize: vertical; min-height: 56px; }

.gdm-bill__form-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.25rem;
}

/* ─── Invoice list (cards) ─── */
.gdm-bill__list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.gdm-bill__row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); border-color: #cbd5e1; }
  &--preview { opacity: 0.75; }
  &--editing {
    border-color: var(--gdm-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  }
}

/* Head row: status | title | amount */
.gdm-bill__row-head {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

/* Foot row: meta | actions */
.gdm-bill__row-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.gdm-bill__status-badge {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
  color: #fff;
  background: #94a3b8;

  &--upcoming  { background: var(--gdm-upcoming); }
  &--issued    { background: var(--gdm-issued); }
  &--pending   { background: var(--gdm-issued); }
  &--completed { background: var(--gdm-completed); }
}

.gdm-bill__inv-num {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #94a3b8;
  font-family: 'SF Mono', 'Fira Code', monospace;
  letter-spacing: 0.02em;
}

/* Title */
.gdm-bill__row-title {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gdm-text);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Meta chips row */
.gdm-bill__row-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.gdm-bill__type-pill {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gdm-accent);
  background: color-mix(in srgb, var(--gdm-accent) 10%, transparent);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  white-space: nowrap;
}

.gdm-bill__ref {
  font-size: 0.75rem;
  color: #64748b;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.gdm-bill__date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.gdm-bill__desc {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
}

/* Amount */
.gdm-bill__amount {
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--gdm-text);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Actions */
.gdm-bill__row-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.gdm-bill__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  text-decoration: none;
  color: #94a3b8;
  pointer-events: all;
  transition: color 0.15s, background 0.15s;

  &--link:hover  { color: var(--gdm-accent); background: color-mix(in srgb, var(--gdm-accent) 10%, transparent); }
  &--edit:hover  { color: #3b82f6; background: #eff6ff; }
  &--delete:hover { color: #ef4444; background: #fef2f2; }
}

/* ─── Empty state ─── */
.gdm-bill__empty {
  padding: 2.5rem 1rem;
  text-align: center;
  background: #f8fafc;
  border-radius: 10px;
  border: 1.5px dashed #e2e8f0;
}
.gdm-bill__empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.gdm-bill__empty-text { margin: 0 0 0.25rem; font-weight: 600; color: #475569; }
.gdm-bill__empty-sub  { margin: 0; font-size: 0.8125rem; color: #94a3b8; }

/* ─── Responsive ─── */
@media (max-width: 520px) {
  .gdm-bill__row-head { flex-wrap: wrap; }
  .gdm-bill__summary { font-size: 0.75rem; }
}
</style>
