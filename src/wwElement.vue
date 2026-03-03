<template>
  <div class="gdm-billing" :style="wrapperStyles">
    <div
      class="gdm-billing__layout"
      :class="{ 'gdm-billing__layout--stacked': content?.layoutMode === 'stacked' }"
    >
      <!-- Upcoming -->
      <section class="gdm-billing__section">
        <h3 class="gdm-billing__section-title" :style="{ color: content?.sectionHeaderColor || '#1e293b' }">
          {{ upcomingLabel }}
        </h3>
        <div class="gdm-billing__cards">
          <div
            v-for="inv in upcomingInvoices"
            :key="getInvoiceId(inv)"
            class="gdm-billing__card"
            :style="getCardStyles('upcoming')"
            :class="{ 'gdm-billing__card--disabled': content?.disableInteractions }"
            @click="handleInvoiceClick(inv)"
          >
            <div class="gdm-billing__card-accent" :style="{ backgroundColor: content?.upcomingAccentColor || '#f59e0b' }" />
            <div class="gdm-billing__card-body">
              <div class="gdm-billing__card-title">{{ getInvoiceTitle(inv) }}</div>
              <div class="gdm-billing__card-meta">
                <span v-if="getInvoiceNumber(inv)" class="gdm-billing__card-meta-item">#{{ getInvoiceNumber(inv) }}</span>
                <span class="gdm-billing__card-meta-item gdm-billing__card-value">{{ formatValue(getInvoiceValue(inv)) }}</span>
              </div>
              <div v-if="getCreatedAt(inv)" class="gdm-billing__card-date">{{ formatDate(getCreatedAt(inv)) }}</div>
            </div>
          </div>
          <div v-if="upcomingInvoices.length === 0" class="gdm-billing__empty">
            {{ emptyLabel }}
          </div>
        </div>
      </section>

      <!-- Pending -->
      <section class="gdm-billing__section">
        <h3 class="gdm-billing__section-title" :style="{ color: content?.sectionHeaderColor || '#1e293b' }">
          {{ pendingLabel }}
        </h3>
        <div class="gdm-billing__cards">
          <div
            v-for="inv in pendingInvoices"
            :key="getInvoiceId(inv)"
            class="gdm-billing__card"
            :style="getCardStyles('pending')"
            :class="{ 'gdm-billing__card--disabled': content?.disableInteractions }"
            @click="handleInvoiceClick(inv)"
          >
            <div class="gdm-billing__card-accent" :style="{ backgroundColor: content?.pendingAccentColor || '#3b82f6' }" />
            <div class="gdm-billing__card-body">
              <div class="gdm-billing__card-title">{{ getInvoiceTitle(inv) }}</div>
              <div class="gdm-billing__card-meta">
                <span v-if="getInvoiceNumber(inv)" class="gdm-billing__card-meta-item">#{{ getInvoiceNumber(inv) }}</span>
                <span class="gdm-billing__card-meta-item gdm-billing__card-value">{{ formatValue(getInvoiceValue(inv)) }}</span>
              </div>
              <div v-if="getCreatedAt(inv)" class="gdm-billing__card-date">{{ formatDate(getCreatedAt(inv)) }}</div>
            </div>
          </div>
          <div v-if="pendingInvoices.length === 0" class="gdm-billing__empty">
            {{ emptyLabel }}
          </div>
        </div>
      </section>

      <!-- Completed -->
      <section class="gdm-billing__section">
        <h3 class="gdm-billing__section-title" :style="{ color: content?.sectionHeaderColor || '#1e293b' }">
          {{ completedLabel }}
        </h3>
        <div class="gdm-billing__cards">
          <div
            v-for="inv in completedInvoices"
            :key="getInvoiceId(inv)"
            class="gdm-billing__card"
            :style="getCardStyles('completed')"
            :class="{ 'gdm-billing__card--disabled': content?.disableInteractions }"
            @click="handleInvoiceClick(inv)"
          >
            <div class="gdm-billing__card-accent" :style="{ backgroundColor: content?.completedAccentColor || '#10b981' }" />
            <div class="gdm-billing__card-body">
              <div class="gdm-billing__card-title">{{ getInvoiceTitle(inv) }}</div>
              <div class="gdm-billing__card-meta">
                <span v-if="getInvoiceNumber(inv)" class="gdm-billing__card-meta-item">#{{ getInvoiceNumber(inv) }}</span>
                <span class="gdm-billing__card-meta-item gdm-billing__card-value">{{ formatValue(getInvoiceValue(inv)) }}</span>
              </div>
              <div v-if="getCreatedAt(inv)" class="gdm-billing__card-date">{{ formatDate(getCreatedAt(inv)) }}</div>
            </div>
          </div>
          <div v-if="completedInvoices.length === 0" class="gdm-billing__empty">
            {{ emptyLabel }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

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
    const resolveMappingFormula =
      typeof wwLib !== 'undefined' && wwLib?.wwFormula?.useFormula
        ? wwLib.wwFormula.useFormula().resolveMappingFormula
        : () => undefined;

    const billingList = computed(() => {
      const data = props.content?.billingData;
      if (!data) return [];
      const arr = typeof wwLib !== 'undefined' && wwLib?.wwUtils?.getDataFromCollection
        ? wwLib.wwUtils.getDataFromCollection(data)
        : props.content?.billingData;
      return Array.isArray(arr) ? arr : [];
    });

    const normalizeStatus = (s) => {
      if (s == null || s === '') return '';
      return String(s).toLowerCase().trim();
    };

    const upcomingInvoices = computed(() =>
      billingList.value.filter((inv) => normalizeStatus(getStatus(inv)) === 'upcoming')
    );
    const pendingInvoices = computed(() =>
      billingList.value.filter((inv) => normalizeStatus(getStatus(inv)) === 'pending')
    );
    const completedInvoices = computed(() =>
      billingList.value.filter((inv) => normalizeStatus(getStatus(inv)) === 'completed')
    );

    const getStatus = (item) =>
      resolveMappingFormula(props.content?.statusFormula, item) ?? item.status ?? '';

    const getInvoiceId = (item) =>
      resolveMappingFormula(props.content?.idFormula, item) ?? item.id ?? '';

    const getInvoiceTitle = (item) =>
      resolveMappingFormula(props.content?.titleFormula, item) ?? item.title ?? 'Untitled';

    const getInvoiceNumber = (item) =>
      resolveMappingFormula(props.content?.invoiceNumberFormula, item) ?? item.invoice_number ?? '';

    const getInvoiceValue = (item) => {
      const v = resolveMappingFormula(props.content?.invoiceValueFormula, item) ?? item.invoice_value;
      return v != null ? Number(v) : 0;
    };

    const getCreatedAt = (item) =>
      resolveMappingFormula(props.content?.createdAtFormula, item) ?? item.created_at ?? '';

    const formatValue = (val) => {
      if (val == null || isNaN(val)) return '—';
      return new Intl.NumberFormat(undefined, { style: 'decimal', minimumFractionDigits: 0 }).format(val);
    };

    const formatDate = (d) => {
      if (!d) return '';
      try {
        const date = typeof d === 'string' ? new Date(d) : d;
        return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch {
        return String(d);
      }
    };

    const handleInvoiceClick = (invoice) => {
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing || props.content?.disableInteractions) return;
      /* wwEditor:end */
      if (props.content?.disableInteractions) return;
      emit('trigger-event', { name: 'onInvoiceClick', event: { value: { invoice } } });
    };

    const upcomingLabel = computed(() => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(props.content?.upcomingLabel) || 'Upcoming';
      }
      return props.content?.upcomingLabel || 'Upcoming';
    });

    const pendingLabel = computed(() => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(props.content?.pendingLabel) || 'Pending';
      }
      return props.content?.pendingLabel || 'Pending';
    });

    const completedLabel = computed(() => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(props.content?.completedLabel) || 'Completed';
      }
      return props.content?.completedLabel || 'Completed';
    });

    const emptyLabel = computed(() => {
      if (typeof wwLib !== 'undefined' && wwLib?.wwLang?.getText) {
        return wwLib.wwLang.getText(props.content?.emptyLabel) || 'No invoices';
      }
      return props.content?.emptyLabel || 'No invoices';
    });

    const wrapperStyles = computed(() => ({
      fontFamily: props.content?.fontFamily || 'DM Sans, system-ui, sans-serif',
      fontSize: props.content?.fontSize || '15px',
    }));

    const getCardStyles = () => ({
      backgroundColor: props.content?.cardBackgroundColor || '#ffffff',
      borderRadius: props.content?.cardBorderRadius || '10px',
      padding: props.content?.cardPadding || '16px',
    });

    return {
      content: computed(() => props.content),
      upcomingInvoices,
      pendingInvoices,
      completedInvoices,
      upcomingLabel,
      pendingLabel,
      completedLabel,
      emptyLabel,
      wrapperStyles,
      getCardStyles,
      getInvoiceId,
      getInvoiceTitle,
      getInvoiceNumber,
      getInvoiceValue,
      getCreatedAt,
      getStatus,
      formatValue,
      formatDate,
      handleInvoiceClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.gdm-billing {
  width: 100%;
}

.gdm-billing__layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  align-items: start;

  &--stacked {
    grid-template-columns: 1fr;
  }
}

.gdm-billing__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.gdm-billing__section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.gdm-billing__cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gdm-billing__card {
  position: relative;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.02s;
  overflow: hidden;

  &:hover:not(.gdm-billing__card--disabled) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active:not(.gdm-billing__card--disabled) {
    transform: scale(0.99);
  }

  &--disabled {
    cursor: default;
  }
}

.gdm-billing__card-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.gdm-billing__card-body {
  padding-left: 12px;
}

.gdm-billing__card-title {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.gdm-billing__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.gdm-billing__card-value {
  font-weight: 600;
  color: #0f172a;
}

.gdm-billing__card-date {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.gdm-billing__empty {
  font-size: 0.875rem;
  color: #94a3b8;
  font-style: italic;
  padding: 1rem;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
}
</style>
