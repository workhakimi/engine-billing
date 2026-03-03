<template>
  <div class="gdm-billing" :style="cssVars">

    <!-- Admin badge -->
    <div v-if="isAdmin" class="gdm-billing__mode-badge">Admin view</div>

    <div
      class="gdm-billing__layout"
      :class="{ 'gdm-billing__layout--stacked': props.content?.layoutMode === 'stacked' }"
    >
      <!-- Upcoming -->
      <section class="gdm-billing__section">
        <div class="gdm-billing__section-header">
          <div class="gdm-billing__section-dot" :style="{ background: upcomingColor }"></div>
          <h3 class="gdm-billing__section-title">{{ upcomingLabel }}</h3>
          <span class="gdm-billing__section-count">{{ upcomingInvoices.length }}</span>
        </div>
        <div class="gdm-billing__cards">
          <div
            v-for="inv in upcomingInvoices"
            :key="getField('id', inv)"
            class="gdm-billing__card"
            :style="cardStyles"
            @click="handleClick(inv)"
          >
            <div class="gdm-billing__card-accent" :style="{ background: upcomingColor }"></div>
            <div class="gdm-billing__card-body">
              <div class="gdm-billing__card-top">
                <span class="gdm-billing__card-title">{{ getField('title', inv) || 'Invoice' }}</span>
                <span class="gdm-billing__card-amount">{{ formatValue(getField('value', inv)) }}</span>
              </div>
              <div class="gdm-billing__card-meta">
                <span v-if="getField('number', inv)" class="gdm-billing__card-num">#{{ getField('number', inv) }}</span>
                <span v-if="getField('type', inv)" class="gdm-billing__card-type">{{ getField('type', inv) }}</span>
              </div>
              <!-- Admin-only: reference -->
              <div v-if="isAdmin && getField('reference', inv)" class="gdm-billing__card-ref">
                Ref: {{ getField('reference', inv) }}
              </div>
              <div class="gdm-billing__card-footer">
                <span class="gdm-billing__card-date">{{ formatDate(getField('date', inv)) }}</span>
                <button
                  v-if="isAdmin"
                  type="button"
                  class="gdm-billing__delete-btn"
                  @click.stop="handleDelete(inv)"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          <div v-if="upcomingInvoices.length === 0" class="gdm-billing__empty">
            {{ emptyLabel }}
          </div>
        </div>
      </section>

      <!-- Pending -->
      <section class="gdm-billing__section">
        <div class="gdm-billing__section-header">
          <div class="gdm-billing__section-dot" :style="{ background: pendingColor }"></div>
          <h3 class="gdm-billing__section-title">{{ pendingLabel }}</h3>
          <span class="gdm-billing__section-count">{{ pendingInvoices.length }}</span>
        </div>
        <div class="gdm-billing__cards">
          <div
            v-for="inv in pendingInvoices"
            :key="getField('id', inv)"
            class="gdm-billing__card"
            :style="cardStyles"
            @click="handleClick(inv)"
          >
            <div class="gdm-billing__card-accent" :style="{ background: pendingColor }"></div>
            <div class="gdm-billing__card-body">
              <div class="gdm-billing__card-top">
                <span class="gdm-billing__card-title">{{ getField('title', inv) || 'Invoice' }}</span>
                <span class="gdm-billing__card-amount">{{ formatValue(getField('value', inv)) }}</span>
              </div>
              <div class="gdm-billing__card-meta">
                <span v-if="getField('number', inv)" class="gdm-billing__card-num">#{{ getField('number', inv) }}</span>
                <span v-if="getField('type', inv)" class="gdm-billing__card-type">{{ getField('type', inv) }}</span>
              </div>
              <div v-if="isAdmin && getField('reference', inv)" class="gdm-billing__card-ref">
                Ref: {{ getField('reference', inv) }}
              </div>
              <div class="gdm-billing__card-footer">
                <span class="gdm-billing__card-date">{{ formatDate(getField('date', inv)) }}</span>
                <button v-if="isAdmin" type="button" class="gdm-billing__delete-btn" @click.stop="handleDelete(inv)" title="Delete">✕</button>
              </div>
            </div>
          </div>
          <div v-if="pendingInvoices.length === 0" class="gdm-billing__empty">{{ emptyLabel }}</div>
        </div>
      </section>

      <!-- Completed -->
      <section class="gdm-billing__section">
        <div class="gdm-billing__section-header">
          <div class="gdm-billing__section-dot" :style="{ background: completedColor }"></div>
          <h3 class="gdm-billing__section-title">{{ completedLabel }}</h3>
          <span class="gdm-billing__section-count">{{ completedInvoices.length }}</span>
        </div>
        <div class="gdm-billing__cards">
          <div
            v-for="inv in completedInvoices"
            :key="getField('id', inv)"
            class="gdm-billing__card"
            :style="cardStyles"
            @click="handleClick(inv)"
          >
            <div class="gdm-billing__card-accent" :style="{ background: completedColor }"></div>
            <div class="gdm-billing__card-body">
              <div class="gdm-billing__card-top">
                <span class="gdm-billing__card-title">{{ getField('title', inv) || 'Invoice' }}</span>
                <span class="gdm-billing__card-amount">{{ formatValue(getField('value', inv)) }}</span>
              </div>
              <div class="gdm-billing__card-meta">
                <span v-if="getField('number', inv)" class="gdm-billing__card-num">#{{ getField('number', inv) }}</span>
                <span v-if="getField('type', inv)" class="gdm-billing__card-type">{{ getField('type', inv) }}</span>
              </div>
              <div v-if="isAdmin && getField('reference', inv)" class="gdm-billing__card-ref">
                Ref: {{ getField('reference', inv) }}
              </div>
              <div class="gdm-billing__card-footer">
                <span class="gdm-billing__card-date">{{ formatDate(getField('date', inv)) }}</span>
                <button v-if="isAdmin" type="button" class="gdm-billing__delete-btn" @click.stop="handleDelete(inv)" title="Delete">✕</button>
              </div>
            </div>
          </div>
          <div v-if="completedInvoices.length === 0" class="gdm-billing__empty">{{ emptyLabel }}</div>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
import { computed } from 'vue';

const NOW = Date.now();
const PREVIEW = [
  { id: 'p1', _p: true, title: 'Website Redesign – Deposit', invoice_number: 'INV-001', invoice_value: 3500, type: 'service', status: 'upcoming', created_at: new Date(NOW - 86400000).toISOString() },
  { id: 'p2', _p: true, title: 'Monthly Retainer – March', invoice_number: 'INV-002', invoice_value: 1200, type: 'retainer', status: 'upcoming', created_at: new Date(NOW - 86400000 * 3).toISOString() },
  { id: 'p3', _p: true, title: 'Brand Guidelines Deck', invoice_number: 'INV-003', invoice_value: 2800, type: 'service', status: 'pending', created_at: new Date(NOW - 86400000 * 7).toISOString() },
  { id: 'p4', _p: true, title: 'SEO Audit Report', invoice_number: 'INV-004', invoice_value: 950, type: 'audit', status: 'pending', created_at: new Date(NOW - 86400000 * 10).toISOString() },
  { id: 'p5', _p: true, title: 'Q4 Social Content', invoice_number: 'INV-005', invoice_value: 1800, type: 'service', status: 'completed', created_at: new Date(NOW - 86400000 * 30).toISOString() },
  { id: 'p6', _p: true, title: 'Logo Design Package', invoice_number: 'INV-006', invoice_value: 2200, type: 'design', status: 'completed', created_at: new Date(NOW - 86400000 * 45).toISOString() },
];

export default {
  name: 'GdmBillingFrontend',
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {

    /* ─── Field resolver (lazy, called inside computed) ─── */
    const resolve = (formulaKey, item, fallbackKey) => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwFormula?.useFormula) {
        const fn = wwLib.wwFormula.useFormula().resolveMappingFormula;
        const v = fn(props.content?.[formulaKey], item);
        if (v !== undefined && v !== null) return v;
      }
      return item[fallbackKey] ?? item[formulaKey] ?? '';
    };

    /* ─── Raw list from binding ─── */
    const rawList = computed(() => {
      const data = props.content?.billingData;
      if (!data) return [];
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : data;
      return Array.isArray(arr) ? arr : [];
    });

    /* ─── Display list with editor preview fallback ─── */
    const displayList = computed(() => {
      const items = rawList.value;
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing && items.length === 0) return PREVIEW;
      /* wwEditor:end */
      return items;
    });

    /* ─── Field getter ─── */
    const fieldMap = {
      id: ['idFormula', 'id'],
      title: ['titleFormula', 'title'],
      type: ['typeFormula', 'type'],
      status: ['statusFormula', 'status'],
      number: ['invoiceNumberFormula', 'invoice_number'],
      reference: ['invoiceReferenceFormula', 'invoice_reference'],
      value: ['invoiceValueFormula', 'invoice_value'],
      date: ['createdAtFormula', 'created_at'],
    };
    const getField = (field, item) => {
      const [fk, fb] = fieldMap[field] || [null, field];
      return fk ? resolve(fk, item, fb) : (item[fb] ?? '');
    };

    /* ─── Filtered lists ─── */
    const filterByStatus = (s) => computed(() =>
      displayList.value.filter(inv => String(getField('status', inv)).toLowerCase().trim() === s)
    );
    const upcomingInvoices  = filterByStatus('upcoming');
    const pendingInvoices   = filterByStatus('pending');
    const completedInvoices = filterByStatus('completed');

    /* ─── View mode ─── */
    const isAdmin = computed(() => props.content?.viewMode !== 'client');

    /* ─── Event handlers ─── */
    const handleClick = (invoice) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      if (invoice._p) return;
      emit('trigger-event', { name: 'onInvoiceClick', event: { value: { invoice } } });
    };
    const handleDelete = (invoice) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) return;
      /* wwEditor:end */
      if (invoice._p) return;
      emit('trigger-event', { name: 'onDeleteInvoice', event: { value: { id: invoice.id, title: invoice.title } } });
    };

    /* ─── Labels ─── */
    const getText = (val, fb) => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) return wwLib.wwLang.getText(val) || fb;
      return val || fb;
    };
    const upcomingLabel  = computed(() => getText(props.content?.upcomingLabel, 'Upcoming'));
    const pendingLabel   = computed(() => getText(props.content?.pendingLabel, 'Pending'));
    const completedLabel = computed(() => getText(props.content?.completedLabel, 'Completed'));
    const emptyLabel     = computed(() => getText(props.content?.emptyLabel, 'No invoices'));

    /* ─── Colors ─── */
    const upcomingColor  = computed(() => props.content?.upcomingAccentColor  || '#f59e0b');
    const pendingColor   = computed(() => props.content?.pendingAccentColor   || '#3b82f6');
    const completedColor = computed(() => props.content?.completedAccentColor || '#10b981');

    /* ─── Formatters ─── */
    const formatValue = (v) => {
      const n = Number(v);
      return (v == null || isNaN(n)) ? '—' : new Intl.NumberFormat(undefined, { minimumFractionDigits: 0 }).format(n);
    };
    const formatDate = (d) => {
      if (!d) return '';
      try {
        const date = new Date(d);
        return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch { return String(d); }
    };

    /* ─── Styles ─── */
    const cssVars = computed(() => ({
      fontFamily: props.content?.fontFamily || 'DM Sans, system-ui, sans-serif',
      fontSize: props.content?.fontSize || '15px',
      '--gdm-header-color': props.content?.sectionHeaderColor || '#1e293b',
      '--gdm-accent': props.content?.accentColor || '#0d9488',
      minHeight: '120px',
    }));
    const cardStyles = computed(() => ({
      backgroundColor: props.content?.cardBackgroundColor || '#ffffff',
      borderRadius: props.content?.cardBorderRadius || '10px',
      padding: props.content?.cardPadding || '16px',
    }));

    return {
      props,
      isAdmin,
      upcomingInvoices,
      pendingInvoices,
      completedInvoices,
      upcomingLabel,
      pendingLabel,
      completedLabel,
      emptyLabel,
      upcomingColor,
      pendingColor,
      completedColor,
      cssVars,
      cardStyles,
      getField,
      formatValue,
      formatDate,
      handleClick,
      handleDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
.gdm-billing {
  width: 100%;
  box-sizing: border-box;
}

.gdm-billing__mode-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gdm-accent);
  background: color-mix(in srgb, var(--gdm-accent) 12%, transparent);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.gdm-billing__layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
  &--stacked { grid-template-columns: 1fr; }
}

.gdm-billing__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.gdm-billing__section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.gdm-billing__section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.gdm-billing__section-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--gdm-header-color);
  flex: 1;
}
.gdm-billing__section-count {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 99px;
  padding: 0 0.375rem;
}

.gdm-billing__cards { display: flex; flex-direction: column; gap: 0.625rem; }

.gdm-billing__card {
  position: relative;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.18s, transform 0.1s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.09); transform: translateY(-1px); }
  &:active { transform: scale(0.99); }
}

.gdm-billing__card-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}
.gdm-billing__card-body { padding-left: 8px; }

.gdm-billing__card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.gdm-billing__card-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.gdm-billing__card-amount {
  font-weight: 700;
  font-size: 0.9375rem;
  color: #0f172a;
  flex-shrink: 0;
}
.gdm-billing__card-meta {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}
.gdm-billing__card-num {
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
}
.gdm-billing__card-type {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
}
.gdm-billing__card-ref {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: monospace;
  margin-bottom: 0.25rem;
}
.gdm-billing__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.375rem;
}
.gdm-billing__card-date { font-size: 0.75rem; color: #94a3b8; }
.gdm-billing__delete-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.6875rem;
  color: #94a3b8;
  padding: 2px 4px;
  border-radius: 3px;
  transition: color 0.15s, background 0.15s;
  &:hover { color: #ef4444; background: #fef2f2; }
}

.gdm-billing__empty {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-style: italic;
  padding: 1.25rem;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
  border: 1.5px dashed #e2e8f0;
}
</style>
